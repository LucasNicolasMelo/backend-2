import { ticketRepository } from "../repositories/ticket.repository.js";
import { eventRepository } from "../repositories/event.repository.js";
import crypto from "crypto";
import { getUserById } from "../repositories/users.repository.js";
import { sendConfirmationEmail } from "./mail.service.js";

export async function createTicket(userId, eventId, quantity) {

    const event = await eventRepository.getById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.status = 404;
        throw error;
    }

    if (event.status === "cancelled" || event.status === "finished") {
        throw new Error("El evento no permite nuevas inscripciones");
    }

    if (event.status !== "published") {
        throw new Error("El evento no está publicado");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("La cantidad debe ser un número entero mayor a 0");
    }

    const existingTicket =
        await ticketRepository.findActiveByUserAndEvent(
            userId,
            eventId
        );

    if (existingTicket) {
        throw new Error(
            "El usuario ya tiene una inscripción activa para este evento"
        );
    }

    const occupiedCapacity =
        await ticketRepository.countActiveByEvent(eventId);

    const availableCapacity =
        event.capacity - occupiedCapacity;

    if (availableCapacity < quantity) {
        throw new Error(
            `No hay cupos suficientes. Cupos disponibles: ${availableCapacity}`
        );
    }

    const reservationCode =
        crypto.randomBytes(8).toString("hex").toUpperCase();

    const ticket = await ticketRepository.create({
        user: userId,
        event: eventId,
        status: "confirmed",
        quantity,
        reservationCode
    });

    const user = await getUserById(userId);

    if (user) {
        await sendConfirmationEmail({
            email: user.email,
            reservationCode: ticket.reservationCode,
            eventTitle: event.title,
            quantity: ticket.quantity
        });
    }

    return ticket;
}


export async function getMyTickets(userId) {
    return await ticketRepository.getByUser(userId);
}


export async function getEventTickets(eventId, userId, isAdmin = false) {

    const event = await eventRepository.getById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.status = 404;
        throw error;
    }

    if (
        !isAdmin &&
        String(event.organizer) !== String(userId)
    ) {
        const error = new Error(
            "No tenés permisos para ver los tickets de este evento"
        );
        error.status = 403;
        throw error;
    }

    return await ticketRepository.getByEvent(eventId);
}


export async function cancelTicket(ticketId, userId, isAdmin = false) {

    const ticket = await ticketRepository.getById(ticketId);

    if (!ticket) {
        const error = new Error("Ticket no encontrado");
        error.status = 404;
        throw error;
    }

    if (ticket.status === "cancelled") {
        throw new Error("El ticket ya está cancelado");
    }

    if (!isAdmin && String(ticket.user) !== String(userId)) {
        const error = new Error(
            "No tenés permisos para cancelar este ticket"
        );
        error.status = 403;
        throw error;
    }

    return await ticketRepository.cancel(ticketId);
}
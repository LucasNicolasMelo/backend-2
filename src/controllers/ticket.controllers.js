import { createTicket, getMyTickets, getEventTickets, cancelTicket } from "../services/ticket.service.js";
import { ticketDTO } from "../dto/ticket.dto.js";


export async function create(req, res, next) {
    try {

        const { eid } = req.params;
        const { quantity } = req.body;

        const ticket = await createTicket(
            req.user.id,
            eid,
            quantity
        );

        return res.status(201).json({
            status: "success",
            message: "Inscripción realizada correctamente",
            payload: ticketDTO(ticket)
        });

    } catch (error) {
        next(error);
    }
}


export async function getMine(req, res, next) {
    try {

        const tickets = await getMyTickets(req.user.id);

        return res.status(200).json({
            status: "success",
            payload: tickets.map(ticketDTO)
        });

    } catch (error) {
        next(error);
    }
}


export async function getByEvent(req, res, next) {
    try {

        const { eid } = req.params;

        const tickets = await getEventTickets(
            eid,
            req.user.id,
            req.user.role === "admin"
        );

        return res.status(200).json({
            status: "success",
            payload: tickets.map(ticketDTO)
        });

    } catch (error) {
        next(error);
    }
}


export async function cancel(req, res, next) {
    try {

        const { tid } = req.params;

        const ticket = await cancelTicket(
            tid,
            req.user.id,
            req.user.role === "admin"
        );

        return res.status(200).json({
            status: "success",
            message: "Ticket cancelado correctamente",
            payload: ticketDTO(ticket)
        });

    } catch (error) {
        next(error);
    }
}
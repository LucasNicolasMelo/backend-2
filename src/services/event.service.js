import { eventRepository } from "../repositories/event.repository.js";

export async function createEvent(eventData) {

    const { date, capacity, price } = eventData;

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        const error = new Error("La fecha del evento no es válida");
        error.status = 400;
        throw error;
    }

    if (eventDate < new Date()) {
        const error = new Error("La fecha del evento no puede ser pasada");
        error.status = 400;
        throw error;
    }

    if (capacity <= 0) {
        const error = new Error("La capacidad debe ser mayor a 0");
        error.status = 400;
        throw error;
    }

    if (price < 0) {
        const error = new Error("El precio no puede ser negativo");
        error.status = 400;
        throw error;
    }

    return await eventRepository.create(eventData);
}

export async function getEventById(eventId) {
    const event = await eventRepository.getById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.status = 404;
        throw error;
    }

    return event;
}

export async function getEvents(query = {}) {

    const {
        status,
        category,
        location,
        dateFrom,
        dateTo,
        page = 1,
        limit = 10,
        sort = "date"
    } = query;

    const filters = {};

    if (status) {
        filters.status = status;
    }

    if (category) {
        filters.category = category;
    }

    if (location) {
        filters.location = location;
    }

    if (dateFrom || dateTo) {
        filters.date = {};

        if (dateFrom) {
            const fromDate = new Date(dateFrom);

            if (isNaN(fromDate.getTime())) {
                const error = new Error("La fecha dateFrom no es válida");
                error.status = 400;
                throw error;
            }

            filters.date.$gte = fromDate;
        }

        if (dateTo) {
            const toDate = new Date(dateTo);

            if (isNaN(toDate.getTime())) {
                const error = new Error("La fecha dateTo no es válida");
                error.status = 400;
                throw error;
            }

            filters.date.$lte = toDate;
        }
    }

    return await eventRepository.getAll(filters, {
        page: Number(page),
        limit: Number(limit),
        sort
    });
}

export async function updateEvent(eventId, eventData, userId, userRole) {

    const event = await eventRepository.getById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.status = 404;
        throw error;
    }

    if (
        userRole !== "admin" &&
        String(event.organizer) !== String(userId)
    ) {
        const error = new Error(
            "No tenés permisos para modificar este evento"
        );
        error.status = 403;
        throw error;
    }

    if (event.status === "cancelled") {
        const error = new Error("No se puede modificar un evento cancelado");
        error.status = 400;
        throw error;
    }

    const { date, capacity, price } = eventData;

    if (date) {
        const eventDate = new Date(date);

        if (isNaN(eventDate.getTime())) {
            const error = new Error("La fecha del evento no es válida");
            error.status = 400;
            throw error;
        }

        if (eventDate < new Date()) {
            const error = new Error("La fecha del evento no puede ser pasada");
            error.status = 400;
            throw error;
        }
    }

    if (capacity !== undefined && capacity <= 0) {
        const error = new Error("La capacidad debe ser mayor a 0");
        error.status = 400;
        throw error;
    }

    if (price !== undefined && price < 0) {
        const error = new Error("El precio no puede ser negativo");
        error.status = 400;
        throw error;
    }

    const validStatuses = [
        "draft",
        "published",
        "cancelled",
        "finished"
    ];

    if (
        eventData.status &&
        !validStatuses.includes(eventData.status)
    ) {
        const error = new Error("Estado de evento inválido");
        error.status = 400;
        throw error;
    }

    if (
        eventData.status === "published" &&
        event.status === "finished"
    ) {
        const error = new Error(
            "No se puede publicar un evento finalizado"
        );
        error.status = 400;
        throw error;
    }

    return await eventRepository.update(eventId, eventData);
}

export async function updateEventStatus(eventId, status, userId, userRole) {

    const event = await eventRepository.getById(eventId);

    if (!event) {
        const error = new Error("Evento no encontrado");
        error.status = 404;
        throw error;
    }

    if (
        userRole !== "admin" &&
        String(event.organizer) !== String(userId)
    ) {
        const error = new Error(
            "No tenés permisos para modificar este evento"
        );
        error.status = 403;
        throw error;
    }

    if (event.status === "cancelled") {
        const error = new Error(
            "No se puede modificar el estado de un evento cancelado"
        );
        error.status = 400;
        throw error;
    }

    const validStatuses = [
        "draft",
        "published",
        "cancelled",
        "finished"
    ];

    if (!validStatuses.includes(status)) {
        const error = new Error("Estado de evento inválido");
        error.status = 400;
        throw error;
    }

    if (
        status === "published" &&
        event.status === "finished"
    ) {
        const error = new Error(
            "No se puede publicar un evento finalizado"
        );
        error.status = 400;
        throw error;
    }

    return await eventRepository.update(eventId, {
        status
    });
}
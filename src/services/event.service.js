import { eventRepository } from "../repositories/event.repository.js";

export async function createEvent(eventData) {

    const { date, capacity, price } = eventData;

    const eventDate = new Date(date);

    if (isNaN(eventDate.getTime())) {
        throw new Error("La fecha del evento no es válida");
    }

    if (eventDate < new Date()) {
        throw new Error("La fecha del evento no puede ser pasada");
    }

    if (capacity <= 0) {
        throw new Error("La capacidad debe ser mayor a 0");
    }

    if (price < 0) {
        throw new Error("El precio no puede ser negativo");
    }

    return await eventRepository.create(eventData);
}

export async function getEventById(eventId) {
    return await eventRepository.getById(eventId);
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
                throw new Error("La fecha dateFrom no es válida");
            }

            filters.date.$gte = fromDate;
        }

        if (dateTo) {
            const toDate = new Date(dateTo);

            if (isNaN(toDate.getTime())) {
                throw new Error("La fecha dateTo no es válida");
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

export async function updateEvent(eventId, eventData) {

    const event = await eventRepository.getById(eventId);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error("No se puede modificar un evento cancelado");
    }

    const { date, capacity, price } = eventData;

    if (date) {
        const eventDate = new Date(date);

        if (isNaN(eventDate.getTime())) {
            throw new Error("La fecha del evento no es válida");
        }

        if (eventDate < new Date()) {
            throw new Error("La fecha del evento no puede ser pasada");
        }
    }

    if (capacity !== undefined && capacity <= 0) {
        throw new Error("La capacidad debe ser mayor a 0");
    }

    if (price !== undefined && price < 0) {
        throw new Error("El precio no puede ser negativo");
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
        throw new Error("Estado de evento inválido");
    }

    if (
        eventData.status === "published" &&
        event.status === "finished"
    ) {
        throw new Error(
            "No se puede publicar un evento finalizado"
        );
    }

    return await eventRepository.update(eventId, eventData);
}

export async function updateEventStatus(eventId, status) {

    const event = await eventRepository.getById(eventId);

    if (!event) {
        throw new Error("Evento no encontrado");
    }

    if (event.status === "cancelled") {
        throw new Error(
            "No se puede modificar el estado de un evento cancelado"
        );
    }

    const validStatuses = [
        "draft",
        "published",
        "cancelled",
        "finished"
    ];

    if (!validStatuses.includes(status)) {
        throw new Error("Estado de evento inválido");
    }

    if (
        status === "published" &&
        event.status === "finished"
    ) {
        throw new Error(
            "No se puede publicar un evento finalizado"
        );
    }

    return await eventRepository.update(eventId, {
        status
    });
}
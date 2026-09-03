import { createEvent, getEventById, getEvents, updateEvent, updateEventStatus } from "../services/event.service.js";

export async function getAll(req, res, next) {
    try {
        const result = await getEvents(req.query);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        return res.status(200).json({
            status: "success",
            payload: {
                data: result.data,
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
}

export async function create(req, res, next) {
    try {
        const { title, description, category, date, location, price, capacity, status } = req.body;

        const event = await createEvent({
            title,
            description,
            category,
            date,
            location,
            price,
            capacity,
            status,
            organizer: req.user.id
        });

        return res.status(201).json({
            status: "success",
            payload: event
        });

    } catch (error) {
        next(error);
    }
}

export async function update(req, res, next) {
    try {
        const { eventId } = req.params;

        const event = await getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        if (
            req.user.role !== "admin" &&
            String(event.organizer) !== String(req.user.id)
        ) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para modificar este evento"
            });
        }

        const updatedEvent = await updateEvent(eventId, req.body);

        return res.status(200).json({
            status: "success",
            payload: updatedEvent
        });

    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        const { eventId } = req.params;

        const event = await getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            payload: event
        });

    } catch (error) {
        next(error);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const { eventId } = req.params;
        const { status } = req.body;

        const event = await getEventById(eventId);

        if (!event) {
            return res.status(404).json({
                status: "error",
                message: "Evento no encontrado"
            });
        }

        if (
            req.user.role !== "admin" &&
            String(event.organizer) !== String(req.user.id)
        ) {
            return res.status(403).json({
                status: "error",
                message: "No tenés permisos para modificar este evento"
            });
        }

        const updatedEvent = await updateEventStatus(eventId, status);

        return res.status(200).json({
            status: "success",
            payload: updatedEvent
        });

    } catch (error) {
        next(error);
    }
}
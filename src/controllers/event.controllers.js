import {
    createEvent,
    getEventById
} from "../services/event.service.js";

export async function getAll(req, res) {
    res.status(200).json({
        status: "success",
        payload: []
    });
}

export async function create(req, res, next) {
    try {
        const { name, date, place, price, capacity, status } = req.body;

        const event = await createEvent({
            name,
            date,
            place,
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

        Object.assign(event, req.body);

        const updatedEvent = await event.save();

        return res.status(200).json({
            status: "success",
            payload: updatedEvent
        });

    } catch (error) {
        next(error);
    }
}
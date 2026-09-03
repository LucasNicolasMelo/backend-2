import { createEvent, getEventById, getEvents, updateEvent, updateEventStatus } from "../services/event.service.js";
import { eventDTO } from "../dto/event.dto.js";

export async function getAll(req, res, next) {
    try {
        const result = await getEvents(req.query);

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        return res.status(200).json({
            status: "success",
            payload: {
                data: result.data.map(eventDTO),
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
            payload: eventDTO(event)
        });

    } catch (error) {
        next(error);
    }
}

export async function update(req, res, next) {
    try {
        const { eventId } = req.params;

        const updatedEvent = await updateEvent(
            eventId,
            req.body,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            status: "success",
            payload: eventDTO(updatedEvent)
        });

    } catch (error) {
        next(error);
    }
}

export async function getById(req, res, next) {
    try {
        const { eventId } = req.params;

        const event = await getEventById(eventId);

        return res.status(200).json({
            status: "success",
            payload: eventDTO(event)
        });

    } catch (error) {
        next(error);
    }
}

export async function changeStatus(req, res, next) {
    try {
        const { eventId } = req.params;
        const { status } = req.body;

        const updatedEvent = await updateEventStatus(
            eventId,
            status,
            req.user.id,
            req.user.role
        );

        return res.status(200).json({
            status: "success",
            payload: eventDTO(updatedEvent)
        });

    } catch (error) {
        next(error);
    }
}
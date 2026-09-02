import { eventModel } from "../models/event.model.js";

export async function createEvent(eventData) {
    return await eventModel.create(eventData);
}

export async function getEventById(eventId) {
    return await eventModel.findById(eventId);
}
import { ticketModel } from "../models/ticket.model.js";

export const ticketDAO = {

    create: async (ticketData) => {
        return await ticketModel.create(ticketData);
    },

    getById: async (id) => {
        return await ticketModel.findById(id);
    },

    getByUser: async (userId) => {
        return await ticketModel
            .find({ user: userId })
            .populate("event", "title date location");
    },

    getByEvent: async (eventId) => {
        return await ticketModel
            .find({ event: eventId })
            .populate("user", "first_name last_name email");
    },

    countActiveByEvent: async (eventId) => {
        const tickets = await ticketModel.find({
            event: eventId,
            status: { $ne: "cancelled" }
        });

        return tickets.reduce(
            (total, ticket) => total + ticket.quantity,
            0
        );
    },

    findActiveByUserAndEvent: async (userId, eventId) => {
        return await ticketModel.findOne({
            user: userId,
            event: eventId,
            status: { $ne: "cancelled" }
        });
    },

    cancel: async (ticketId) => {
        return await ticketModel.findByIdAndUpdate(
            ticketId,
            {
                status: "cancelled",
                cancelledAt: new Date()
            },
            {
                new: true
            }
        );
    }
};
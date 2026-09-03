import { ticketDAO } from "../dao/ticket.dao.js";

export const ticketRepository = {

    create: async (ticketData) => {
        return await ticketDAO.create(ticketData);
    },

    getById: async (id) => {
        return await ticketDAO.getById(id);
    },

    getByUser: async (userId) => {
        return await ticketDAO.getByUser(userId);
    },

    getByEvent: async (eventId) => {
        return await ticketDAO.getByEvent(eventId);
    },

    countActiveByEvent: async (eventId) => {
        return await ticketDAO.countActiveByEvent(eventId);
    },

    findActiveByUserAndEvent: async (userId, eventId) => {
        return await ticketDAO.findActiveByUserAndEvent(
            userId,
            eventId
        );
    },

    cancel: async (ticketId) => {
        return await ticketDAO.cancel(ticketId);
    }
};
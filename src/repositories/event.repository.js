import { eventDAO } from "../dao/event.dao.js";

export const eventRepository = {

    create: async (eventData) => {
        return await eventDAO.create(eventData);
    },

    getAll: async (filters = {}, options = {}) => {
        return await eventDAO.getAll(filters, options);
    },

    getById: async (id) => {
        return await eventDAO.getById(id);
    },

    update: async (id, eventData) => {
        return await eventDAO.update(id, eventData);
    }
};
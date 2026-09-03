import { eventModel } from "../models/event.model.js";

export const eventDAO = {

    create: async (eventData) => {
        return await eventModel.create(eventData);
    },

    getAll: async (filters = {}, options = {}) => {
        const {
            page = 1,
            limit = 10,
            sort = "date"
        } = options;

        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            eventModel
                .find(filters)
                .sort(sort)
                .skip(skip)
                .limit(limit),

            eventModel.countDocuments(filters)
        ]);

        return {
            data,
            total
        };
    },

    getById: async (id) => {
        return await eventModel.findById(id);
    },

    update: async (id, eventData) => {
        return await eventModel.findByIdAndUpdate(
            id,
            eventData,
            {
                new: true,
                runValidators: true
            }
        );
    }
};
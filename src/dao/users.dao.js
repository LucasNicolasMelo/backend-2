import userModel from "../models/user.model.js";

export const usersDAO = {
    create: async (userData) => {
        return await userModel.create(userData);
    },

    getByEmail: async (email) => {
        return await userModel.findOne({ email });
    },
    getById: async (id) => {
        return await userModel.findById(id);
    },

    getAll: async () => {
        return await userModel.find().lean();
    }
};
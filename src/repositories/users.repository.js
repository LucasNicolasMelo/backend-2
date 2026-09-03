import { usersDAO } from "../dao/users.dao.js";

export const usersRepository = {
    create: async (userData) => {
        return await usersDAO.create(userData);
    },

    findByEmail: async (email) => {
        return await usersDAO.getByEmail(email);
    },

    findById: async (id) => {
        return await usersDAO.getById(id);
    },

    findAll: async () => {
        return await usersDAO.getAll();
    }
};
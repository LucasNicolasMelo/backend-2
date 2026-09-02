import { usersDAO } from "../dao/users.dao.js";

export async function createUser(userData) {
    return await usersDAO.create(userData);
}

export async function getUserByEmail(email) {
    return await usersDAO.getByEmail(email);
}

export async function getAllUsers() {
    return await usersDAO.getAll();
}
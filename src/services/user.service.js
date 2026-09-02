import { getAllUsers } from "../repositories/users.repository.js";

export async function getAllUsersService() {
    return await getAllUsers();
}
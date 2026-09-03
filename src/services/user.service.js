import { usersRepository } from "../repositories/users.repository.js";

export async function getAllUsersService() {
    return await usersRepository.findAll();
}
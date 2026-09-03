import { getAllUsersService } from "../services/user.service.js";
import { userDTO } from "../dto/user.dto.js";

export async function getAllUsers(req, res, next) {
    try {
        const users = await getAllUsersService();

        return res.status(200).json({
            status: "success",
            payload: users.map(userDTO)
        });
    } catch (error) {
        next(error);
    }
}
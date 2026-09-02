import { registerUser } from "../services/session.service.js";

export async function register(req, res, next) {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan campos obligatorios"
            });
        }

        const user = await registerUser({
            first_name,
            last_name,
            email,
            password
        });

        res.status(201).json({
            status: "success",
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {

}
import { registerUser, getUserByEmail } from "../services/session.service.js";
import { isValidPassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan email y password"
            });
        }
        const normalizedEmail = email.trim().toLowerCase();

        const user = await getUserByEmail(normalizedEmail);

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "Credenciales inválidas"
            });
        }

        const validPassword = await isValidPassword(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                status: "error",
                message: "Credenciales inválidas"
            });
        }
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.cookie("currentUser", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 3600000,
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            status: "success",
            message: "Login exitoso"
        });

    } catch (error) {
        next(error);
    }
}

export async function current(req, res) {
    res.status(200).json({
        status: "success",
        payload: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
}

export async function logout(req, res) {
    res.clearCookie("currentUser");

    res.status(200).json({
        status: "success",
        message: "Logout exitoso"
    });
}
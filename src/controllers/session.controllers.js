import { generateToken } from "../utils/jwt.js";
import { userDTO, currentUserDTO } from "../dto/user.dto.js";

export async function register(req, res, next) {
    try {
        const user = req.user;

        return res.status(201).json({
            status: "success",
            payload: userDTO(user)
        });

    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const user = req.user;

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
    return res.status(200).json({
        status: "success",
        payload: currentUserDTO(req.user)
    });
}

export async function logout(req, res) {
    res.clearCookie("currentUser");

    return res.status(200).json({
        status: "success",
        message: "Logout exitoso"
    });
}
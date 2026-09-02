import { createUser, getUserByEmail } from "../repositories/users.repository.js";
import { createHash } from "../utils.js";

export async function registerUser(userData) {
    const { first_name, last_name, email, password } = userData;

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
        const error = new Error("La contraseña debe tener al menos 6 caracteres");
        error.status = 400;
        throw error;
    }

    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
        const error = new Error("El email ya está registrado");
        error.status = 409;
        throw error;
    }

    const hashedPassword = await createHash(password);

    const newUser = await createUser({
        first_name,
        last_name,
        email: normalizedEmail,
        password: hashedPassword
    });

    return newUser;
}
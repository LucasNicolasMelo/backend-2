import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

import {
    registerUser,
    getUserByEmail
} from "../services/session.service.js";

import { isValidPassword } from "../utils/hash.js";
import { verifyToken } from "../utils/jwt.js";


passport.use(
    "register",
    new CustomStrategy(async (req, done) => {
        try {
            const { first_name, last_name, email, password } = req.body;

            if (!first_name || !last_name || !email || !password) {
                const error = new Error("Faltan campos obligatorios");
                error.status = 400;
                return done(error);
            }

            const user = await registerUser({
                first_name,
                last_name,
                email,
                password
            });

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    })
);


passport.use(
    "login",
    new CustomStrategy(async (req, done) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                const error = new Error("Credenciales inválidas");
                error.status = 401;
                return done(error);
            }

            const normalizedEmail = email.trim().toLowerCase();

            const user = await getUserByEmail(normalizedEmail);

            if (!user) {
                const error = new Error("Credenciales inválidas");
                error.status = 401;
                return done(error);
            }

            const validPassword = await isValidPassword(
                password,
                user.password
            );

            if (!validPassword) {
                const error = new Error("Credenciales inválidas");
                error.status = 401;
                return done(error);
            }

            return done(null, user);

        } catch (error) {
            return done(error);
        }
    })
);


passport.use(
    "current",
    new CustomStrategy(async (req, done) => {
        try {
            const token = req.cookies.currentUser;

            if (!token) {
                const error = new Error("No autenticado");
                error.status = 401;
                return done(error);
            }

            const payload = verifyToken(token);

            return done(null, payload);

        } catch (error) {
            const authError = new Error("Token inválido o expirado");
            authError.status = 401;
            return done(authError);
        }
    })
);

export default passport;
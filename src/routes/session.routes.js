import { Router } from "express";
import passport from "../config/passport.config.js";

import {
    login,
    register,
    current,
    logout
} from "../controllers/session.controllers.js";

const router = Router();

router.post(
    "/register",
    passport.authenticate("register", {
        session: false,
        failWithError: true
    }),
    register
);

router.post(
    "/login",
    passport.authenticate("login", {
        session: false
    }),
    login
);

router.get(
    "/current",
    passport.authenticate("current", {
        session: false,
        failWithError: true
    }),
    current
);

router.post("/logout", logout);

export default router;
import { Router } from "express";

import {
    getMine,
    cancel
} from "../controllers/ticket.controllers.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get(
    "/my-tickets",
    auth,
    getMine
);

router.patch(
    "/:tid/cancel",
    auth,
    cancel
);

export default router;
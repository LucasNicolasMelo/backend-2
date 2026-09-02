import { Router } from "express";

import { getAll, create, update } from "../controllers/event.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getAll);

router.post(
    "/",
    auth,
    authorize("organizer", "admin"),
    create
);

router.put(
    "/:eventId",
    auth,
    authorize("organizer", "admin"),
    update
);

export default router;
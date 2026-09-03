import { Router } from "express";

import { getAll, getById, create, update, changeStatus } from "../controllers/event.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get("/", getAll);

router.get("/:eventId", getById);

router.post(
    "/",
    auth,
    authorize("organizer", "admin"),
    create
);

router.patch(
    "/:eventId/status",
    auth,
    authorize("organizer", "admin"),
    changeStatus
);

router.put(
    "/:eventId",
    auth,
    authorize("organizer", "admin"),
    update
);

export default router;
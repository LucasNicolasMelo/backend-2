import { Router } from "express";

import { getAll, getById, create, update, changeStatus } from "../controllers/event.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { getByEvent, create as createTicket } from "../controllers/ticket.controllers.js";

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

router.post(
    "/:eid/tickets",
    auth,
    createTicket
);

router.get(
    "/:eid/tickets",
    auth,
    authorize("organizer", "admin"),
    getByEvent
);

export default router;
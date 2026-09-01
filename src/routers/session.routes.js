import { Router } from "express";

import { session } from "../controllers/session.controllers.js";

const router = Router();

router.post("/", session);

export default router;
import { Router } from "express";

import { getAllUsers } from "../controllers/user.controllers.js";
import { auth } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const router = Router();

router.get(
    "/",
    auth,
    authorize("admin"),
    getAllUsers
);

export default router;
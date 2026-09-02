import express from 'express'
import { connectDB } from './config/database.js'
import {env} from './config/env.js'
import { errorHandler } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.config.js";


import userRouter from './routes/user.routes.js';
import ticketRouter from './routes/ticket.routes.js';
import eventRouter from './routes/event.routes.js';
import healthRouter from './routes/health.routes.js';
import sessionsRouter from './routes/session.routes.js';


const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.urlencoded({extended: true}));


app.use( "/api/users", userRouter)
app.use( "/api/tickets", ticketRouter)
app.use( "/api/events", eventRouter)
app.use("/api/health", healthRouter)
app.use("/api/sessions", sessionsRouter)

app.use(errorHandler);

export default app;
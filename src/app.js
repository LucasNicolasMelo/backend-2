import express from 'express'
import { connectDB } from './config/database.js'
import {env} from './config/env.js'

import userRouter from './routers/user.routes.js';
import ticketRouter from './routers/ticket.routes.js';
import eventRouter from './routers/event.routes.js';
import healthRouter from './routers/health.routes.js';
import sessionsRouter from './routers/session.routes.js';


const app = express()

app.use(express.json())

app.use( "/api/users", userRouter)
app.use( "/api/tickets", ticketRouter)
app.use( "/api/events", eventRouter)
app.use("/api/health", healthRouter)
app.use("/api/sessions", sessionsRouter)

export default app;
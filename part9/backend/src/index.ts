import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { z } from "zod";
import mongoose from "mongoose";
import dotenv from "dotenv";
// Node 18 no Node 20
dotenv.config();

import patientsRouter from "./routes/patients";
import diagnosesRouter from "./routes/diagnoses";

const app = express();

// middlewares básicos
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/patientor";
mongoose.connect(mongoUrl)
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error de conexión a MongoDB:", err));

// prueba de conexión
app.get("/api/ping", (_req, res) => {
    res.send("pong");
});

// routers de la API
app.use("/api/patients", patientsRouter);
app.use("/api/diagnoses", diagnosesRouter);

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
    } else {
        next(error);
    }
};

app.use(errorMiddleware);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
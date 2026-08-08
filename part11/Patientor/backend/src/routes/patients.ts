import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Patient } from "../models/patient";
import { NewPatientSchema } from "../types";

const router = express.Router();

const entrySchema = new mongoose.Schema({
    date: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    specialist: { type: String, required: true },
    diagnosisCodes: [{ type: String }],
    // Específicos de HealthCheck
    healthCheckRating: { type: Number },
    // Específicos de Hospital
    discharge: {
        date: { type: String },
        criteria: { type: String }
    },
    // Específicos de OccupationalHealthcare
    employerName: { type: String },
    sickLeave: {
        startDate: { type: String },
        endDate: { type: String }
    }
});

// Middleware de validación con Zod para nuevos pacientes
const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
    try {
        NewPatientSchema.parse(req.body);
        next();
    } catch (error: unknown) {
        next(error);
    }
};

// GET todos los pacientes
router.get("/", async (_req: Request, res: Response) => {
    try {
        const patients = await Patient.find({});
        res.json(patients.map(p => p.toJSON()));
    } catch {
        res.status(500).json({ error: "Error fetching patients" });
    }
});

// GET paciente por id
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ error: "Patient not found" });
        res.json(patient.toJSON());
    } catch {
        res.status(500).json({ error: "Error fetching patient" });
    }
});

// POST nuevo paciente (👈 AQUÍ APLICAMOS EL MIDDLEWARE newPatientParser)
router.post("/", newPatientParser, async (req: Request, res: Response) => {
    try {
        const newPatient = new Patient(req.body);
        const savedPatient = await newPatient.save();
        res.json(savedPatient.toJSON());
    } catch {
        res.status(400).json({ error: "Error saving patient" });
    }
});

// POST nueva entry para un paciente
router.post("/:id/entries", async (req: Request, res: Response) => {
    const { date, type, description, specialist, healthCheckRating, discharge, employerName, sickLeave, diagnosisCodes } = req.body;

    // 1. Validaciones comunes
    if (!date || !type || !description || !specialist) {
        return res.status(400).json({ error: "Missing required fields (date, type, description, specialist)" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ error: "Date must be in format YYYY-MM-DD" });
    }

    // 2. Validaciones específicas según el tipo
    if (type === "HealthCheck") {
        if (healthCheckRating === undefined || healthCheckRating < 0 || healthCheckRating > 3) {
            return res.status(400).json({ error: "Health check rating must be between 0 and 3" });
        }
    } else if (type === "Hospital") {
        if (!discharge || !discharge.date || !discharge.criteria) {
            return res.status(400).json({ error: "Hospital entries require discharge date and criteria" });
        }
    } else if (type === "OccupationalHealthcare") {
        if (!employerName) {
            return res.status(400).json({ error: "Occupational healthcare entries require an employerName" });
        }
    } else {
        return res.status(400).json({ error: "Invalid entry type" });
    }

    if (diagnosisCodes && !Array.isArray(diagnosisCodes)) {
        return res.status(400).json({ error: "diagnosisCodes must be an array" });
    }

    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        // Se construye el objeto dinámicamente según lo que llegó
        const newEntry: any = {
            date,
            type,
            description,
            specialist,
            diagnosisCodes
        };

        if (type === "HealthCheck") newEntry.healthCheckRating = healthCheckRating;
        if (type === "Hospital") newEntry.discharge = discharge;
        if (type === "OccupationalHealthcare") {
            newEntry.employerName = employerName;
            if (sickLeave) newEntry.sickLeave = sickLeave;
        }

        patient.entries.push(newEntry);
        const updatedPatient = await patient.save();
        res.json(updatedPatient.toJSON());
    } catch {
        res.status(500).json({ error: "Error saving entry" });
    }
});

export default router;
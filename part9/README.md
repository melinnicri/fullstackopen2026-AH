## Checklist final de la tarea Patientor del capítulo 9:

* Backend con Mongoose → patientSchema y entrySchema con toJSON transformando _id a id.

* Frontend con TypeScript → unión discriminada (HealthCheck, Hospital, OccupationalHealthcare) y diagnosisCodes opcional en BaseEntry.

* PatientDetails → muestra datos del paciente, entradas, estrellas de salud y códigos sanitarios con nombre.

* AddEntryForm → permite agregar nuevas entradas y actualiza el paciente.

* Keys únicas → uso de patient.id y entry.id en los map.

Backend/src/routes/patients.ts:

```
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
```

Backend/src/routes/diagnoses.ts:

```
import express from "express";

const router = express.Router();

const diagnoses = [
    { "code": "K35.80", "name": "Acute appendicitis" },
    { "code": "R10.0", "name": "Acute abdomen" },
    { "code": "I10", "name": "Essential (primary) hypertension" },
    { "code": "E11", "name": "Type 2 diabetes mellitus" },
    { "code": "J45", "name": "Asthma" },
    { "code": "F32", "name": "Depressive episode" },
    { "code": "C50", "name": "Malignant neoplasm of breast" },
    { "code": "M54.5", "name": "Low back pain" },
    { "code": "K21.0", "name": "Gastro-esophageal reflux disease" },
    { "code": "N39.0", "name": "Urinary tract infection, site not specified" },
    { "code": "A09", "name": "Diarrhea and gastroenteritis of presumed infectious origin" },
    { "code": "J06.9", "name": "Acute upper respiratory infection, unspecified" },
    { "code": "G43.9", "name": "Migraine, unspecified" },
    { "code": "L20.9", "name": "Atopic dermatitis, unspecified" },
    { "code": "H52.1", "name": "Myopia" },
    { "code": "K29.7", "name": "Gastritis, unspecified" },
    { "code": "M25.5", "name": "Pain in joint" },
    { "code": "F41.1", "name": "Generalized anxiety disorder" },
    { "code": "J18.9", "name": "Pneumonia, unspecified organism" },
    { "code": "E66.9", "name": "Obesity, unspecified" },
    { "code": "R51", "name": "Headache" },
    { "code": "H10.9", "name": "Conjunctivitis, unspecified" },
    { "code": "K35.80", "name": "Unspecified acute appendicitis" }
];

router.get("/", (_req, res) => {
    res.json(diagnoses);
});

export default router;
```

Backend/src/types.ts:

```
import { z } from 'zod';

export type Gender = "male" | "female" | "other";

export interface BaseEntry {
    id: string;
    date: string;
    description: string;
    specialist: string;
    diagnosisCodes?: string[];
}

export interface HealthCheckEntry extends BaseEntry {
    type: "HealthCheck";
    healthCheckRating: number; // 0–3
}

export interface HospitalEntry extends BaseEntry {
    type: "Hospital";
    discharge: {
        date: string;
        criteria: string;
    };
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    type: "OccupationalHealthcare";
    employerName: string;
    sickLeave?: {
        startDate: string;
        endDate: string;
    };
}

export type Entry =
    | HealthCheckEntry
    | HospitalEntry
    | OccupationalHealthcareEntry;

export interface Patient {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
    entries: Entry[];
}

export type NewPatient = Omit<Patient, "id" | "entries">;

// 🟢 AQUÍ ESTÁ EL ESQUEMA DE ZOD QUE FALTABA
export const NewPatientSchema = z.object({
    name: z.string(),
    dateOfBirth: z.string(),
    ssn: z.string(),
    gender: z.enum(["male", "female", "other"]),
    occupation: z.string(),
});

export type PatientFormValues = {
    name: string;
    occupation: string;
    ssn: string;
    dateOfBirth: string;
    gender: Gender;
};

export interface Diagnosis {
    code: string;
    name: string;
}
```

Backend/src/index.ts:

```
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
```

backend/: Tiene su propio package.json y su propio tsconfig.json.

```
package.json:
{
  "name": "backend",
  "version": "1.0.0",
  "description": "- To get the app running just install its dependencies with ```npm install``` and run it with ```npm run dev```.\r   - The app should work without a backend, but make sure that the request made to ```/api/ping``` made on startup is successful before continuing.",
  "main": "eslint.config.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only --project tsconfig.json src/index.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "cors": "^2.8.6",
    "crypto-js": "^4.2.0",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mongoose": "^9.8.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/mongoose": "^5.11.97",
    "@types/node": "^26.1.1",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "5.4"
  }
}
```

tsconfig.json:

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}

```

frontend/: También tiene su propio package.json y su propio tsconfig.json.

```
{
  "name": "frontend-new",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.13.3",
    "@emotion/styled": "^11.13.0",
    "@mui/icons-material": "^6.1.6",
    "@mui/material": "^6.1.6",
    "axios": "^1.18.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2"
  },
  "devDependencies": {
    "@eslint/js": "^9.12.0",
    "@types/react": "^18.3.31",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react": "^4.7.0",
    "eslint": "^9.12.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.12",
    "globals": "^15.11.0",
    "typescript": "^5.9.3",
    "typescript-eslint": "^8.8.1",
    "vite": "^5.4.21"
  }
}
```

tsconfig.json:

```
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```
//.
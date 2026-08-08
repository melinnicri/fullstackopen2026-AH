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
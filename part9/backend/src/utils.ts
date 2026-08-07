import { NewPatient, Gender, Entry, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "./types";

export const isString = (text: unknown): text is string =>
    typeof text === "string";

export const isDate = (date: string): boolean =>
    Boolean(Date.parse(date));

export const isGender = (param: string): param is Gender =>
    ["male", "female", "other"].includes(param);

export const toNewPatient = (object: any): NewPatient => {
    if (!isString(object.name)) throw new Error("Nombre inválido");
    if (!isString(object.ssn)) throw new Error("SSN inválido");
    if (!isDate(object.dateOfBirth)) throw new Error("Fecha inválida");
    if (!isString(object.occupation)) throw new Error("Ocupación inválida");
    if (!isGender(object.gender)) throw new Error("Género inválido");

    return {
        name: object.name,
        ssn: object.ssn,
        dateOfBirth: object.dateOfBirth,
        occupation: object.occupation,
        gender: object.gender
    };
};

export const toNewEntry = (object: any): Entry => {
    if (!object.type || !isString(object.type)) {
        throw new Error("Tipo de entrada inválido");
    }

    switch (object.type) {
        case "HealthCheck":
            if (typeof object.healthCheckRating !== "number") {
            throw new Error("HealthCheckRating inválido");
        }
        return {
            id: crypto.randomUUID(),
            date: object.date,
            description: object.description,
            specialist: object.specialist,
            type: "HealthCheck",
            healthCheckRating: object.healthCheckRating
        } as HealthCheckEntry;

    case "Hospital":
        if (!object.discharge || !isString(object.discharge.criteria)) {
            throw new Error("Discharge inválido");
        }
        return {
            id: crypto.randomUUID(),
            date: object.date,
            description: object.description,
            specialist: object.specialist,
            type: "Hospital",
            discharge: object.discharge
        } as HospitalEntry;

    case "OccupationalHealthcare":
        if (!isString(object.employerName)) {
            throw new Error("EmployerName inválido");
        }
        return {
            id: crypto.randomUUID(),
            date: object.date,
            description: object.description,
            specialist: object.specialist,
            type: "OccupationalHealthcare",
            employerName: object.employerName,
            sickLeave: object.sickLeave
        } as OccupationalHealthcareEntry;

    default:
        throw new Error("Tipo de entrada desconocido");
    }
};

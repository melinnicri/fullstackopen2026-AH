import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    date: String,
    type: String,
    description: String,
    specialist: String,
    healthCheckRating: Number,
    employerName: String,
    sickLeave: {
        startDate: String,
        endDate: String
    },
    discharge: {
        date: String,
        criteria: String
    },
    diagnosisCodes: [String] // 👈 aquí está bien
});

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ssn: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    occupation: { type: String, required: true },
    gender: { type: String, required: true },
    entries: [entrySchema] // 👈 usa el schema definido arriba
});

patientSchema.set("toJSON", {
    transform: (_doc, ret) => {
    // paciente
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    // entries
        if (ret.entries) {
        ret.entries = ret.entries.map((entry: any) => ({
        ...entry,
        id: entry._id ? entry._id.toString() : undefined,
        _id: undefined
        }));
    }
    }
});

export const Patient = mongoose.model("Patient", patientSchema);
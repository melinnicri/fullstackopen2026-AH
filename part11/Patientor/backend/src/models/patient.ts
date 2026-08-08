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
    diagnosisCodes: [String]
});

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ssn: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    occupation: { type: String, required: true },
    gender: { type: String, required: true },
    entries: [entrySchema]
});

patientSchema.set("toJSON", {
    transform: (_doc, ret: { _id?: mongoose.Types.ObjectId; __v?: number; id?: string; entries?: any[]; [key: string]: any }) => {
        // paciente
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        
        // entries
        if (ret.entries && Array.isArray(ret.entries)) {
            ret.entries = ret.entries.map((entry: any) => {
                const entryObj = entry.toObject ? entry.toObject() : entry;
                const { _id, ...rest } = entryObj;
                return {
                    ...rest,
                    id: _id ? _id.toString() : undefined
                };
            });
        }
    }
});

export const Patient = mongoose.model("Patient", patientSchema);
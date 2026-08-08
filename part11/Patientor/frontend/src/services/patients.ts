import axios from "axios";
import { Patient, Entry, PatientFormValues } from "../types";
import { apiBaseUrl } from "../constants";

const baseUrl = `${apiBaseUrl}/patients`;

const getAll = async () => {
    const { data } = await axios.get<Patient[]>(baseUrl);
    return data;
};

const create = async (newPatient: PatientFormValues) => {
    const { data } = await axios.post<Patient>(baseUrl, newPatient);
    return data;
};

export const addEntry = async (patientId: string, entry: Entry) => {
    const { data } = await axios.post<Patient>(
        `${baseUrl}/${patientId}/entries`,
        entry
    );
    return data;
};

const getById = async (id: string): Promise<Patient> => {
    const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
    return data;
};

export default {
    getAll,
    create,
    addEntry,
    getById
};
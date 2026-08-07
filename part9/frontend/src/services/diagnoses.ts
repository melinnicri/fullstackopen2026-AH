import axios from "axios";
import { Diagnosis } from "../types";

const baseUrl = "/api/diagnoses";

export const getAll = async (): Promise<Diagnosis[]> => {
    const { data } = await axios.get<Diagnosis[]>(baseUrl);
    return data;
};
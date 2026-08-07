import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../types";
import { getAll } from "../services/patients";

const PatientPage = () => {
    const { id } = useParams<{ id: string }>();
    const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            const patients = await getAll();
            const found = patients.find(p => p.id === id);
                setPatient(found || null);
    };
    fetchPatient();
    }, [id]);

    if (!patient) return <div>Loading...</div>;

    return (
    <div>
        <h2>{patient.name}</h2>
        <p>Occupation: {patient.occupation}</p>
        <p>Gender: {patient.gender}</p>
        <h3>Entries</h3>
        <ul>
            {patient.entries.map(e => {
                if (e.type === "HealthCheck") {
                return (
                <li key={e.id}>
                {e.date}: {e.description} — Health rating {e.healthCheckRating}
                </li>
        );
    }
    return null;
    })}
        </ul>
    </div>
    );
};

export default PatientPage;
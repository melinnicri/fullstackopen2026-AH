import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../services/patients";
import { Patient, Diagnosis } from "../types";
import HealthRatingBar from "./HealthRatingBar";
import AddEntryForm from "./AddEntryForm";

interface Props {
    diagnoses: Diagnosis[];
}

const PatientDetails: React.FC<Props> = ({ diagnoses }) => {
    const { id } = useParams();
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
    const [showForm, setShowForm] = useState(false);

  // cargar paciente
    useEffect(() => {
        if (!id) return;
        const fetchPatient = async () => {
        try {
            const patient = await patientService.getById(id);
            setCurrentPatient(patient);
        } catch (error) {
        console.error("Error fetching patient:", error);
        }
    };
    void fetchPatient();
    }, [id]);

    if (!currentPatient) return <p>Loading...</p>;

    return (
        <div>
            <h2>{currentPatient.name}</h2>
                <p>Date of Birth: {currentPatient.dateOfBirth}</p>
                <p>Gender: {currentPatient.gender}</p>
                <p>Occupation: {currentPatient.occupation}</p>

        <h3>Entries</h3>
        <ul>
            {currentPatient.entries.map((entry) => (
                <li key={entry.id}>
            {entry.date} — {entry.description} ({entry.type})
            {entry.diagnosisCodes && (
                <ul>
                {entry.diagnosisCodes.map((code) => {
                    const diagnosis = diagnoses.find((d) => d.code === code);
                    return (
                    <li key={code}>
                        {code} — {diagnosis?.name ?? "Unknown diagnosis"}
                    </li>
                    );
                })}
                </ul>
            )}
            {entry.type === "HealthCheck" && (
                <HealthRatingBar rating={entry.healthCheckRating} showText={true} />
            )}
            </li>
        ))}
        </ul>

        {showForm ? (
            <AddEntryForm
                patientId={currentPatient.id}
                diagnoses={diagnoses}
                onSubmit={(entry) => {
                    patientService.addEntry(currentPatient.id, entry).then((updated) => {
                        setCurrentPatient(updated);
                });
            }}
            onCancel={() => setShowForm(false)}
            />
        ) : (
        <button onClick={() => setShowForm(true)}>Add New Entry</button>
        )}
    </div>
    );
};

export default PatientDetails;
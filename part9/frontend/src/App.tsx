import { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Patient, PatientFormValues, Diagnosis } from "./types";
import patientService from "./services/patients";

import PatientListPage from "./components/PatientListPage";
import AddPatientForm from "./components/AddPatientModal/AddPatientForm";
import PatientDetails from "./components/PatientDetails";

const App = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const patient = await patientService.create(values);
      setPatients((prev) => [...prev, patient]);
      navigate("/"); // vuelve a la lista
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  // cargar pacientes
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
        setPatients(data);
        console.log("Pacientes cargados:", data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  // cargar diagnósticos
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        setDiagnoses(data);
        console.log("Diagnósticos cargados:", data);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };
    fetchDiagnoses();
  }, []);

  return (
    <Container>
      <Typography variant="h3" sx={{ marginBottom: "0.5em" }}>
        Patientor
      </Typography>

      {/* Botones de navegación */}
      <Button component={Link} to="/" variant="contained" color="primary">
        Home
      </Button>
      <Button
        component={Link}
        to="/add"
        variant="contained"
        color="secondary"
        sx={{ ml: 2 }}
      >
        Add Patient
      </Button>

      <Divider sx={{ marginY: 2 }} />

      {/* Rutas */}
      <Routes>
        <Route
          path="/"
          element={<PatientListPage patients={patients} setPatients={setPatients} />}
        />
        <Route
          path="/add"
          element={
            <AddPatientForm
              onCancel={() => navigate("/")}
              onSubmit={submitNewPatient}
            />
          }
        />
        <Route
          path="/patients/:id"
          element={<PatientDetails diagnoses={diagnoses} />}
        />
      </Routes>
    </Container>
  );
};

export default App;

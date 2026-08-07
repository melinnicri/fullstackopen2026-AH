import { useState, SyntheticEvent } from "react";
import { TextField, Button, Grid, MenuItem, Autocomplete } from "@mui/material";
import { EntryFormValues, Diagnosis } from "../types";

interface Props {
    patientId: string;
    diagnoses: Diagnosis[];
    onSubmit: (values: EntryFormValues) => void;
    onCancel: () => void;
}

const AddEntryForm: React.FC<Props> = ({ patientId, diagnoses, onSubmit, onCancel }) => {
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [specialist, setSpecialist] = useState("");
    const [healthCheckRating, setHealthCheckRating] = useState(0);
    const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

    const handleSubmit = (event: SyntheticEvent) => {
        event.preventDefault();

    if (!date || !description || !specialist) {
        alert("All fields are required");
        return;
    }

    const newEntry: EntryFormValues = {
        date,
        type: "HealthCheck",
        description,
        specialist,
        healthCheckRating,
        diagnosisCodes
    };

    onSubmit(newEntry);

    // reset form
    setDate("");
    setDescription("");
    setSpecialist("");
    setHealthCheckRating(0);
    setDiagnosisCodes([]);
    };

    return (
            <form onSubmit={handleSubmit}>
        <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{ marginBottom: 2 }}
        />
        <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: 2 }}
        />
        <TextField
            label="Specialist"
            fullWidth
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            sx={{ marginBottom: 2 }}
        />
        <TextField
            select
            label="Health Check Rating"
            fullWidth
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(Number(target.value))}
            sx={{ marginBottom: 2 }}
        >
        <MenuItem value={0}>0 - Excellent</MenuItem>
        <MenuItem value={1}>1 - Low risk</MenuItem>
        <MenuItem value={2}>2 - High risk</MenuItem>
        <MenuItem value={3}>3 - Diagnosed condition</MenuItem>
        </TextField>

      {/* Autocomplete para diagnosis codes */}
        <Autocomplete
            multiple
            options={diagnoses ?? []}   // aquí usas la lista de diagnósticos
            getOptionLabel={(option) => `${option.code} — ${option.name}`}
            value={(diagnoses ?? []).filter((d) => diagnosisCodes.includes(d.code))}
            onChange={(_, value) => setDiagnosisCodes(value.map((v) => v.code))}
            renderInput={(params) => (
        <TextField {...params} label="Diagnosis Codes" placeholder="Select codes" />
        )}
        sx={{ marginBottom: 2 }}
        />

        <Grid container justifyContent="space-between">
            <Grid item>
            <Button variant="contained" color="secondary" onClick={onCancel}>
            Cancel
            </Button>
        </Grid>
        <Grid item>
            <Button variant="contained" type="submit">
                Add Entry
            </Button>
            </Grid>
        </Grid>
    </form>
    );
};

export default AddEntryForm;
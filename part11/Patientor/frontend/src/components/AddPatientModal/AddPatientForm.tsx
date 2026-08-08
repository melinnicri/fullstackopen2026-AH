import { TextField, Grid, Button, SelectChangeEvent } from "@mui/material";
import { useState, SyntheticEvent } from "react";
import { PatientFormValues, Gender } from "../../types";
import patientService from "../../services/patients";
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

interface Props {
    onCancel: () => void;
    onSubmit: (values: PatientFormValues) => void;
}

interface GenderOption{
    value: Gender;
    label: string;
}

const genderOptions: GenderOption[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
];

const AddPatientForm = ({ onCancel, onSubmit }: Props) => {
    const [name, setName] = useState('');
    const [occupation, setOccupation] = useState('');
    const [ssn, setSsn] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState<Gender | "">("");

    const onGenderChange = (event: SelectChangeEvent<string>) => {
        setGender(event.target.value as Gender);
    };

    const addPatient = (event: SyntheticEvent) => {
    event.preventDefault();

  // Validar campos vacíos
    if (!name || !occupation || !ssn || !dateOfBirth) {
        alert("All fields are required");
        return;
    }

    const submitNewPatient = async () => {
        console.log("Submitting patient:", values);
        await patientService.create(values);
    }

  // Validar formato de fecha YYYY-MM-DD
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth);
        if (!isValidDate) {
        alert("Date must be in format YYYY-MM-DD");
        return;
    }

    if (!/^\d+$/.test(ssn)) {
        alert("SSN must be numeric");
    return;
    }

    if (!gender) {
        alert("Gender is required");
    return;
    }

  // Enviar datos al backend
    onSubmit({
        name,
        occupation,
        ssn,
        dateOfBirth,
        gender
    });
};

    return (
        <div>
            <form onSubmit={addPatient}>
        <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={({ target }) => setName(target.value)}
            error={!name}
            helperText={!name ? "Name is required" : ""}
        />
        <TextField
            label="Social security number"
            fullWidth
            value={ssn}
            onChange={({ target }) => setSsn(target.value)}
            error={!/^\d+$/.test(ssn)}
            helperText={!/^\d+$/.test(ssn) ? "SSN must be numeric" : ""}
        />
        <TextField
            label="Date of birth"
            placeholder="YYYY-MM-DD"
            fullWidth
            value={dateOfBirth}
            onChange={({ target }) => setDateOfBirth(target.value)}
            error={!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)}
            helperText={!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ? "Format must be YYYY-MM-DD" : ""}
        />
        <TextField
            label="Occupation"
            fullWidth
            value={occupation}
            onChange={({ target }) => setOccupation(target.value)}
            error={!occupation}
            helperText={!occupation ? "Occupation is required" : ""}
        />
        <FormControl fullWidth sx={{ marginTop: 2.5 }} error={!gender}>
            <InputLabel>Gender</InputLabel>
            <Select
            value={gender}
            onChange={onGenderChange}
        >
            {genderOptions.map(option =>
            <MenuItem key={option.label} value={option.value}>
            {option.label}
        </MenuItem>
        )}
        </Select>
            {!gender && <FormHelperText>Gender is required</FormHelperText>}
        </FormControl>
        
        <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
            <Grid size="auto">
                <Button
                    color="secondary"
                    variant="contained"
                    type="button"
                    onClick={onCancel}
            >
                Cancel
            </Button>
            </Grid>
            <Grid size="auto">
                <Button
                type="submit"
                variant="contained"
            >
                Add
            </Button>
            </Grid>
        </Grid>
        </form>
    </div>
    );
};

export default AddPatientForm;
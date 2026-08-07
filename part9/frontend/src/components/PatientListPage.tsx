import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Patient } from "../types";
import { Link } from "react-router-dom";

interface Props {
    patients: Patient[];
}

const PatientListPage = ({ patients }: Props) => {
    return (
        <TableContainer component={Paper}>
            <Table>
        <TableHead>
            <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Occupation</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {patients.map((patient) => (
            <TableRow key={patient.id || patient._id}>
        <TableCell>
            <Link to={`/patients/${patient.id || patient._id}`}>
            {patient.name}
            </Link>
            </TableCell>
            <TableCell>{patient.dateOfBirth}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>{patient.occupation}</TableCell>
            </TableRow>
    ))}
        </TableBody>
        </Table>
    </TableContainer>
    );
};

export default PatientListPage;
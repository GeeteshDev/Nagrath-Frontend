import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicPatientById } from '../api/patientService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';


const TestTable = ({ title, data }) => {
    const validEntries = Object.entries(data).filter(([_, test]) => test);
    return validEntries.length > 0 ? (
        <TableContainer component={Paper} className="p-4 mb-6">
            <Typography variant="h6" gutterBottom>{title}</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Test</strong></TableCell>
                        <TableCell><strong>Value</strong></TableCell>
                        <TableCell><strong>Unit</strong></TableCell>
                        <TableCell><strong>Range</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {validEntries.map(([label, test]) => (
                        <TableRow key={label}>
                            <TableCell><strong>{label}:</strong></TableCell>
                            <TableCell>{test?.value || 'N/A'}</TableCell>
                            <TableCell>{test?.unit || '-'}</TableCell>
                            <TableCell>{test?.range || '-'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    ) : null;
};

const PatientReport = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const componentRef = useRef(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const data = await getPublicPatientById(id);
                setPatient(data);
            } catch (err) {
                setError(err.response?.status === 404 ? 'Patient not found.' : 'Error fetching patient details');
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const downloadPDF = () => {
        const input = componentRef.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
            pdf.save('patient-report.pdf');
        });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div ref={componentRef} className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-center">{patient.name}'s Report</h1>
            <TableContainer component={Paper} className="p-4 mb-6">
                <Typography variant="h6" gutterBottom>Patient Information</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Field</strong></TableCell>
                            <TableCell className="border border-gray-400"><strong>Details</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody> {/* ✅ Wrap all TableRow inside TableBody */}
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Name:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.name || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Age:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.age || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Gender:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.gender || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Date of Birth:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.dateOfBirth || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Blood Group:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.bloodGroup || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Aadhar Number:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.aadharNumber || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Address:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.address || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>City:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.city || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Pincode:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.pincode || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>District:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.district || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>State:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.state || 'N/A'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="border border-gray-400"><strong>Country:</strong></TableCell>
                            <TableCell className="border border-gray-400">{patient.country || 'N/A'}</TableCell>
                        </TableRow>
                    </TableBody> {/* ✅ Closing TableBody here */}
                </Table>
            </TableContainer>

            <TestTable title="Basic Tests" data={{
                'Hemoglobin': patient.hemoglobin,
                'Blood Pressure': patient.bloodPressure,
                'Heart Rate': patient.heartRate,
                'Fasting Blood Sugar': patient.fastingBloodSugar,
                'Calcium': patient.calcium
            }} />
            <TestTable title="Blood CBC" data={patient?.bloodCbc || {}} />
            <TestTable title="Urine Test" data={patient?.urineTest || {}} />
            <TestTable title="Lipid Profile Test" data={patient?.lipidProfile || {}} />
            <TestTable title="TST Test" data={patient?.tshTest || {}} />
            <Button variant="contained" color="primary" onClick={downloadPDF}>Download PDF</Button>
        </div>
    );
};

export default PatientReport;

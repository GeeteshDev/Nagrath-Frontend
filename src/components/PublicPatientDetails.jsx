import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicPatientById } from '../api/patientService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import PatientCard from './PatientCard'; 

const TestTable = ({ title, data }) => (
  <TableContainer component={Paper} className="p-4 mb-6">
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className="border border-gray-400"><strong>Test</strong></TableCell>
          <TableCell className="border border-gray-400"><strong>Value</strong></TableCell>
          <TableCell className="border border-gray-400"><strong>Unit</strong></TableCell>
          <TableCell className="border border-gray-400"><strong>Range</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(data).map(([label, test]) => (
          <TableRow key={label}>
            <TableCell className="border border-gray-400"><strong>{label}:</strong></TableCell>
            <TableCell className="border border-gray-400">{test?.value || 'N/A'}</TableCell>
            <TableCell className="border border-gray-400">{test?.unit || '-'}</TableCell>
            <TableCell className="border border-gray-400">{test?.range || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const PublicPatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const componentRef = useRef(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPublicPatientById(id);
        setPatient({
          ...data,
          urineTest: data.urineTest || {},
          bloodCbc: data.bloodCbc || {},
          lipidProfile: data.lipidProfile || {},
          tshTest: data.tshTest || {},
          medicalHistory: data.medicalHistory || {}
        });
      } catch (err) {
        console.error(err);
        setError(
          err.response?.status === 404
            ? 'Patient not found.'
            : 'Error fetching patient details'
        );
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
      pdf.save('patient-details.pdf');
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-600 text-xl">Loading patient details...</p>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-red-600 text-xl">{error}</p>
    </div>
  );

  return (
    <div ref={componentRef} className="p-4">
      {patient ? (
        <>
          <PatientCard patient={patient} />

          {/* General Information Table */}
          <TableContainer component={Paper} className="p-4 mb-6">
            <Typography variant="h6" gutterBottom>Patient Information</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="border border-gray-400"><strong>Field</strong></TableCell>
                  <TableCell className="border border-gray-400"><strong>Details</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
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
              </TableBody>
            </Table>
          </TableContainer>


          <TestTable title="Basic Tests" data={{
            'Hemoglobin': patient.hemoglobin,
            'Blood Pressure': patient.bloodPressure,
            'Heart Rate': patient.heartRate,
            'Fasting Blood Sugar': patient.fastingBloodSugar,
            'Calcium': patient.calcium
          }} />

          <TestTable title="Blood CBC" data={{
            "R.B.C Count": patient.bloodCbc?.rbcCount,
            "Packed Cell Volume (HCT)": patient.bloodCbc?.packedCellVolume,
            "Mean Cell Volume (MCV)": patient.bloodCbc?.meanCellVolume,
            "Mean Cell Hemoglobin (MCH)": patient.bloodCbc?.meanCellHemoglobin,
            "Mean Cell Hb Conc (MCHC)": patient.bloodCbc?.meanCellHbConc,
            "RDW (CV)": patient.bloodCbc?.rdwCV,
            "RDW (SD)": patient.bloodCbc?.rdwSD,
            "Total W.B.C Count": patient.bloodCbc?.twbcCount,
          }} />

          <TestTable title="Urine Test" data={{
            "Colour": patient.urineTest?.colour,
            "Appearance": patient.urineTest?.appearance,
            "Reaction": patient.urineTest?.reaction,
            "Specific Gravity": patient.urineTest?.specificGravity,
          }} />

          <TestTable title="MICROSCOPIC Examination" data={{
            "Pus Cells": patient.urineTest?.pusCells,
            "Epithelial Cells": patient.urineTest?.epithelialCells,
            "Red Blood Cells": patient.urineTest?.redBloodCell,
            "Spermatozoa": patient.urineTest?.spermatozoa,
            "Casts": patient.urineTest?.casts,
            "Crystals": patient.urineTest?.crystals,
            "Yeast Cells": patient.urineTest?.yeastCell,
            "Bacteria": patient.urineTest?.bacteria,
            "ESR": patient.urineTest?.esr
          }} />

          <TestTable title="Lipid Profile" data={{
            "Cholesterol - Total": patient.lipidProfile?.cholesterolTotal,
            "Triglycerides": patient.lipidProfile?.triglycerides,
            "HDL Cholesterol": patient.lipidProfile?.hdlCholesterol,
            "LDL Cholesterol": patient.lipidProfile?.ldlCholesterol,
            "VLDL Cholesterol": patient.lipidProfile?.vldlCholesterol,
            "Cholesterol/HDL Chol Ratio": patient.lipidProfile?.cholHdlCholRatio,
            "LDL Chol/HDL Chol Ratio": patient.lipidProfile?.ldlHdlCholRatio
          }} />

          <TestTable title="Thyroid Tests" data={{
            "Triiodothyronine (T3)": patient.tshTest?.triiodothyronine,
            "Thyroxine (T4)": patient.tshTest?.thyroxine,
            "TSH (Thyroid Stimulating Hormo : )":  patient.tshTest?.tsh,
            "SGOT (AST)": patient.tshTest?.sgot,
            "SGPT (ALT)": patient.tshTest?.sgpt,
            "Alkaline Phosphatase": patient.tshTest?.alkalinePhosphatase,
            "Total Protein": patient.tshTest?.totalProtein,
            "Albumin": patient.tshTest?.albumin,
            "Globulin": patient.tshTest?.globulin,
            "AIb/Glo Ratio": patient.tshTest?.albRatio,
            "Platelet count": patient.tshTest?.plateletCount,
            "Mean Platelet Volume (M : )": patient.tshTest?.mpv,
            "Platelet Distribution (PDW)": patient.tshTest?.pdw,
            "HIV I Antibodies": patient.tshTest?.hivFirst,
            "HIV II Antibodies": patient.tshTest?.hivSecond,
            "HBA1C": patient.tshTest?.HBA1C,
          
          }} />

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Document Files</h3>
            <div className="grid grid-cols-2 gap-4">
              {Array.isArray(patient.documentFile) && patient.documentFile.length > 0 ? (
                patient.documentFile.map((doc, index) => (
                  <img
                    key={index}
                    src={`data:${doc.contentType};base64,${Buffer.from(doc.data).toString('base64')}`}
                    alt={`Document ${index + 1}`}
                    className="w-full h-64 object-contain rounded-lg border"
                  />
                ))
              ) : patient.documentFile?.data ? (
                <img
                  src={`data:${patient.documentFile.contentType};base64,${Buffer.from(patient.documentFile.data).toString('base64')}`}
                  alt="Document File"
                  className="w-full h-64 object-contain rounded-lg border"
                />
              ) : (
                <p className="text-gray-500">No document files available</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <p>No patient details available</p>
      )}

      <div className="mt-6 text-center">
        <Button
          variant="contained"
          color="primary"
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Download Full Report as PDF
        </Button>
      </div>
    </div>
  );
};

export default PublicPatientDetails;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPatient } from '../api/patientService';
import SuperAdminLayout from './Layouts/SuperAdminLayout';

const CreatePatient = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    address: '',
    addressLine1: '',
    pincode: '',
    gender: '',
    dateOfBirth: '',
    aadharNumber: '',
    city: '',
    district: '',
    state: '',
    country: '',
    hemoglobin: { value: '', range: '13.5-17.5', unit: 'g/dl' },
    bloodPressure: { value: '', range: '120/80', unit: 'mmHg' },
    heartRate: { value: '', range: '60-100', unit: 'bpm' },
    fastingBloodSugar: { value: '', range: '70-100', unit: 'mg/dL' },
    calcium: { value: '', range: '', options: ['Adult: 8.5-11.0', 'Child: 6.7-10.5'], unit: 'mg/dL' },
    bloodCbc: {
      rbcCount: { value: '', unit: 'milli./cu.mm', range: '4.5-5.9' },
      packedCellVolume: { value: '', unit: '%', range: '37.53' },
      meanCellVolume: { value: '', unit: 'fl', range: '80-100' },
      meanCellHemoglobin: { value: '', unit: 'pg', range: '26-34' },
      meanCellHbConc: { value: '', unit: 'g/dl', range: '32-36' },
      rdwCV: { value: '', unit: '%', range: '11-16' },
      rdwSD: { value: '', unit: 'fl', range: '35-56' },
      twbcCount: { value: '', unit: '/cumm', range: '4500-11000' }
    },
    urineTest: {
      colour: { value: '', unit: '-', range: 'Pale Yellow' },
      appearance: { value: '', unit: '-', range: 'Clear' },
      reaction: { value: '', unit: '-', range: '6.0-8.5' },
      specificGravity: { value: '', unit: '-', range: '1.005-1.030' },
      pusCells: { value: '', unit: '/HFP', range: '0-5' },
      epithelialCells: { value: '', unit: '/HFP', range: '-' },
      redBloodCell: { value: '', unit: '/HFP', range: 'Nil' },
      spermatozoa: { value: '', unit: '/HFP', range: 'Absent' },
      casts: { value: '', unit: '/HPF', range: 'Absent' },
      crystals: { value: '', unit: '/HPF', range: 'Absent' },
      yeastCell: { value: '', unit: '/HPF', range: 'Absent' },
      bacteria: { value: '', unit: '/HPF', range: 'Absent' },
      esr: { value: '', unit: '', range: '', options: ['1-13 male', '0-20 female'] },
    },
    lipidProfile: {
      cholesterolTotal: { value: '', unit: 'mg/dL', range: '', options: ['Desirable: Up to 200', 'Borderline High: 200-239', 'High: >250'] },
      triglycerides: { value: '', unit: 'mg/dL', range: '', options: ['Normal: <150', 'Borderline: 150-199', 'High: 200-499', 'Very High: >500'] },
      hdlCholesterol: { value: '', unit: 'mg/dL', range: '', options: ['Male: 35-70', 'Female: 35-90'] },
      ldlCholesterol: { value: '', unit: 'mg/dL', range: '', options: ['Low Risk: <100', 'Normal Risk: 130-160', 'High Risk: >160'] },
      vldlCholesterol: { value: '', unit: 'mg/dL', range: '<40' },
      cholHdlCholRatio: { value: '', unit: 'mg/dL', range: '<4.30' },
      ldlHdlCholRatio: { value: '', unit: 'mg/dL', range: '0.3' },
    },
    tshTest: {
      triiodothyronine: { value: '', unit: 'ng/d', range: '0.58-1.62' },
      thyroxine: { value: '', unit: 'ug/dl', range: '5.0-14.5' },
      tsh: { value: '', unit: 'uIU/mL', options: ['Normal: 0.35-5.1', 'Pregnant T1: 0.05-4.73', 'Pregnant T2: 0.30-4.79', 'Pregnant T3: 0.50-6.02'] },
      sgot: { value: '', unit: 'IU/L', range: '00-46' },
      sgpt: { value: '', unit: 'IU/L', range: '00-49' },
      alkalinePhosphatase: { value: '', unit: 'U/L', range: '30-145' },
      totalProtein: { value: '', unit: 'g/dl', range: '6.0-8.30' },
      albumin: { value: '', unit: 'g/dl', range: '3.5-5.0' },
      globulin: { value: '', unit: 'g/dl', range: '1.50-3.0' },
      albRatio: { value: '', unit: 'milli./cu.mm', range: '0.90-2.00' },
      plateletCount: { value: '', unit: 'Lakh/cumm', range: '1.5-4.5' },
      mpv: { value: '', unit: 'fl', range: '6.5-12.0' },
      pdw: { value: '', unit: 'fl', range: '15-17' },
      hivFirst: { value: '', unit: 'fl', range: 'Non - Reactive' },
      hivSecond: { value: '', unit: 'fl', range: 'Non - Reactive' },
      HBA1C: { value: '', unit: '%', options: ['Non-Diabetic: 4-6', 'Excellent Control: 6-7', 'Fair to Good Control: 7-8', 'Unsatisfactory Control: 8-10', 'Poor Control: >10'] },
    }
  });
  const [photoFile, setPhotoFile] = useState(null); // For storing the photo file
  const [documentFiles, setDocumentFiles] = useState([]); // For storing document files
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const bloodGroups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O', 'O-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');

    if (nameParts.length === 2) {
      setFormData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: value
        }
      }));
    } else if (nameParts.length === 3) {
      setFormData((prevData) => ({
        ...prevData,
        [nameParts[0]]: {
          ...prevData[nameParts[0]],
          [nameParts[1]]: {
            ...prevData[nameParts[0]][nameParts[1]],
            [nameParts[2]]: value
          }
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handler for photo file change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Only JPG/PNG images allowed');
        return;
      }
      setPhotoFile(file);
    }
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];

    const invalidFiles = files.filter((file) => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Only PDF, JPEG, and PNG files are allowed for documents');
      return;
    }

    setDocumentFiles(files);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form submission
  //   const user = localStorage.getItem('user');
  //   const token = user ? JSON.parse(user).token : null;
  //   if (!token) {
  //     setError('User not authenticated');
  //     return;
  //   }
  //   try {
  //     const token = JSON.parse(localStorage.getItem('user')).token;
  //     await createPatient(formData, token);
  //     setSuccess('Patient created successfully');
  //     navigate('/admin/patients');
  //   } catch (err) {
  //     setError('Error creating patient');
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    if (!token) {
      setError('User not authenticated');
      return;
    }

    try {
      // Create a FormData object
      const formDataObj = new FormData();

      // Append all form fields to FormData
      for (const key in formData) {
        if (typeof formData[key] === 'object' && formData[key] !== null) {
          formDataObj.append(key, JSON.stringify(formData[key]));
        } else {
          formDataObj.append(key, formData[key]);
        }
      }

      // Append the photo file
      if (photoFile) {
        formDataObj.append('photo', photoFile);
      }
      if (documentFiles.length > 0) {
        documentFiles.forEach((file) => {
          formDataObj.append('documentFile', file);
        });
      }

      // Correct the logging:
      console.log('FormData entries:');
      for (const [key, value] of formDataObj.entries()) {
        console.log(key, value);
      }

      // Send the FormData object to the backend
      await createPatient(formDataObj, token);

      setSuccess('Patient created successfully');
      navigate('/admin/patients');
    } catch (err) {
      setError('Error creating patient');
      console.error(err);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-8 bg-white shadow-md rounded-lg max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Patient Registration</h1>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <form onSubmit={handleSubmit}>
          {/* ALL General Information  */}
          <div className='grid grid-cols-2 gap-4'>

            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block font-bold mb-1">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Patient Full Name"
                required
                className="w-full border p-2 mb-4"
              />
            </div>


            {/* Aadhar Number */}
            <div>
              <label htmlFor="aadharNumber" className="block font-bold mb-1">Aadhar Number *</label>
              <input
                type="number"
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                placeholder="Enter Your Aadhar Number"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block font-bold mb-1">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full border p-2 mb-4"
              />
            </div>
            {/* Blood group */}
            <div>
              <label htmlFor='bloodGroup' className="block font-bold mb-1">
                Blood Group:
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 mb-4"
                >
                  <option value="">Select Blood Group *</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-bold mb-1">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter Your Address"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Address Line 1 */}
            <div>
              <label htmlFor="addressLine1" className="block font-bold mb-1">Address Line 1 *</label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Enter Your Address Line 1"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="block font-bold mb-1">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter Your State"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block font-bold mb-1">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter Your City"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* District */}
            <div>
              <label htmlFor="district" className="block font-bold mb-1">District *</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Enter Your District"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="mobile" className="block font-bold mb-1">Mobile Number *</label>
              <input
                type="number"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter Your Mobile number"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block font-bold mb-1">Pincode *</label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter Your Pincode"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Age */}
            <div>
              <label htmlFor="age" className="block font-bold mb-1">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter Your Age"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block font-bold mb-1">Country *</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter Your Country"
                required
                className="w-full border p-2 mb-4"
              />
            </div>

            {/* Gender Section */}
            <div>
              <label className="block font-bold mb-1">Gender *</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Female
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === 'Other'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Other
                </label>
              </div>
            </div>

            {/* Photo  */}
            <div>
              <label htmlFor="photo" className="block font-bold mb-1">Upload Photo *</label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                required
                className="w-full border p-2 mb-4"
              />
            </div>

          </div>

          {/* Medical Test Inputs */}
          <h2 className="text-lg font-semibold mt-8 mb-4">Tests</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border border-gray-300 font-semibold">Name of Test</th>
                <th className="p-2 border border-gray-300 font-semibold">Observed Values</th>
                <th className="p-2 border border-gray-300 font-semibold">Unit</th>
                <th className="p-2 border border-gray-300 font-semibold">Reference Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Hemoglobin', id: 'hemoglobin', unit: 'g/dl', range: '13.5-17.5' },
                { name: 'Blood Pressure Range (B.P)', id: 'bloodPressure', unit: 'mmHg', range: '120/80' },
                { name: 'Heart Rate/Pulse Rate', id: 'heartRate', unit: 'bpm', range: '60-100' },
                { name: 'Fasting Blood Sugar', id: 'fastingBloodSugar', unit: 'mg/dL', range: '70-100' },
                { name: 'Calcium', id: 'calcium', unit: 'mg/dL', range: ['Adult: 8.5-11.0', 'Child: 6.7-10.5'] },
              ].map((test) => (
                <tr key={test.id}>
                  <td className="p-2 border border-gray-300">{test.name}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      name={`${test.id}.value`}
                      value={formData[test.id]?.value || ''}
                      onChange={handleChange}
                      className="w-full border p-1"
                    />
                  </td>
                  <td className="p-2 border border-gray-300 text-gray-600">{test.unit}</td>
                  <td className="p-2 border border-gray-300 text-gray-600">
                    {test.id === 'calcium' ? (
                      <select
                        name={`${test.id}.range`}
                        value={formData[test.id]?.range || ''}
                        onChange={handleChange}
                        className="w-full border p-1"
                      >
                        <option value="" disabled>Select Range</option>
                        <option value="Adult: 8.5-11.0">Adult: 8.5-11.0</option>
                        <option value="Child: 6.7-10.5">Child: 6.7-10.5</option>
                      </select>
                    ) : (
                      test.range
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Blood CBC */}
          <h2 className="text-lg font-bold mt-8 mb-4">Blood CBC</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border border-gray-300 font-semibold">Name of Test</th>
                <th className="p-2 border border-gray-300 font-semibold">Observed Values</th>
                <th className="p-2 border border-gray-300 font-semibold">Unit</th>
                <th className="p-2 border border-gray-300 font-semibold">Normal Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'R.B.C Count', name: 'rbcCount', unit: 'milli./cu.mm', range: '4.5-5.9' },
                { label: 'Packed Cell Volume (HCT)', name: 'packedCellVolume', unit: '%', range: '37.53' },
                { label: 'Mean Cell Volume (MCV)', name: 'meanCellVolume', unit: 'fl', range: '80-100' },
                { label: 'Mean Cell Hemoglobin (MCH)', name: 'meanCellHemoglobin', unit: 'pg', range: '26-34' },
                { label: 'Mean Cell Hb Conc (MCHC)', name: 'meanCellHbConc', unit: 'g/dl', range: '32-36' },
                { label: 'RDW (CV)', name: 'rdwCV', unit: '%', range: '11-16' },
                { label: 'RDW (SD)', name: 'rdwSD', unit: 'fl', range: '35-56' },
                { label: 'Total W.B.C Count', name: 'twbcCount', unit: '/cumm', range: '4500-11000' },
              ].map((test) => (
                <tr key={test.name} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-medium">{test.label}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      name={`bloodCbc.${test.name}.value`}
                      value={formData.bloodCbc[test.name]?.value || ''}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        const [parentKey, childKey] = name.split('.');
                        setFormData((prevState) => ({
                          ...prevState,
                          [parentKey]: {
                            ...prevState[parentKey],
                            [childKey]: {
                              ...prevState[parentKey][childKey],
                              value,
                            },
                          },
                        }));
                      }}
                      placeholder={`Enter ${test.label}`}
                      required
                      className="w-full border p-2"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span>{test.unit}</span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span>{test.range}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Urine test  */}
          {/* <h2 className="text-lg font-bold mt-8 mb-4">Urine test</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border border-gray-300 font-semibold">Name of Test</th>
                <th className="p-2 border border-gray-300 font-semibold">Observed Values</th>
                <th className="p-2 border border-gray-300 font-semibold">Unit</th>
                <th className="p-2 border border-gray-300 font-semibold">Normal Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Colour', name: 'colour', unit: '', range: 'Pale Yellow' },
                { label: 'Appearance', name: 'appearance', unit: '', range: 'Clear' },
                { label: 'Reaction (pH)', name: 'reaction', unit: '', range: '6.0-8.5' },
                { label: 'Specific Gravity', name: 'specificGravity', unit: '', range: '1.005-1.030' },
                { label: 'Pus Cells', name: 'pusCells', unit: '/HPF', range: '0-5' },
                { label: 'Epithelial Cells', name: 'epithelialCells', unit: '/HPF', range: '-' },
                { label: 'Red Blood Cells', name: 'redBloodCell', unit: '/HPF', range: 'Nil' },
                { label: 'Spermatozoa', name: 'spermatozoa', unit: '/HPF', range: 'Absent' },
                { label: 'Casts', name: 'casts', unit: '/HPF', range: 'Absent' },
                { label: 'Crystals', name: 'crystals', unit: '/HPF', range: 'Absent' },
                { label: 'Yeast Cell', name: 'yeastCell', unit: '/HPF', range: 'Absent' },
                { label: 'Bacteria', name: 'bacteria', unit: '/HPF', range: 'Absent' },
                { label: 'ESR (ERYTHROCYTE SEDIMENTATION RATE)', name: 'esr', unit: 'mm/1hr.', range: ['1-13 male', '0-20 female'] },
              ].map((test) => (
                <tr key={test.name} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-medium">{test.label}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      name={`urineTest.${test.name}.value`}
                      value={formData.urineTest[test.name]?.value || ''}
                      onChange={handleChange}
                      placeholder={`Enter ${test.label}`}
                      required
                      className="w-full border p-2"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span>{test.unit}</span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {test.name === 'esr' ? (
                      <select
                        name={`urineTest.${test.name}.range`}
                        value={formData.urineTest[test.name]?.range || ''}
                        onChange={handleChange}
                        className="w-full border p-2"
                      >
                        <option value="" disabled>Select Range</option>
                        {test.range.map((range, index) => (
                          <option key={index} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{test.range}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          {/* Urine test */}
          <h2 className="text-lg font-bold mt-8 mb-4">Urine test</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border border-gray-300 font-semibold">Name of Test</th>
                <th className="p-2 border border-gray-300 font-semibold">Observed Values</th>
                <th className="p-2 border border-gray-300 font-semibold">Unit</th>
                <th className="p-2 border border-gray-300 font-semibold">Normal Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Colour', name: 'colour', unit: '', range: 'Pale Yellow' },
                { label: 'Appearance', name: 'appearance', unit: '', range: 'Clear' },
                { label: 'Reaction (pH)', name: 'reaction', unit: '', range: '6.0-8.5' },
                { label: 'Specific Gravity', name: 'specificGravity', unit: '', range: '1.005-1.030' },
              ].map((test) => (
                <tr key={test.name} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-medium">{test.label}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      name={`urineTest.${test.name}.value`}
                      value={formData.urineTest[test.name]?.value || ''}
                      onChange={handleChange}
                      placeholder={`Enter ${test.label}`}
                      required
                      className="w-full border p-2"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span>{test.unit}</span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {test.name === 'esr' ? (
                      <select
                        name={`urineTest.${test.name}.range`}
                        value={formData.urineTest[test.name]?.range || ''}
                        onChange={handleChange}
                        className="w-full border p-2"
                      >
                        <option value="" disabled>Select Range</option>
                        {test.range.map((range, index) => (
                          <option key={index} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span>{test.range}</span>
                    )}
                  </td>
                </tr>
              ))}

              {/* Adding heading for MICROSCOPIC Examination */}
              <tr>
                <td colSpan="4" className="bg-gray-100 text-center text-lg font-semibold py-2">
                  MICROSCOPIC Examination
                </td>
              </tr>

              {/* Pus Cells row under MICROSCOPIC Examination */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Pus Cells</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.pusCells.value"
                    value={formData.urineTest.pusCells?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Pus Cells value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>0-5</span>
                </td>
              </tr>

              {/* Epithelial Cells */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Epithelial Cells</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.epithelialCells.value"
                    value={formData.urineTest.epithelialCells?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Epithelial Cells value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>-</span>
                </td>
              </tr>

              {/* Red Blood Cells */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Red Blood Cells</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.redBloodCell.value"
                    value={formData.urineTest.redBloodCell?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Red Blood Cells value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>Nil</span>
                </td>
              </tr>

              {/* Spermatozoa */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Spermatozoa</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.spermatozoa.value"
                    value={formData.urineTest.spermatozoa?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Spermatozoa value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>Absent</span>
                </td>
              </tr>

              {/* Casts */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Casts</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.casts.value"
                    value={formData.urineTest.casts?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Casts value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>Absent</span>
                </td>
              </tr>

              {/* Crystals */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Crystals</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.crystals.value"
                    value={formData.urineTest.crystals?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Crystals value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>Absent</span>
                </td>
              </tr>

              {/* Yeast Cell */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Yeast Cell</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.yeastCell.value"
                    value={formData.urineTest.yeastCell?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Yeast Cell value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>Absent</span>
                </td>
              </tr>

              {/* Bacteria */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">Bacteria</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.bacteria.value"
                    value={formData.urineTest.bacteria?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter Bacteria value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>/HPF</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <span>Absent</span>
                </td>
              </tr>

              {/* ESR (ERYTHROCYTE SEDIMENTATION RATE) */}
              <tr className="border border-gray-300">
                <td className="p-2 border border-gray-300 font-medium">ESR (ERYTHROCYTE SEDIMENTATION RATE)</td>
                <td className="p-2 border border-gray-300">
                  <input
                    type="text"
                    name="urineTest.esr.value"
                    value={formData.urineTest.esr?.value || ''}
                    onChange={handleChange}
                    placeholder="Enter ESR value"
                    required
                    className="w-full border p-2"
                  />
                </td>
                <td className="p-2 border border-gray-300">
                  <span>mm/1hr.</span>
                </td>
                <td className="p-2 border border-gray-300">
                  <select
                    name="urineTest.esr.range"
                    value={formData.urineTest.esr?.range || ''}
                    onChange={handleChange}
                    className="w-full border p-2"
                  >
                    <option value="" disabled>Select Range</option>
                    {['1-13 male', '0-20 female'].map((range, index) => (
                      <option key={index} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>



          {/* Lipid Profile */}
          <h2 className="text-lg font-bold mt-8 mb-4">Lipid Profile</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border border-gray-300 font-semibold">Name of Test</th>
                <th className="p-2 border border-gray-300 font-semibold">Observed Values</th>
                <th className="p-2 border border-gray-300 font-semibold">Unit</th>
                <th className="p-2 border border-gray-300 font-semibold">Normal Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'Cholesterol - Total',
                  name: 'cholesterolTotal',
                  unit: 'mg/dL',
                  options: ['Desirable: Up to 200', 'Borderline High: 200-239', 'High: >250'],
                },
                {
                  label: 'Triglycerides',
                  name: 'triglycerides',
                  unit: 'mg/dL',
                  options: ['Normal: <150', 'Borderline: 150-199', 'High: 200-499', 'Very High: >500'],
                },
                {
                  label: 'HDL Cholesterol',
                  name: 'hdlCholesterol',
                  unit: 'mg/dL',
                  options: ['Male: 35-70', 'Female: 35-90'],
                },
                {
                  label: 'LDL Cholesterol',
                  name: 'ldlCholesterol',
                  unit: 'mg/dL',
                  options: ['Low Risk: <100', 'Normal Risk: 130-160', 'High Risk: >160'],
                },
                {
                  label: 'VLDL Cholesterol',
                  name: 'vldlCholesterol',
                  unit: 'mg/dL',
                  range: '<40', // no options
                },
                {
                  label: 'Cholesterol/HDL Chol Ratio',
                  name: 'cholHdlCholRatio',
                  unit: 'mg/dL',
                  range: '< 4.30', // no options
                },
                {
                  label: 'LDL Chol/HDL Chol Ratio',
                  name: 'ldlHdlCholRatio',
                  unit: 'mg/dL',
                  range: '0.3', // no options
                },
              ].map((test) => (
                <tr key={test.name} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-medium">{test.label}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      name={`lipidProfile.${test.name}.value`}
                      value={formData.lipidProfile[test.name]?.value || ''}
                      onChange={handleChange}
                      placeholder={`Enter ${test.label}`}
                      required
                      className="w-full border p-2"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span>{test.unit}</span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {test.options ? (
                      <select
                        name={`lipidProfile.${test.name}.range`}
                        value={formData.lipidProfile[test.name]?.range || ''}
                        onChange={handleChange}
                        className="w-full border p-2"
                      >
                        <option value="" disabled>Select Range</option>
                        {test.options.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{formData.lipidProfile[test.name]?.range || ''}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TSH Test and Other Parameters */}
          <h2 className="text-lg font-bold mt-8 mb-4">TSH Test and Other Parameters</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border border-gray-300 font-semibold">Name of Test</th>
                <th className="p-2 border border-gray-300 font-semibold">Observed Values</th>
                <th className="p-2 border border-gray-300 font-semibold">Unit</th>
                <th className="p-2 border border-gray-300 font-semibold">Normal Range</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Triiodothyronine (T3)', name: 'triiodothyronine', unit: 'ng/d', range: '0.58-1.62' },
                { label: 'Thyroxine (T4)', name: 'thyroxine', unit: 'ug/dl', range: '5.0-14.5' },
                {
                  label: 'TSH (Thyroid Stimulating Hormone)',
                  name: 'tsh',
                  unit: 'uIU/mL',
                  options: [
                    'Normal: 0.35-5.1',
                    'Pregnant T1: 0.05-4.73',
                    'Pregnant T2: 0.30-4.79',
                    'Pregnant T3: 0.50-6.02'
                  ]
                },
                { label: 'SGOT (AST)', name: 'sgot', unit: 'IU/L', range: '00-46' },
                { label: 'SGPT (ALT)', name: 'sgpt', unit: 'IU/L', range: '00-49' },
                { label: 'Alkaline Phosphatase', name: 'alkalinePhosphatase', unit: 'U/L', range: '30-145' },
                { label: 'Total Protein', name: 'totalProtein', unit: 'g/dl', range: '6.0-8.30' },
                { label: 'Albumin', name: 'albumin', unit: 'g/dl', range: '3.5-5.0' },
                { label: 'Globulin', name: 'globulin', unit: 'g/dl', range: '1.50-3.0' },
                { label: 'AIb/Glo Ratio', name: 'albRatio', unit: 'milli./cu.mm', range: '0.90-2.00' },
                { label: 'Platelet count', name: 'plateletCount', unit: 'Lakh/cumm', range: '1.5-4.5' },
                { label: 'Mean Platelet Volume (MPV)', name: 'mpv', unit: 'fl', range: '6.5-12.0' },
                { label: 'Platelet Distribution (PDW)', name: 'pdw', unit: 'fl', range: '15-17' },
                { label: 'HIV I Antibodies', name: 'hivFirst', unit: '', range: 'Non – Reactive' },
                { label: 'HIV II Antibodies', name: 'hivSecond', unit: '', range: 'Non – Reactive' },
                {
                  label: 'HBA1C',
                  name: 'HBA1C',
                  unit: '%',
                  options: [
                    'Non-Diabetic: 4-6',
                    'Excellent Control: 6-7',
                    'Fair to Good Control: 7-8',
                    'Unsatisfactory Control: 8-10',
                    'Poor Control: >10'
                  ]
                },
              ].map((test) => (
                <tr key={test.name} className="border border-gray-300">
                  <td className="p-2 border border-gray-300 font-medium">{test.label}</td>
                  <td className="p-2 border border-gray-300">
                    <input
                      type="text"
                      name={`tshTest.${test.name}.value`}
                      value={formData.tshTest[test.name]?.value || ''}
                      onChange={handleChange}
                      placeholder={`Enter ${test.label}`}
                      required
                      className="w-full border p-2"
                    />
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span>{test.unit}</span>
                  </td>
                  <td className="p-2 border border-gray-300">
                    {test.options ? (
                      <select
                        name={`tshTest.${test.name}.range`}
                        value={formData.tshTest[test.name]?.range || ''}
                        onChange={handleChange}
                        className="w-full border p-2"
                      >
                        <option value="" disabled>Select Range</option>
                        {test.options.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <span>{test.range}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Document File Field */}
          {/* Document Upload */}
          <div>
            <label htmlFor="documentFile" className="block font-bold mb-1">Medical Document *</label>
            <input
              type="file"
              id="documentFile"
              name="documentFile"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleDocumentChange}
              multiple // Allow multiple files
              required
              className="w-full border p-2 mb-4"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="col-span-2 bg-[#302C51] hover:bg-[#ff6015] text-white py-2 px-4 rounded">
            Create Patient
          </button>
        </form>
      </div>
    </SuperAdminLayout>
  );
};

export default CreatePatient;

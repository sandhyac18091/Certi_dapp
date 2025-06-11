import React, { useState } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { useNavigate } from 'react-router-dom';
import abi from '../assets/Certiapp.json';
import address from '../assets/deployed_address.json';

function App() {
  const [txtDetails, setTxtDetails] = useState({
    ID: 0,
    Name: '',
    Course: '',
    Grade: '',
    Date: '',
  });
  const navigate = useNavigate();

  const provider = new BrowserProvider(window.ethereum);

  function handleChange(e) {
    const { name, value } = e.target;
    setTxtDetails((prevState) => ({ ...prevState, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(txtDetails);
    const signer = await provider.getSigner();
    const contractobj = new Contract(address['CertiModule#Certiapp'], abi.abi, signer);
    const txtreceipt = await contractobj.issue(
      txtDetails.ID,
      txtDetails.Name,
      txtDetails.Course,
      txtDetails.Grade,
      txtDetails.Date
    );
    if (txtreceipt) {
      console.log(txtreceipt);
      alert(`${txtreceipt.hash} created successfully`);
    } else {
      alert('Check details');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">

      {/* Home Button positioned top right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => navigate('/')}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-4 py-2 rounded shadow-md transition duration-200"
        >
          Home
        </button>
      </div>

      {/* Main white card container */}
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Certificate Issuer</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">ID</label>
            <input
              type="text"
              name="ID"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="Name"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Course</label>
            <input
              type="text"
              name="Course"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Grade</label>
            <input
              type="text"
              name="Grade"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="Date"
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg bg-gray-50"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="submit"
              value="Submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md transition duration-200 cursor-pointer"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;

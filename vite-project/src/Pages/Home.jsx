import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { abi } from '../assets/Certiapp.json';
import { Contract } from 'ethers';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Home = () => {
    const [certificateId, setCertificateId] = useState('');
    const [certificateData, setCertificateData] = useState(null);
    const [walletAddress, setWalletAddress] = useState('');
    const [output, setOutput] = useState('');
    const navigate = useNavigate();

    // Auto connect if wallet already authorized
    useEffect(() => {
        const autoConnect = async () => {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    localStorage.setItem('token', accounts[0]);
                }
            }
        };
        autoConnect();
    }, []);

    // Listen for account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    localStorage.setItem('token', accounts[0]);
                } else {
                    setWalletAddress('');
                    localStorage.removeItem('token');
                }
            });
        }
    }, []);

    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert('MetaMask is not installed');
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            const address = accounts[0];
            setWalletAddress(address);
            localStorage.setItem('token', address);
            console.log('Wallet connected:', address);
        } catch (err) {
            console.error('MetaMask connection error:', err);
            alert("Failed to connect MetaMask");
        }
    };

    const handleSearch = async () => {
        if (!certificateId.trim()) {
            alert('Please enter a valid Certificate ID');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new Contract(contractAddress, abi, signer);

            const id = parseInt(certificateId);
            const result = await contract.Certificates(id);

            if (result.isExist) {
                setCertificateData({
                    name: result.name,
                    course: result.course,
                    grade: result.grade,
                    date: result.date,
                });

                const out = `Name: ${result.name}, Course: ${result.course}, Grade: ${result.grade}, Date: ${result.date}`;
                setOutput(out);
            } else {
                alert("Certificate not found");
                setCertificateData(null);
                setOutput('');
            }
        } catch (err) {
            console.error("Error fetching certificate:", err);
            alert("Error fetching certificate");
            setCertificateData(null);
            setOutput('');
        }
    };

    const shortenAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-600">Certificate Dapp</h1>

                <div className="flex items-center space-x-4">
                    {walletAddress ? (
                        <span className="text-green-700 font-medium">
                            Connected: {shortenAddress(walletAddress)}
                        </span>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                        >
                            Connect MetaMask
                        </button>
                    )}

                    <Link
                        to="/issue"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Issue Certificate
                    </Link>
                </div>
            </div>

            <div className="text-center">
                <img
                    src="/online-course.png"
                    alt="Online Course"
                    className="w-56 mx-auto mb-8"
                />

                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Enter Certificate ID to View"
                        value={certificateId}
                        onChange={(e) => setCertificateId(e.target.value)}
                        className="border-2 border-sky-500 h-10 px-3 w-64 rounded"
                    />
                    <button
                        type="button"
                        onClick={handleSearch}
                        className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
                    >
                        Search
                    </button>
                </div>

                {certificateData && (
                    <div className="mt-6 text-left w-[60%] mx-auto bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">Certificate Details</h2>
                        <p><strong>Name:</strong> {certificateData.name}</p>
                        <p><strong>Course:</strong> {certificateData.course}</p>
                        <p><strong>Grade:</strong> {certificateData.grade}</p>
                        <p><strong>Date:</strong> {certificateData.date}</p>
                    </div>
                )}

                {output && (
                    <div className="mt-4 text-green-700 font-medium">{output}</div>
                )}
            </div>
        </div>
    );
};

export default Home;

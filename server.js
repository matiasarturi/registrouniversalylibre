import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock contract for demo purposes
const CONTRACT_ABI = [
    "function registerHash(bytes32 hash, string identifier) external",
    "function getRegistration(bytes32 hash) external view returns (uint256 timestamp, string identifier)"
];

app.post('/api/register', async (req, res) => {
    try {
        const { hash, identifier } = req.body;
        
        if (!hash) {
            return res.status(400).json({ error: 'Hash requerido' });
        }

        // In a real implementation, you would:
        // 1. Connect to Ethereum network
        // 2. Call the smart contract
        // 3. Wait for transaction confirmation
        // 4. Get the transaction details
        
        // For demo purposes, we'll simulate a successful registration
        const mockTransaction = {
            hash: '0x' + Math.random().toString(16).substr(2, 64),
            blockNumber: Math.floor(Math.random() * 1000000),
            timestamp: Math.floor(Date.now() / 1000)
        };

        const certificate = {
            fileHash: hash,
            identifier: identifier || 'Anónimo',
            transactionId: mockTransaction.hash,
            blockNumber: mockTransaction.blockNumber,
            timestamp: new Date(mockTransaction.timestamp * 1000).toISOString(),
            network: 'Sepolia Testnet',
            explorerUrl: `https://sepolia.etherscan.io/tx/${mockTransaction.hash}`
        };

        res.json(certificate);
    } catch (error) {
        console.error('Error registering hash:', error);
        res.status(500).json({ error: 'Error al registrar en blockchain' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
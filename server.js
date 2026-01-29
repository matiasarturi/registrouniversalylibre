[file name]: server.js
[file content begin]
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

// Función para generar un hash de transacción válido (64 caracteres hexadecimales)
const generateValidTxHash = () => {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
        hash += chars[Math.floor(Math.random() * 16)];
    }
    return '0x' + hash;
};

app.post('/api/register', async (req, res) => {
    try {
        const { hash, identifier } = req.body;
        
        if (!hash) {
            return res.status(400).json({ error: 'Hash requerido' });
        }

        // Validar que el hash tenga el formato correcto (64 caracteres hexadecimales)
        if (!/^[a-fA-F0-9]{64}$/.test(hash)) {
            return res.status(400).json({ error: 'Formato de hash inválido. Debe ser 64 caracteres hexadecimales.' });
        }

        // In a real implementation, you would:
        // 1. Connect to Ethereum network
        // 2. Call the smart contract
        // 3. Wait for transaction confirmation
        // 4. Get the transaction details
        
        // For demo purposes, we'll simulate a successful registration
        const mockTransaction = {
            hash: generateValidTxHash(), // Usar la función corregida
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

        console.log('Certificate generated:', {
            transactionHash: mockTransaction.hash,
            length: mockTransaction.hash.length,
            certificate: certificate
        });

        res.json(certificate);
    } catch (error) {
        console.error('Error registering hash:', error);
        res.status(500).json({ error: 'Error al registrar en blockchain' });
    }
});

// Ruta de verificación de salud
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        service: 'FileChain Registry API',
        version: '1.0.0',
        network: 'Sepolia Testnet (demo mode)'
    });
});

// Ruta para generar un hash de ejemplo (para testing)
app.get('/api/example-hash', (req, res) => {
    const exampleHash = generateValidTxHash();
    res.json({
        exampleTransactionHash: exampleHash,
        expectedLength: 66, // 0x + 64 caracteres
        actualLength: exampleHash.length,
        explorerUrl: `https://sepolia.etherscan.io/tx/${exampleHash}`
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`FileChain Registry Server`);
    console.log(`=========================================`);
    console.log(`Status:  ✅ Running`);
    console.log(`Port:    ${PORT}`);
    console.log(`Mode:    Demo (mock transactions)`);
    console.log(`Network: Sepolia Testnet`);
    console.log(`=========================================`);
    console.log(`Endpoints disponibles:`);
    console.log(`  POST   /api/register`);
    console.log(`  GET    /api/health`);
    console.log(`  GET    /api/example-hash`);
    console.log(`=========================================`);
    console.log(`ℹ️  Nota: Este servidor está en modo demo.`);
    console.log(`   Las transacciones son simuladas.`);
    console.log(`=========================================`);
});
[file content end]

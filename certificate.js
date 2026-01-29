import JSZip from 'jszip';

export class CertificateManager {
    constructor(app) {
        this.app = app;
    }

    // removed function registerOnBlockchain() {}
    // removed function createAndDownloadPackage() {}
    // removed function saveLastCertificateToCloud() {}
    // removed function saveCertificateToStorage() {}

    async calculateFileHash(file) {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    async registerOnBlockchain(fileHash, identifier) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockCertificate = {
            hash: fileHash,
            identifier: identifier || 'Anónimo',
            timestamp: new Date().toISOString(),
            transactionId: '0x' + Array(65).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
            blockNumber: Math.floor(Math.random() * 1000000),
            network: 'Sepolia Testnet',
            explorerUrl: `https://sepolia.etherscan.io/tx/0x${Math.random().toString(16).substr(2, 64)}`
        };

        return mockCertificate;
    }

    async createAndDownloadPackage(certificate) {
        const zip = new JSZip();
        
        zip.file(this.app.selectedFile.name, this.app.selectedFile);
        zip.file('certificate.json', JSON.stringify(certificate, null, 2));
        
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `filechain-registry-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        if (this.app.currentUser && this.app.intentToSave) {
            certificate.fileName = this.app.selectedFile.name;
            this.app.storageManager.saveCertificateToStorage(certificate);
        }
    }

    saveLastCertificateToCloud() {
        if (!this.app.currentUser) {
            this.app.authManager.showRegistrationModalForSave();
            return;
        }
        
        if (this.app.lastCertificate) {
            this.saveCertificateToStorage(this.app.lastCertificate);
        }
    }

    async registerFile() {
        if (!this.app.selectedFile) return;

        const identifier = document.getElementById('identifier').value;
        
        // Show status section
        document.getElementById('statusSection').style.display = 'block';
        document.getElementById('statusSection').classList.add('fade-in');
        
        // Hide upload section
        document.querySelector('.upload-section').style.display = 'none';
        
        // Calculate hash
        this.app.uiManager.updateStatus('statusHash', 'active');
        const fileHash = await this.calculateFileHash(this.app.selectedFile);
        this.app.uiManager.updateStatus('statusHash', 'completed');
        
        // Register on blockchain
        this.app.uiManager.updateStatus('statusBlockchain', 'active');
        const certificate = await this.registerOnBlockchain(fileHash, identifier);
        this.app.uiManager.updateStatus('statusBlockchain', 'completed');
        
        // Create package
        this.app.uiManager.updateStatus('statusPackage', 'active');
        await this.createAndDownloadPackage(certificate);
        this.app.uiManager.updateStatus('statusPackage', 'completed');
        
        // Display result
        this.app.uiManager.displayResult(certificate);
    }

    saveCertificateToStorage(certificate) {
        if (!this.app.currentUser) {
            this.app.authManager.showRegistrationModalForSave();
            return;
        }

        if (this.app.userCertificates.length >= 1) {
            alert('Has alcanzado el límite de certificados gratuitos. Por favor, actualiza tu plan para guardar más certificados.');
            document.getElementById('upgradeBtn').click();
            return;
        }

        const certToSave = {
            ...certificate,
            id: Date.now().toString(),
            userId: this.app.currentUser.id,
            timestamp: new Date().toISOString()
        };

        this.app.userCertificates.push(certToSave);
        localStorage.setItem('userCertificates', JSON.stringify(this.app.userCertificates));
        
        this.app.storageManager.renderCertificatesList();
        alert('¡Certificado guardado exitosamente en tu espacio personal!');
    }
}
export class StorageManager {
    constructor(app) {
        this.app = app;
    }

    // removed function showPersonalStorage() {}
    // removed function hidePersonalStorage() {}
    // removed function loadUserCertificates() {}
    // removed function renderCertificatesList() {}
    // removed function viewCertificate() {}
    // removed function downloadCertificate() {}
    // removed function deleteCertificate() {}

    showPersonalStorage() {
        document.getElementById('personalStorage').style.display = 'block';
        this.loadUserCertificates();
    }

    hidePersonalStorage() {
        document.getElementById('personalStorage').style.display = 'none';
    }

    loadUserCertificates() {
        const userId = this.app.currentUser?.id;
        if (!userId) return;
        const key = `filechain_certs_${userId}`;
        const certificates = JSON.parse(localStorage.getItem(key) || '[]');
        this.app.userCertificates = certificates;
        this.renderCertificatesList();
    }

    renderCertificatesList() {
        const listContainer = document.getElementById('certificatesList');
        
        if (this.app.userCertificates.length === 0) {
            listContainer.innerHTML = '';
            return;
        }

        listContainer.innerHTML = this.app.userCertificates.map((cert, index) => `
            <div class="certificate-item">
                <div class="certificate-info">
                    <div class="certificate-name">${cert.fileName}</div>
                    <div class="certificate-date">${new Date(cert.timestamp).toLocaleDateString('es-ES')}</div>
                </div>
                <div class="certificate-actions">
                    <button class="view-btn" onclick="fileChainRegistry.storageManager.viewCertificate(${index})">Ver</button>
                    <button class="download-btn" onclick="fileChainRegistry.storageManager.downloadCertificate(${index})">Descargar</button>
                    <button class="delete-btn" onclick="fileChainRegistry.storageManager.deleteCertificate(${index})">Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    viewCertificate(index) {
        const certificate = this.app.userCertificates[index];
        alert(`Detalles del certificado:\n\nArchivo: ${certificate.fileName}\nHash: ${certificate.hash}\nFecha: ${new Date(certificate.timestamp).toLocaleString('es-ES')}\nIdentificador: ${certificate.identifier}`);
    }

    downloadCertificate(index) {
        const certificate = this.app.userCertificates[index];
        const certData = JSON.stringify(certificate, null, 2);
        const blob = new Blob([certData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificado-${certificate.fileName}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    deleteCertificate(index) {
        if (confirm('¿Estás seguro de que deseas eliminar este certificado?')) {
            this.app.userCertificates.splice(index, 1);
            const key = `filechain_certs_${this.app.currentUser.id}`;
            localStorage.setItem(key, JSON.stringify(this.app.userCertificates));
            this.renderCertificatesList();
        }
    }
}
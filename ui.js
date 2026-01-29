export class UIManager {
    constructor(app) {
        this.app = app;
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    // removed function setupEventListeners() {}
    // removed function setupDragAndDrop() {}
    // removed function handleFileSelect() {}
    // removed function displayResult() {}
    // removed function updateStatus() {}
    // removed function formatFileSize() {}

    setupEventListeners() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const removeFile = document.getElementById('removeFile');
        const registerBtn = document.getElementById('registerBtn');
        const newRegistrationBtn = document.getElementById('newRegistrationBtn');
        const saveCloudBtn = document.getElementById('saveCloudBtn');

        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const closeModalBtn = document.getElementById('closeModalBtn');
        const registrationForm = document.getElementById('registrationForm');
        const googleLoginBtn = document.getElementById('googleLoginBtn');
        const outlookLoginBtn = document.getElementById('outlookLoginBtn');
        const homeBtn = document.getElementById('homeBtn');

        if (!uploadArea || !fileInput || !removeFile || !registerBtn || !newRegistrationBtn || !saveCloudBtn) {
            console.error('Some required elements are missing from the DOM');
            return;
        }

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        removeFile.addEventListener('click', () => this.app.removeFile());
        registerBtn.addEventListener('click', () => this.app.certificateManager.registerFile());
        newRegistrationBtn.addEventListener('click', () => this.resetForm());
        saveCloudBtn.addEventListener('click', () => this.app.certificateManager.saveLastCertificateToCloud());

        if (loginBtn) loginBtn.addEventListener('click', () => this.app.authManager.showRegistrationModal());
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.app.authManager.logout());
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => this.app.authManager.hideRegistrationModal());
        if (registrationForm) registrationForm.addEventListener('submit', (e) => this.app.authManager.handleRegistration(e));
        if (googleLoginBtn) googleLoginBtn.addEventListener('click', () => this.app.authManager.handleGoogleLogin());
        if (outlookLoginBtn) outlookLoginBtn.addEventListener('click', () => this.app.authManager.handleOutlookLogin());
        if (homeBtn) homeBtn.addEventListener('click', () => this.resetForm());
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');

        uploadArea.addEventListener('dragenter', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect({ target: { files: files } });
            }
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.app.selectedFile = file;
            this.displayFileInfo(file);
            document.getElementById('registerBtn').disabled = false;
        }
    }

    displayFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');

        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        
        fileInfo.style.display = 'flex';
        document.getElementById('uploadArea').style.display = 'none';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    displayResult(certificate) {
        setTimeout(() => {
            document.getElementById('statusSection').style.display = 'none';
            document.getElementById('resultSection').style.display = 'block';
            document.getElementById('resultSection').classList.add('fade-in');
            
            document.getElementById('resultHash').textContent = certificate.hash;
            document.getElementById('resultDate').textContent = new Date(certificate.timestamp).toLocaleString('es-ES');
            document.getElementById('resultLink').href = certificate.explorerUrl;
            
            this.app.lastCertificate = certificate;
            this.app.lastCertificate.fileName = this.app.selectedFile.name;
        }, 1000);
    }

    updateStatus(elementId, status) {
        const element = document.getElementById(elementId);
        element.classList.remove('active', 'completed');
        element.classList.add(status);
    }

    resetForm() {
        this.app.selectedFile = null;
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('resultSection').style.display = 'none';
        document.querySelector('.upload-section').style.display = 'flex';
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('registerBtn').disabled = true;
        document.getElementById('fileInput').value = '';
        document.getElementById('identifier').value = '';
        
        document.querySelectorAll('.status-item').forEach(item => {
            item.classList.remove('active', 'completed');
        });
    }
}
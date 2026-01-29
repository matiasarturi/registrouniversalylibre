// Main application entry point
import { AuthManager } from './auth.js';
import { CertificateManager } from './certificate.js';
import { StorageManager } from './storage.js';
import { UIManager } from './ui.js';

class FileChainRegistry {
    constructor() {
        this.selectedFile = null;
        this.currentUser = null;
        this.userCertificates = [];
        this.lastCertificate = null;
        
        // Initialize managers
        this.authManager = new AuthManager(this);
        this.certificateManager = new CertificateManager(this);
        this.storageManager = new StorageManager(this);
        this.uiManager = new UIManager(this);
        
        this.init();
    }

    init() {
        // removed function setupEventListeners() {}
        // removed function setupDragAndDrop() {}
        // removed function handleFileSelect() {}
        // removed function processFile() {}
        // removed function displayFileInfo() {}
        // removed function removeFile() {}
        // removed function calculateFileHash() {}
        // removed function registerFile() {}
        // removed function updateStatus() {}
        // removed function resetForm() {}
        // removed function formatFileSize() {}
        
        // Initialize UI and check auth
        this.uiManager.init();
        this.authManager.checkUserLoggedIn();
        
        // Home button functionality
        const homeBtn = document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.uiManager.resetForm();
            });
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.fileChainRegistry = new FileChainRegistry();
});
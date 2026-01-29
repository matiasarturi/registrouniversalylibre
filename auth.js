export class AuthManager {
    constructor(app) {
        this.app = app;
    }

    // removed function showRegistrationModal() {}
    // removed function showRegistrationModalForSave() {}
    // removed function hideRegistrationModal() {}
    // removed function handleRegistration() {}
    // removed function handleGoogleLogin() {}
    // removed function handleOutlookLogin() {}
    // removed function checkUserLoggedIn() {}
    // removed function updateUIForLoggedInUser() {}
    // removed function logout() {}

    async handleRegistration(e) {
        e.preventDefault();
        const email = document.getElementById('emailInput').value;
        const password = document.getElementById('passwordInput').value;

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = {
                email: email,
                id: Math.random().toString(36).substr(2, 9),
                registrationDate: new Date().toISOString()
            };

            localStorage.setItem('filechainUser', JSON.stringify(user));
            this.app.currentUser = user;
            
            this.updateUIForLoggedInUser();
            this.hideRegistrationModal();
            this.app.storageManager.showPersonalStorage();
            
        } catch (error) {
            alert('Error al registrarse: ' + error.message);
        }
    }

    async handleGoogleLogin() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = {
                email: 'usuario@gmail.com',
                id: 'google_' + Math.random().toString(36).substr(2, 9),
                registrationDate: new Date().toISOString(),
                provider: 'google'
            };

            localStorage.setItem('filechainUser', JSON.stringify(user));
            this.app.currentUser = user;
            
            this.updateUIForLoggedInUser();
            this.hideRegistrationModal();
            this.app.storageManager.showPersonalStorage();
            
        } catch (error) {
            alert('Error al iniciar sesión con Google');
        }
    }

    async handleOutlookLogin() {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const user = {
                email: 'usuario@outlook.com',
                id: 'outlook_' + Math.random().toString(36).substr(2, 9),
                registrationDate: new Date().toISOString(),
                provider: 'outlook'
            };

            localStorage.setItem('filechainUser', JSON.stringify(user));
            this.app.currentUser = user;
            
            this.updateUIForLoggedInUser();
            this.hideRegistrationModal();
            this.app.storageManager.showPersonalStorage();
            
        } catch (error) {
            alert('Error al iniciar sesión con Outlook');
        }
    }

    checkUserLoggedIn() {
        const userData = localStorage.getItem('filechainUser');
        if (userData) {
            this.app.currentUser = JSON.parse(userData);
            this.updateUIForLoggedInUser();
            this.app.storageManager.showPersonalStorage();
        }
    }

    updateUIForLoggedInUser() {
        if (this.app.currentUser) {
            document.getElementById('userMenu').style.display = 'flex';
            document.getElementById('userEmail').textContent = this.app.currentUser.email;
            document.getElementById('loginBtn').style.display = 'none';
        } else {
            document.getElementById('userMenu').style.display = 'none';
            document.getElementById('loginBtn').style.display = 'block';
            document.getElementById('loginBtn').style.color = '#FFFFFF';
        }
    }

    logout() {
        localStorage.removeItem('filechainUser');
        localStorage.removeItem('userCertificates');
        this.app.currentUser = null;
        this.app.userCertificates = [];
        this.updateUIForLoggedInUser();
        this.app.storageManager.hidePersonalStorage();
    }

    showRegistrationModal() {
        document.getElementById('registrationModal').style.display = 'flex';
    }

    showRegistrationModalForSave() {
        document.getElementById('registrationModal').style.display = 'flex';
        this.app.intentToSave = true;
    }

    hideRegistrationModal() {
        document.getElementById('registrationModal').style.display = 'none';
    }
}
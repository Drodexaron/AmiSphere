import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    setPersistence, 
    browserLocalPersistence, 
    sendEmailVerification 
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHa763LmNuTzyOHcahE6PYjxIwkptwD6k",
    authDomain: "amisphere-f90ab.firebaseapp.com",
    projectId: "amisphere-f90ab",
    storageBucket: "amisphere-f90ab.appspot.com",
    messagingSenderId: "157730190402",
    appId: "1:157730190402:web:6c4721278d2327e82669db",
    measurementId: "G-JVJFL5RFZL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');
const emailVerifi = document.getElementById('emailVerifi');
const resendButton = document.getElementById('emailResend'); 

const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await loginUser(email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            await sendEmailVerification(user);
            errorMessage.textContent = 'Verification email sent. Please check your inbox.';
            errorMessage.style.color = 'orange';
            emailVerifi.style.display = 'block';
        } else {
            errorMessage.textContent = 'Login successful!';
            errorMessage.style.color = 'green';
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 2000); 
        }
    } catch (error) {
        let errorMsg = 'Login error.';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMsg = 'Invalid email address.';
                break;
            case 'auth/wrong-password':
                errorMsg = 'Incorrect password.';
                break;
            case 'auth/user-not-found':
                errorMsg = 'User not found.';
                break;
        }
        errorMessage.textContent = errorMsg;
        errorMessage.style.color = 'red';
    }
});

// Resend Button Click Handler
resendButton.addEventListener('click', async () => { 
    try {
        if (auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
            errorMessage.textContent = 'Verification email sent again.';
            errorMessage.style.color = 'orange';
        } else {
            errorMessage.textContent = 'Please log in first to resend verification.';
            errorMessage.style.color = 'red';
        }
    } catch (error) {
        errorMessage.textContent = 'Error resending verification email.';
        errorMessage.style.color = 'red';
        console.error('Error resending verification:', error);
    }
});

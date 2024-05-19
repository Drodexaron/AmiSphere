import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  sendEmailVerification,
} from 'firebase/auth';

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

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Local persistence enabled');
  })
  .catch((error) => {
    console.error('Local persistence error:', error);
  });

const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  console.log('Attempting login...');
  loginUser(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;

      if (user.emailVerified) {
        errorMessage.textContent = 'Login successful!';
        errorMessage.style.color = 'green';
        console.log('User logged in successfully:', user);
        // Redirect to index.html after a short delay
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000); // Delay for 2 seconds
      } else {
        errorMessage.textContent = 'Please verify your email before logging in.';
        errorMessage.style.color = 'red';
        sendEmailVerification(user)
          .then(() => {
            console.log('Verification email sent.');
          })
          .catch((error) => {
            console.error('Error sending verification email:', error);
          });
        signOut(auth);
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMsg = error.message;
      errorMessage.textContent = 'Wrong Email or Password';
      errorMessage.style.color = 'red';
      console.error('Login error:', error);
    });
});
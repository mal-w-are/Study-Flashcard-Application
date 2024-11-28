import { auth, provider } from "./firebase-config.js";
import { signInWithEmailAndPassword, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

let isLoading = false;

// Handle form submission
document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("username").value; 
    const password = document.getElementById("password").value;
    const errorMessageDiv = document.getElementById("error-message");

    errorMessageDiv.style.display = 'none';
    errorMessageDiv.textContent = '';

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save user details to localStorage after login
            localStorage.setItem("userId", user.uid); // Store userId
            localStorage.setItem("displayName", user.displayName || "Guest"); // Store displayName (or "Guest")
            localStorage.setItem("photoURL", user.photoURL || "default.jpg"); // Store photo URL (default if not available)

            window.location.href = "index.html"; 
        })
        .catch((error) => {
            errorMessageDiv.textContent = "Incorrect email or password."; 
            errorMessageDiv.style.display = 'block'; 
        });
});

// Handle Google Sign-In
document.getElementById("google-signin-button").addEventListener("click", function() {
    if (isLoading) return;

    isLoading = true;
    const googleSignInButton = document.getElementById("google-signin-button");
    googleSignInButton.disabled = true;

    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            const displayName = user.displayName;
            const photoURL = user.photoURL;

            // Save user details to localStorage after Google sign-in
            localStorage.setItem("userId", user.uid);  // Store userId
            localStorage.setItem("displayName", displayName);  // Store displayName
            localStorage.setItem("photoURL", photoURL);  // Store photoURL

            alert("Google Sign-In successful!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        })
        .finally(() => {
            isLoading = false;
            googleSignInButton.disabled = false;
        });
});

// Password visibility toggle
const togglePassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", function() {
    // Toggle the type attribute
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle the eye icon
    this.querySelector("i").classList.toggle("fa-eye"); // Change to open eye
    this.querySelector("i").classList.toggle("fa-eye-slash"); // Change to closed eye
});

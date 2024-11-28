// Import Firebase Auth functions
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const auth = getAuth();

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("username").value; // Change 'username' to 'email'
    const password = document.getElementById("password").value;

    // Use Firebase authentication to sign in
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert("Login successful!");
            // Redirect to main app page (e.g., flashcards.html)
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
});

document.getElementById("forgot-password").addEventListener("click", function() {
    const email = prompt("Enter your registered email:");
    if (email) {
        // Use Firebase to send a password reset email
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert(`A reset password link has been sent to ${email}`);
            })
            .catch((error) => {
                alert("Error: " + error.message);
            });
    }
});

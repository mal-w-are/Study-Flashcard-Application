document.getElementById("feedbackForm").addEventListener("submit", function(e) {
    e.preventDefault();  // Prevent the default form submission
    
    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const feedback = document.getElementById("feedback").value;

    // Basic validation
    if (name && email && feedback) {
        alert("Thank you for your feedback!");
        // Optionally, send the data to your server or Firebase
        console.log("Feedback Submitted: ", { name, email, feedback });
        
        // Clear the form after submission
        document.getElementById("feedbackForm").reset();
    } else {
        alert("Please fill in all fields before submitting.");
    }
});

// User Info and Navigation
const displayName = localStorage.getItem("displayName") || "Guest";
const photoURL = localStorage.getItem("photoURL");
document.getElementById("user-name").textContent = displayName;
document.getElementById("user-name").style.display = "inline";

if (photoURL) {
    document.getElementById("user-photo").src = photoURL;
    document.getElementById("user-photo").style.display = "inline";
    document.getElementById("default-photo").style.display = "none";
} else {
    document.getElementById("default-photo").style.display = "inline";
}

document.getElementById("logout").addEventListener("click", function() {
    localStorage.removeItem("displayName");
    localStorage.removeItem("photoURL");
    window.location.href = "login.html";
});

// Calendar Variables
const monthYearElement = document.getElementById('monthYear');
const datesElement = document.getElementById('dates');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentDate = new Date();

// Track Active Days
const today = new Date();
today.setHours(0, 0, 0, 0); // Normalize today to midnight
const todayString = today.toISOString().split('T')[0];
let activeDays = JSON.parse(localStorage.getItem("activeDays")) || [];

// Record today's date as active if not already in list
if (!activeDays.includes(todayString)) {
    activeDays.push(todayString);
    localStorage.setItem("activeDays", JSON.stringify(activeDays));
}

// Update Calendar Function
const updateCalendar = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDayOfMonth.getDate();
    const firstDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Adjust to start with Monday
    const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    monthYearElement.textContent = monthYearString;
    
    let datesHTML = '';

    // Days from the previous month
    const lastDatePrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
        const prevDate = lastDatePrevMonth - i + 1;
        datesHTML += `<div class="date inactive">${prevDate}</div>`;
    }

    // Days for the current month
    for (let i = 1; i <= totalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        date.setHours(0, 0, 0, 0); // Normalize to midnight

        const dateString = date.toISOString().split('T')[0];
        const activeClass = dateString === todayString ? 'active' : '';
        const isActive = activeDays.includes(dateString) && date < today;

        // Add green dot if date is in activeDays list and is a past date
        datesHTML += ` 
            <div class="date ${activeClass}">
                ${i}
                ${isActive ? '<span class="active-dot"></span>' : ''}
            </div>`;
    }

    // Days for the next month
    const remainingDays = (7 - (firstDayIndex + totalDays) % 7) % 7;
    for (let i = 1; i <= remainingDays; i++) {
        datesHTML += `<div class="date inactive">${i}</div>`;
    }

    datesElement.innerHTML = datesHTML;
};

// Calendar Navigation
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();  // Initial call to display the calendar

// Search Bar and Search Icon Event Listeners
const searchBar = document.getElementById("search-bar");
const searchIcon = document.getElementById("search-icon");

// Trigger search when search icon is clicked
searchIcon.addEventListener("click", function () {
    const query = searchBar.value.trim().toLowerCase();
    if (query) {
        searchFlashcards(query); // Call search function when icon is clicked
    } else {
        alert("Please enter a search term!"); // Handle empty input
    }
});

// Optionally live search as user types
searchBar.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();
    searchFlashcards(query); // Optionally enable live search
});

// Function to search flashcards
function searchFlashcards(query) {
    const flashcardsListDiv = document.getElementById("flashcards-list");

    // Fetch flashcards from Firebase
    firebase.database().ref("flashcards").once("value", snapshot => {
        const flashcards = snapshot.val();

        if (!flashcards) {
            flashcardsListDiv.innerHTML = `<p>No flashcards in the database.</p>`;
            return;
        }

        // Filter flashcards based on query
        const flashcardsArray = Object.values(flashcards);
        const filteredFlashcards = flashcardsArray.filter(flashcard => 
            flashcard.front.toLowerCase().includes(query)
        );

        // Clear existing results
        flashcardsListDiv.innerHTML = "";

        if (filteredFlashcards.length === 0) {
            flashcardsListDiv.innerHTML = `<p>No flashcards found.</p>`;
            return;
        }

        // Render filtered flashcards
        filteredFlashcards.forEach(flashcard => {
            const flashcardElement = document.createElement("div");
            flashcardElement.classList.add("flashcard");
            flashcardElement.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <h3>Question:</h3>
                        <p>${flashcard.front}</p>
                    </div>
                    <div class="flashcard-back">
                        <h3>Answer:</h3>
                        <p>${flashcard.back}</p>
                    </div>
                </div>`;
            flashcardsListDiv.appendChild(flashcardElement);
        });
    }).catch(error => {
        console.error("Error fetching flashcards from Firebase:", error);
        flashcardsListDiv.innerHTML = `<p>Error fetching flashcards. Please try again later.</p>`;
    });
}


// Modal and Flashcard Functionality
const modal = document.getElementById('flashcardModal');
const modalContent = document.querySelector('.modal-content');
const minimizeButton = document.getElementById('minimizeModal');
const maximizeButton = document.getElementById('maximizeModal');
const closeButton = document.getElementById('closeModal');

// Minimize functionality
minimizeButton.addEventListener('click', function() {
    modal.classList.add('minimized');
    modal.classList.remove('maximized');
});

// Maximize functionality
maximizeButton.addEventListener('click', function() {
    modal.classList.add('maximized');
    modal.classList.remove('minimized');
});

// Close modal
closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Open modal when the 'Create a new flashcard' button is clicked
document.querySelector('.flashcard-button').addEventListener('click', function() {
    modal.style.display = 'flex';
    modal.classList.remove('minimized');  // Ensure modal is not minimized when opening
    modal.classList.add('maximized'); // Ensure it opens maximized
});

// Close modal if clicked outside of modal content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


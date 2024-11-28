import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
import { db } from './firebase-config.js'; // Update path if necessary

window.onload = async function() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("You are not logged in. Please log in first.");
        window.location.href = "index.html"; // Redirect to login page or home
        return;
    }

    // Array of possible background colors
    const colors = ['#A9D3FF', '#C1E1C1', '#F8C8DC', '#FFF5BA', '#FFB6C1', '#B2F2BB'];

    // Function to generate a random index for the colors array
    function getRandomColor() {
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Show the loading spinner
    function showLoadingSpinner() {
        document.getElementById("loadingSpinner").style.display = "block";
        document.getElementById("flashcardsTitle").style.display = "none"; // Hide title during loading
    }

    // Hide the loading spinner
    function hideLoadingSpinner() {
        document.getElementById("loadingSpinner").style.display = "none";
        document.getElementById("flashcardsTitle").style.display = "block"; // Show title again after loading
    }

    // Show loading spinner when fetching data
    showLoadingSpinner();

    try {
        // Get flashcards data from the Realtime Database
        const flashcardsRef = ref(db, `users/${userId}/flashcards`);
        const snapshot = await get(flashcardsRef);

        if (snapshot.exists()) {
            const flashcards = snapshot.val();
            const flashcardsListDiv = document.getElementById('flashcards-list');

            for (const key in flashcards) {
                const flashcard = flashcards[key];
                const flashcardElement = document.createElement('div');
                flashcardElement.classList.add('flashcard');
                flashcardElement.style.backgroundColor = getRandomColor(); // Apply random color
                flashcardElement.setAttribute('data-id', key); // Set data-id attribute to uniquely identify each flashcard

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
                    </div>
                `;
                flashcardsListDiv.appendChild(flashcardElement);
            }
        } else {
            alert("No flashcards found.");
        }
    } catch (error) {
        console.error("Error fetching flashcards:", error);
        alert("There was an error loading the flashcards. Please try again.");
    }

    // Hide the loading spinner when data is loaded
    hideLoadingSpinner();

    const contextMenu = document.getElementById('contextMenu');
    let selectedFlashcardId = null;

    // Right-click event listener
    document.body.addEventListener('contextmenu', function(event) {
        if (event.target.closest('.flashcard')) {
            event.preventDefault();
            selectedFlashcardId = event.target.closest('.flashcard').getAttribute('data-id');
            contextMenu.style.top = `${event.pageY}px`;
            contextMenu.style.left = `${event.pageX}px`;
            contextMenu.style.display = 'block';
        } else {
            contextMenu.style.display = 'none'; // Hide if not right-clicked on a flashcard
        }
    });

    // Hide context menu when clicking anywhere else
    document.addEventListener('click', function() {
        contextMenu.style.display = 'none';
    });

    // Delete option clicked
    document.getElementById('deleteOption').addEventListener('click', function() {
        if (selectedFlashcardId) {
            // Show loading spinner during delete operation
            showLoadingSpinner();

            // Delete the flashcard from Firebase
            const flashcardRef = ref(db, `users/${userId}/flashcards/${selectedFlashcardId}`);
            remove(flashcardRef).then(() => {
                alert("Flashcard deleted successfully");
                // Optionally, remove the flashcard from the DOM
                const flashcardElement = document.querySelector(`.flashcard[data-id="${selectedFlashcardId}"]`);
                if (flashcardElement) {
                    flashcardElement.remove();
                }
                contextMenu.style.display = 'none'; // Hide context menu
            }).catch(error => {
                console.error('Error deleting flashcard:', error);
                alert('Failed to delete flashcard');
            }).finally(() => {
                // Hide loading spinner once delete operation is finished
                hideLoadingSpinner();
            });
        }
    });
};

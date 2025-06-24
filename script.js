let totalTime = 10 * 60; // 10 minutes
let timeLeft = totalTime;
let timerInterval = null;
const timerDisplay = document.querySelector('.timer');
const carouselContainer = document.getElementById('carouselContainer');

// Function to load actual images if they exist
function loadImages() {
    const imageBoxes = document.querySelectorAll('.image-box');
    
    imageBoxes.forEach((box, index) => {
        const imgNum = box.getAttribute('data-img');
        const img = new Image();
        
        img.onload = function() {
            // Image loaded successfully
            box.style.backgroundImage = `url('img${imgNum}.jpeg')`;
            box.classList.add('has-image');
            box.textContent = ''; // Remove placeholder text
        };
        
        img.onerror = function() {
            // Image failed to load, keep the gradient background and text
            console.log(`Image img${imgNum}.jpeg not found, using placeholder`);
        };
        
        // Try to load the image
        img.src = `img${imgNum}.jpeg`;
    });
}

function updateTimerDisplay() {
    const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
    const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
    const secs = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

function showTimeUpPopup() {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    popupOverlay.innerHTML = `
        <div class="popup-box">
            <div class="popup-title">⏰ Time's Up!</div>
            <div class="popup-message">
                Your timer has finished! Would you like to start another session?
            </div>
            <div class="popup-buttons">
                <button class="popup-btn" id="popup-ok">OK</button>
                <button class="popup-btn primary" id="popup-repeat">Restart Timer</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popupOverlay);

    document.getElementById('popup-ok').addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
    });

    document.getElementById('popup-repeat').addEventListener('click', () => {
        restartTimer();
        startTimer();
        document.body.removeChild(popupOverlay);
    });

    // Close popup when clicking overlay
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            document.body.removeChild(popupOverlay);
        }
    });
}

function startTimer() {
    if (!timerInterval) {
        carouselContainer.classList.add('running');
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                carouselContainer.classList.remove('running');
                showTimeUpPopup();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    carouselContainer.classList.remove('running');
}

function restartTimer() {
    pauseTimer();
    timeLeft = totalTime;
    updateTimerDisplay();
    
    // Reset carousel animation
    carouselContainer.style.animation = 'none';
    carouselContainer.offsetHeight; // Trigger reflow
    carouselContainer.style.animation = null;
}

function deleteTimer() {
    pauseTimer();
    timeLeft = 0;
    updateTimerDisplay();
}

// Set time functionality
function setCustomTime() {
    const input = document.getElementById('timeInput').value.trim();
    
    if (!input) {
        alert("Please enter a time in HH:MM:SS format");
        return;
    }
    
    const parts = input.split(':').map(Number);
    
    if (parts.length === 3 && parts.every(n => !isNaN(n) && n >= 0)) {
        const [hrs, mins, secs] = parts;
        
        // Validate time values
        if (hrs >= 0 && mins < 60 && secs < 60) {
            totalTime = hrs * 3600 + mins * 60 + secs;
            timeLeft = totalTime;
            updateTimerDisplay();
            document.getElementById('timeInput').value = ''; // Clear input
        } else {
            alert("Invalid time values. Minutes and seconds should be less than 60.");
        }
    } else {
        alert("Invalid format. Please use HH:MM:SS (e.g., 00:05:30)");
    }
}

// Event listeners
document.getElementById('btn1').addEventListener('click', deleteTimer); // Trash/Delete
document.getElementById('btn2').addEventListener('click', startTimer); // Play
document.getElementById('btn3').addEventListener('click', pauseTimer); // Pause
document.getElementById('btn4').addEventListener('click', restartTimer); // Restart

// Set time button and Enter key support
const setTimeBtn = document.getElementById('setTimeBtn');
const timeInput = document.getElementById('timeInput');

if (setTimeBtn) {
    setTimeBtn.addEventListener('click', setCustomTime);
}

if (timeInput) {
    timeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            setCustomTime();
        }
    });
    
    // Format input as user types (optional enhancement)
    timeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d:]/g, ''); // Only allow digits and colons
        e.target.value = value;
    });
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    loadImages(); // Try to load actual images
    
    console.log('Photo Timer initialized!');
    console.log('To use your own images, place them in the same folder as your HTML file.');
    console.log('Name them: img1.jpeg, img2.jpeg, img3.jpeg, etc. (up to img13.jpeg)');
});
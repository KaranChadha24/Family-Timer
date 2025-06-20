let totalTime = 10 * 60; // 10 minutes
let timeLeft = totalTime;
let timerInterval = null;
const timerDisplay = document.querySelector('.timer');

function updateTimerDisplay() {
  const hrs = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  timerDisplay.textContent = `${hrs}:${mins}:${secs}`;
}

function showTimeUpPopup() {
  const popup = document.createElement('div');
  popup.className = 'popup-box';
  popup.innerHTML = `
    <div class="popup-content">
      <p>⏰ Time's up!</p>
      <button id="popup-ok">OK</button>
      <button id="popup-repeat">Repeat Timer</button>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById('popup-ok').addEventListener('click', () => {
    document.body.removeChild(popup);
  });

  document.getElementById('popup-repeat').addEventListener('click', () => {
    restartTimer();
    startTimer();
    document.body.removeChild(popup);
  });
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
        showTimeUpPopup();
      }
    }, 1000);
  }
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function restartTimer() {
  pauseTimer();
  timeLeft = totalTime;
  updateTimerDisplay();
}

function deleteTimer() {
  pauseTimer();
  timeLeft = 0;
  updateTimerDisplay();
}

// Allow user to set timer via input
const setTimeBtn = document.getElementById('setTimeBtn');
if (setTimeBtn) {
  setTimeBtn.addEventListener('click', () => {
    const input = document.getElementById('timeInput').value;
    const parts = input.split(':').map(Number);
    if (parts.length === 3 && parts.every(n => !isNaN(n))) {
      const [hrs, mins, secs] = parts;
      totalTime = hrs * 3600 + mins * 60 + secs;
      timeLeft = totalTime;
      updateTimerDisplay();
    } else {
      alert("Invalid format. Use HH:MM:SS");
    }
  });
}

// Attach event listeners
document.getElementById('btn1').addEventListener('click', deleteTimer); // Trash/Delete
document.getElementById('btn2').addEventListener('click', startTimer); // Play
document.getElementById('btn3').addEventListener('click', pauseTimer); // Pause
document.getElementById('btn4').addEventListener('click', restartTimer); // Restart

// Initialize display
updateTimerDisplay();
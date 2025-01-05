// Script for Countdown Timer Website

// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const timerTypeSelect = document.getElementById("timer-type");
const countdownSection = document.getElementById("countdown-timer");
const pomodoroSection = document.getElementById("pomodoro-timer");
const startCountdownButton = document.getElementById("start-countdown");
const eventNameInput = document.getElementById("event-name");
const eventTimeInput = document.getElementById("event-time");
const countdownDisplay = document.getElementById("countdown-display");
const pomodoroStartButton = document.getElementById("start-pomodoro");
const pomodoroStatus = document.getElementById("pomodoro-status");
const pomodoroTime = document.getElementById("pomodoro-time");
const workDurationInput = document.getElementById("work-duration");
const breakDurationInput = document.getElementById("break-duration");
const generateLinkButton = document.getElementById("generate-link");
const shareableLinkInput = document.getElementById("shareable-link");
const newTaskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const copyLinkButton = document.getElementById("copy-link");
const copyFeedback = document.getElementById("copy-feedback");

// Global Variables
let countdownInterval;
let pomodoroInterval;
let isDarkMode = false;

// Theme Toggle
function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    themeToggle.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

// Load Saved Theme
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        isDarkMode = true;
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "Switch to Light Mode";
    }
}

// Timer Type Switch
function switchTimerType() {
    const selectedType = timerTypeSelect.value;
    countdownSection.style.display = selectedType === "countdown" ? "block" : "none";
    pomodoroSection.style.display = selectedType === "pomodoro" ? "block" : "none";
}

// Countdown Timer
function startCountdown() {
    clearInterval(countdownInterval);

    const eventName = eventNameInput.value.trim();
    const eventTime = new Date(eventTimeInput.value);

    if (!eventName || isNaN(eventTime.getTime())) {
        alert("Please provide a valid event name and time.");
        return;
    }

    countdownDisplay.querySelector("#countdown-event").textContent = `Event: ${eventName}`;

    countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = eventTime - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            alert(`${eventName} has arrived!`);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownDisplay.querySelector("#days").textContent = days;
        countdownDisplay.querySelector("#hours").textContent = hours;
        countdownDisplay.querySelector("#minutes").textContent = minutes;
        countdownDisplay.querySelector("#seconds").textContent = seconds;
    }, 1000);
}

// Pomodoro Timer
function startPomodoro() {
    clearInterval(pomodoroInterval);

    const workDuration = parseInt(workDurationInput.value) * 60;
    const breakDuration = parseInt(breakDurationInput.value) * 60;
    let isWorkTime = true;
    let timeLeft = workDuration;

    pomodoroInterval = setInterval(() => {
        if (timeLeft <= 0) {
            isWorkTime = !isWorkTime;
            timeLeft = isWorkTime ? workDuration : breakDuration;
            pomodoroStatus.textContent = isWorkTime ? "Work Time" : "Break Time";
            alert(isWorkTime ? "Back to work!" : "Take a break!");
        }

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        pomodoroTime.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        timeLeft--;
    }, 1000);
}

// Generate Shareable Link
function generateShareableLink() {
    const eventName = eventNameInput.value.trim();
    const eventTime = eventTimeInput.value;

    if (!eventName || !eventTime) {
        alert("Please provide an event name and time.");
        return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("event", eventName);
    url.searchParams.set("date", eventTime);
    shareableLinkInput.value = url.toString();
}

// Copy to Clipboard
function copyToClipboard() {
    if (shareableLinkInput.value) {
        navigator.clipboard.writeText(shareableLinkInput.value).then(() => {
            copyFeedback.style.display = "inline";
            setTimeout(() => {
                copyFeedback.style.display = "none";
            }, 2000);
        }).catch((err) => {
            console.error("Failed to copy link:", err);
        });
    } else {
        alert("No link available to copy. Generate a link first.");
    }
}

// To-Do List
function addTask() {
    const taskText = newTaskInput.value.trim();
    if (!taskText) return;

    const li = document.createElement("li");
    li.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => li.remove();

    li.appendChild(deleteButton);
    taskList.appendChild(li);
    newTaskInput.value = "";
}

// Load Timer from URL
function loadTimerFromURL() {
    const params = new URLSearchParams(window.location.search);
    const eventName = params.get("event");
    const eventTime = params.get("date");

    if (eventName && eventTime) {
        eventNameInput.value = eventName;
        eventTimeInput.value = eventTime;
        startCountdown();
    }
}

// Event Listeners
themeToggle.addEventListener("click", toggleTheme);
timerTypeSelect.addEventListener("change", switchTimerType);
startCountdownButton.addEventListener("click", startCountdown);
pomodoroStartButton.addEventListener("click", startPomodoro);
generateLinkButton.addEventListener("click", generateShareableLink);
copyLinkButton.addEventListener("click", copyToClipboard);
addTaskButton.addEventListener("click", addTask);

// Initialize
loadTheme();
loadTimerFromURL();

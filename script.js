document.addEventListener("DOMContentLoaded", () => {
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

  // Global Variables
  let countdownInterval;
  let pomodoroInterval;
  let isDarkMode = false;

  /**
   * Display a temporary toast notification.
   * @param {string} message - The message to display.
   * @param {number} [duration=2000] - Duration in milliseconds.
   */
  const showNotification = (message, duration = 2000) => {
    const notification = document.createElement("div");
    notification.className = "toast-notification";
    notification.textContent = message;
    // Add ARIA role for screen readers
    notification.setAttribute("role", "alert");
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, duration);
  };

  // Theme Toggle Functionality
  const toggleTheme = () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode", isDarkMode);
    themeToggle.textContent = isDarkMode
      ? "Switch to Light Mode"
      : "Switch to Dark Mode";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  };

  // Load Saved Theme from localStorage
  const loadTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      isDarkMode = true;
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "Switch to Light Mode";
    }
  };

  // Switch Timer Type (Countdown vs. Pomodoro)
  const switchTimerType = () => {
    const selectedType = timerTypeSelect.value;
    if (selectedType === "countdown") {
      countdownSection.style.display = "block";
      pomodoroSection.style.display = "none";
    } else if (selectedType === "pomodoro") {
      countdownSection.style.display = "none";
      pomodoroSection.style.display = "block";
    }
  };

  // Countdown Timer Functionality
  const startCountdown = () => {
    clearInterval(countdownInterval);

    const eventName = eventNameInput.value.trim();
    const eventTimeValue = eventTimeInput.value;
    const eventTime = new Date(eventTimeValue);

    if (!eventName || !eventTimeValue || isNaN(eventTime.getTime())) {
      showNotification("Please provide a valid event name and time.");
      return;
    }

    countdownDisplay.querySelector("#countdown-event").textContent = `Event: ${eventName}`;

    countdownInterval = setInterval(() => {
      const now = new Date();
      const diff = eventTime - now;

      if (diff <= 0) {
        clearInterval(countdownInterval);
        showNotification(`${eventName} has arrived!`);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownDisplay.querySelector("#days").textContent = days
        .toString()
        .padStart(2, "0");
      countdownDisplay.querySelector("#hours").textContent = hours
        .toString()
        .padStart(2, "0");
      countdownDisplay.querySelector("#minutes").textContent = minutes
        .toString()
        .padStart(2, "0");
      countdownDisplay.querySelector("#seconds").textContent = seconds
        .toString()
        .padStart(2, "0");
    }, 1000);
  };

  // Pomodoro Timer Functionality
  const startPomodoro = () => {
    clearInterval(pomodoroInterval);

    const workDuration = parseInt(workDurationInput.value, 10) * 60;
    const breakDuration = parseInt(breakDurationInput.value, 10) * 60;

    if (isNaN(workDuration) || isNaN(breakDuration)) {
      showNotification("Please provide valid durations for work and break.");
      return;
    }

    let isWorkTime = true;
    let timeLeft = workDuration;
    pomodoroStatus.textContent = "Work Time";

    pomodoroInterval = setInterval(() => {
      if (timeLeft <= 0) {
        isWorkTime = !isWorkTime;
        timeLeft = isWorkTime ? workDuration : breakDuration;
        pomodoroStatus.textContent = isWorkTime
          ? "Work Time"
          : "Break Time";
        showNotification(
          isWorkTime ? "Back to work!" : "Take a break!"
        );
      }

      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      pomodoroTime.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      timeLeft--;
    }, 1000);
  };

  // Generate Shareable Link Functionality
  const generateShareableLink = () => {
    const eventName = eventNameInput.value.trim();
    const eventTime = eventTimeInput.value;

    if (!eventName || !eventTime) {
      showNotification("Please provide an event name and time.");
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set("event", eventName);
    url.searchParams.set("date", eventTime);
    shareableLinkInput.value = url.toString();
    showNotification("Shareable link generated!");
  };

  // Load Timer from URL Parameters (if available)
  const loadTimerFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const eventName = params.get("event");
    const eventTime = params.get("date");

    if (eventName && eventTime) {
      eventNameInput.value = eventName;
      eventTimeInput.value = eventTime;
      startCountdown();
    }
  };

  // To-Do List: Save tasks to localStorage
  const saveTasks = () => {
    const tasks = [];
    taskList.querySelectorAll("li").forEach((li) => {
      tasks.push(li.firstChild.textContent);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  // To-Do List: Load tasks from localStorage
  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((taskText) => {
      addTaskElement(taskText);
    });
  };

  // Create a new task element and add it to the list
  const addTaskElement = (taskText) => {
    const li = document.createElement("li");
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;
    li.appendChild(taskSpan);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.addEventListener("click", () => {
      li.remove();
      saveTasks();
    });
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  };

  // Add a new task from the input field
  const addTask = () => {
    const taskText = newTaskInput.value.trim();
    if (!taskText) {
      showNotification("Please enter a valid task before adding.");
      return;
    }
    addTaskElement(taskText);
    newTaskInput.value = "";
    saveTasks();
    newTaskInput.focus(); // Refocus on the input for convenience
  };

  // Copy shareable link to clipboard
  const copyToClipboard = () => {
    if (shareableLinkInput.value) {
      navigator.clipboard
        .writeText(shareableLinkInput.value)
        .then(() => {
          const feedback = document.getElementById("copy-feedback");
          feedback.style.display = "inline";
          setTimeout(() => {
            feedback.style.display = "none";
          }, 2000);
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
          showNotification("Failed to copy link.");
        });
    } else {
      showNotification("No link available to copy. Generate a link first.");
    }
  };

  // Event Listeners
  themeToggle.addEventListener("click", toggleTheme);
  timerTypeSelect.addEventListener("change", switchTimerType);
  startCountdownButton.addEventListener("click", startCountdown);
  pomodoroStartButton.addEventListener("click", startPomodoro);
  generateLinkButton.addEventListener("click", generateShareableLink);
  addTaskButton.addEventListener("click", addTask);
  document.getElementById("copy-link").addEventListener("click", copyToClipboard);

  // Initialize Application
  loadTheme();
  loadTimerFromURL();
  loadTasks();
});

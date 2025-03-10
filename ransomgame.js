// Import constants
import {
  QUESTIONS,
  XC_TOKEN,
  USER_TABLE_ID,
  LEADERBOARD_TABLE_ID,
} from "./constants.js";

// Game state variables
let currentStage = 0;
let score = 0;
let timeLeft = 180;
let countdown;
let startTime;
let endTime;
let takenMinutes;
let takenSeconds;

// DOM elements
let container = document.getElementsByClassName("container")[0];
const chatPanel = document.getElementsByClassName("chat-panel")[0];
const chatBox = document.getElementById("chatBox");
const choicesElement = document.getElementById("choices");
const scoreDisplay = document.getElementById("scoreDisplay");
const timeRemainingElement = document.getElementById("timeRemaining");
const hackedScreenElement = document.getElementById("hackedScreen");
const endMessageElement = document.getElementById("endMessage");
const failedMessageElement = document.getElementById("failedMessage");

// Game functions
function startChallenge() {
  let userID = localStorage.getItem("loggedInUserID");

  if (!userID) {
    alert("Please log in to play the game.");
    window.location.href = "login.html";
    return;
  }

  // Add a style property to id = disclaimer to hide it
  document.getElementById("disclaimer").style.display = "none";

  let todaysDate = new Date().toISOString().split("T")[0];
  let [year, month, day] = todaysDate.split("-");
  let formattedTodaysDate = `${day}-${month}-${year}`;

  let apiUrl = `https://app.nocodb.com/api/v2/tables/${LEADERBOARD_TABLE_ID}/records?offset=0&limit=10&where=(UserID,eq,${userID})~and(Date,eq,${formattedTodaysDate})&viewId=vwtanjh1wqnn2y29&sort=-Score`;

  $.ajax({
    url: apiUrl,
    method: "GET",
    headers: {
      "xc-token": XC_TOKEN,
    },
    success: function (response) {
      if (response.list.length > 0) {
        alert("You have already played today. Please try again tomorrow!");
      } else {
        currentStage = 1;
        score = 0;
        timeLeft = 180;
        updateScore();
        startTimer();
        nextStage();
        startTime = new Date();
      }
    },
    error: function (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred. Please try again later.");
    },
  });
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function startTimer() {
  countdown = setInterval(() => {
    timeLeft--;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    if (timeLeft < 60) {
      timeRemainingElement.style.color = "red";
    } else {
      timeRemainingElement.style.color = "";
    }

    timeRemainingElement.innerText = `Time: ${timeString}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      showScaryScreen();
    }
  }, 1000);
}

function typeMessage(element, text, speed = 30, callback) {
  let i = 0;
  element.innerHTML = "";
  const interval = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      scrollToBottom();
    } else {
      clearInterval(interval);
      scrollToBottom();
      if (callback) callback();
    }
  }, speed);
}

function scrollToBottom() {
  // Check if chatBox has enough height to scroll
  if (chatBox.scrollHeight > chatBox.clientHeight) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function makeChoice(choice) {
  const question = QUESTIONS[currentStage - 1];
  const choiceText = question.options[choice];

  const youMessage = document.createElement("div");
  youMessage.className = "message you";
  youMessage.innerHTML = `<div class="message-content">You: ${choiceText}</div>`;
  chatBox.appendChild(youMessage);
  scrollToBottom();

  const isCorrect = choice === question.answer;
  let feedbackText = "";

  if (isCorrect) {
    score += 10; // Add points for correct answer
    updateScore();
    feedbackText = "Correct! Good decision.";
  } else {
    timeLeft -= 10; // Deduct time for incorrect answer
    score = Math.max(0, score - 5); // Prevent score from going negative
    updateScore();
    feedbackText = "Incorrect. This approach may lead to complications.";
  }

  const feedbackMessage = document.createElement("div");
  feedbackMessage.className = "message it-security";
  feedbackMessage.innerHTML = `<div class="message-content">IT Security: ${feedbackText}</div>`;
  chatBox.appendChild(feedbackMessage);
  scrollToBottom();

  if (isCorrect) {
    currentStage++;
    if (currentStage <= QUESTIONS.length) {
      setTimeout(nextStage, 1500);
    } else {
      endGame(true);
    }
  } else if (timeLeft <= 0) {
    showScaryScreen();
  }
}

function disableChoiceButtons() {
  const buttons = choicesElement.querySelectorAll(".choice-button");
  buttons.forEach((button) => {
    button.disabled = true;
    button.style.opacity = "0.5";
    button.style.cursor = "not-allowed";
    button.title = "Wait for the question to complete";
  });
}

function enableChoiceButtons() {
  const buttons = choicesElement.querySelectorAll(".choice-button");
  buttons.forEach((button) => {
    button.disabled = false;
    button.style.opacity = "1";
    button.style.cursor = "pointer";
    button.title = "Click to select this option";
  });
}

function nextStage() {
  if (currentStage > QUESTIONS.length) {
    endGame(true);
    return;
  }

  const question = QUESTIONS[currentStage - 1];
  let choicesHTML = question.options
    .map(
      (option, index) => `
    <button class="choice-button" data-choice="${index}" disabled title="Wait for the question to complete">${option}</button>
  `
    )
    .join("");

  const managerMessage = document.createElement("div");
  managerMessage.className = "message it-security";
  managerMessage.innerHTML = `<div class="message-content"></div>`;
  chatBox.appendChild(managerMessage);

  choicesElement.innerHTML = choicesHTML;
  disableChoiceButtons();

  typeMessage(
    managerMessage.querySelector(".message-content"),
    `IT Security: ${question.question}`,
    30,
    enableChoiceButtons
  );

  scrollToBottom();
}

function showScaryScreen() {
  window.location.href = "hacked.html";
}

async function saveScoreInDB() {
  let scoreText = $("#scoreDisplay").text();
  let score = scoreText.replace("Score: ", "");

  if (!endTime) {
    console.error("endTime is not defined");
    return;
  }

  let timeTaken = Math.floor((endTime - startTime) / 1000);
  takenSeconds = timeTaken;
  takenMinutes = Math.floor(timeTaken / 60);
  let userID = localStorage.getItem("loggedInUserID");
  let userName = localStorage.getItem("loggedInUser");

  if (!userID || !userName) {
    console.error("User ID or User Name is missing from localStorage");
    return;
  }

  let todaysDate = new Date().toISOString().split("T")[0];
  let [year, month, day] = todaysDate.split("-");
  let formattedTodaysDate = `${day}-${month}-${year}`;

  let data = {
    UserID: userID,
    UserName: userName,
    Date: formattedTodaysDate,
    Score: score,
    TimeTaken: timeTaken,
  };

  try {
    let response = await $.ajax({
      url: `https://app.nocodb.com/api/v2/tables/${LEADERBOARD_TABLE_ID}/records`,
      type: "POST",
      headers: {
        "xc-token": XC_TOKEN,
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
    });
    console.log("Data saved successfully:", response);
  } catch (error) {
    console.error("Error saving data:", error);
    if (error.responseJSON) {
      console.error("Server response:", error.responseJSON);
    }
  }
}

async function endGame(success) {
  clearInterval(countdown);
  choicesElement.style.display = "none";
  endTime = new Date();
  if (success) {
    let userIDLoggedIn = localStorage.getItem("loggedInUserID");
    let userNameLoggedIn = localStorage.getItem("loggedInUser");

    if (userIDLoggedIn) {
      await saveScoreInDB();
    }

    window.location.href = `cong.html?name=${encodeURIComponent(
      userNameLoggedIn
    )}&score=${score}&time=${takenSeconds}`;
  } else {
    failedMessageElement.innerHTML = `Game Over: The attack caused irreparable damage.<br><br>Your final score is ${score}.`;
    failedMessageElement.style.display = "block";
  }
  scrollToBottom();
}

function resetGame() {
  currentStage = 0;
  score = 0;
  timeLeft = 180;
  updateScore();
  clearInterval(countdown);
  timeRemainingElement.innerText = "Time: 3:00";
  timeRemainingElement.style.color = "";
  chatBox.innerHTML = `
    <div class="message it-security">
        <div class="message-content">
            <strong>Welcome to the Ransomware Resilience Challenge!</strong><br><br>
          <div id="disclaimer">  Get ready to test your skills in a high-stakes scenario-based Q&A game.<br/>  Here's how it works:<br>
            • <strong>Duration:</strong> You have 3 minutes to complete the challenge.<br>
            • <strong>Gameplay:</strong> Respond to each question in the chatbot interface.<br>
            • <strong>Correct Answer:</strong> If you select the correct answer, you will automatically proceed to the next question.<br>
            • <strong>Incorrect Answer:</strong> Choosing an incorrect answer will deduct 10 seconds from your remaining time and 5 points from your score, but you'll get another chance to pick the right answer.<br>
            • <strong>Objective:</strong> Solve all questions correctly within the allotted time to get your name on the leaderboard.<br><br>
            Press <strong>Start</strong> to begin your challenge. Good luck! </div>
        </div>
    </div>
`;

  hackedScreenElement.style.display = "none";
  failedMessageElement.style.display = "none";
  scrollToBottom();
}

function toggleMenu() {
  var navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");

  var menuButton = document.querySelector(".menu-button");
  var isExpanded = navLinks.classList.contains("show");
  menuButton.setAttribute("aria-expanded", isExpanded);
}

function closeEndMessage() {
  document.getElementById("endMessage").style.display = "none";
}

function redirectToHackedPage() {
  window.location.href = "hacked.html";
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("startButton")
    .addEventListener("click", startChallenge);
  document.getElementById("resetButton").addEventListener("click", resetGame);
  document.getElementById("menuButton").addEventListener("click", toggleMenu);

  choicesElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("choice-button")) {
      const choice = parseInt(event.target.getAttribute("data-choice"));
      makeChoice(choice);
    }
  });

  // Initialize the game
  resetGame();
});

// Export functions that need to be accessed from HTML
window.startChallenge = startChallenge;
window.resetGame = resetGame;
window.toggleMenu = toggleMenu;
window.closeEndMessage = closeEndMessage;
window.redirectToHackedPage = redirectToHackedPage;

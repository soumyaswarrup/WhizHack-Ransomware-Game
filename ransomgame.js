//Import constant.js
import {
  QUESTIONS,
  XC_TOKEN,
  USER_TABLE_ID,
  LEADERBOARD_TABLE_ID,
} from "./constants.js";

let currentStage = 0;
let score = 0;
let timeLeft = 120;
const chatBox = document.getElementById("chatBox");
const choicesElement = document.getElementById("choices");
const scoreDisplay = document.getElementById("scoreDisplay");
const timeRemainingElement = document.getElementById("timeRemaining");
const hackedScreenElement = document.getElementById("hackedScreen");
const endMessageElement = document.getElementById("endMessage");
const failedMessageElement = document.getElementById("failedMessage");
let countdown;
let startTime;
let endTime;
let takenMinutes;
let takenSeconds;

function startChallenge() {
  let userID = localStorage.getItem("loggedInUserID");

  if (!userID) {
    alert("Please log in to play the game.");
    return;
  }

  let todaysDate = new Date().toISOString().split("T")[0];
  let [year, month, day] = todaysDate.split("-");
  let formattedTodaysDate = `${day}-${month}-${year}`;

  let apiUrl = `https://app.nocodb.com/api/v2/tables/${USER_TABLE_ID}/records?offset=0&limit=10&where=(UserID,eq,${userID})~and(Date,eq,${formattedTodaysDate})&viewId=vwtanjh1wqnn2y29&sort=-Score`;

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
        timeLeft = 120;
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

    // Check if time is below 60 seconds
    if (timeLeft < 60) {
      timeRemainingElement.style.color = "red";
    } else {
      timeRemainingElement.style.color = ""; // Reset to default color
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
  chatBox.scrollTop = chatBox.scrollHeight;
}

// function makeChoice(choice) {
//   const choiceText = choicesElement.querySelector(
//     `button[onclick="makeChoice('${choice}')"]`
//   ).innerText;

//   const youMessage = document.createElement("div");
//   youMessage.className = "message you";
//   youMessage.innerHTML = `<div class="message-content">You: ${choiceText}</div>`;
//   chatBox.appendChild(youMessage);
//   scrollToBottom();

//   let isCorrect = false;
//   let feedbackText = "";

//   switch (currentStage) {
//     case 1:
//       isCorrect = choice === "B";
//       feedbackText = isCorrect
//         ? "Correct! You've identified the source of the breach."
//         : "Incorrect. The issue escalates.";
//       break;
//     case 2:
//       isCorrect = choice === "A";
//       feedbackText = isCorrect
//         ? "Correct! You've limited the spread and secured core systems."
//         : "Incorrect. The attack spreads further.";
//       break;
//     case 3:
//       isCorrect = choice === "B";
//       feedbackText = isCorrect
//         ? "Correct! Your statement reassures the public while maintaining control over information."
//         : "Incorrect. The public panics or loses trust.";
//       break;
//     case 4:
//       isCorrect = choice === "A";
//       feedbackText = isCorrect
//         ? "Correct! Restoring from secure backups is a safe approach."
//         : "Incorrect. This approach risks further complications.";
//       break;
//     case 5:
//       isCorrect = choice === "C";
//       feedbackText = isCorrect
//         ? "Correct! A comprehensive overhaul addresses immediate and long-term security needs."
//         : "Incorrect. This approach may leave vulnerabilities.";
//       break;
//     case 6:
//       isCorrect = choice === "B";
//       feedbackText = isCorrect
//         ? "Correct! Regular, transparent updates maintain stakeholder trust."
//         : "Incorrect. This approach may damage relationships.";
//       break;
//     case 7:
//       isCorrect = choice === "A";
//       feedbackText = isCorrect
//         ? "Correct! Swift action prevents further damage."
//         : "Incorrect. Delayed response allows the threat to persist.";
//       break;
//     case 8:
//       isCorrect = choice === "C";
//       feedbackText = isCorrect
//         ? "Correct! Using uncompromised backups is the safest recovery method."
//         : "Incorrect. This approach risks further complications.";
//       break;
//     case 9:
//       isCorrect = choice === "C";
//       feedbackText = isCorrect
//         ? "Correct! Direct engagement reassures stakeholders and rebuilds trust."
//         : "Incorrect. This approach may leave stakeholders uncertain.";
//       break;
//     case 10:
//       isCorrect = choice === "B";
//       feedbackText = isCorrect
//         ? "Correct! Continuous improvement in cybersecurity is crucial for long-term protection."
//         : "Incorrect. This approach may leave the organization vulnerable in the future.";
//       break;
//   }

//   if (isCorrect) {
//     score += 10;
//     updateScore();
//   } else {
//     timeLeft -= 10;
//   }

//   const feedbackMessage = document.createElement("div");
//   feedbackMessage.className = "message it-security";
//   feedbackMessage.innerHTML = `<div class="message-content">IT Security: ${feedbackText}</div>`;
//   chatBox.appendChild(feedbackMessage);
//   scrollToBottom();

//   if (isCorrect) {
//     currentStage++;
//     if (currentStage <= 10) {
//       setTimeout(nextStage, 1500);
//     } else {
//       endGame(true);
//     }
//   } else if (timeLeft <= 0) {
//     showScaryScreen();
//   }
// }

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
    score += 10;
    updateScore();
    feedbackText = "Correct! Good decision.";
  } else {
    timeLeft -= 10;
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

// function nextStage() {
//   let nextScenarioText = "";
//   let choicesHTML = "";

//   switch (currentStage) {
//     case 1:
//       nextScenarioText =
//         "A major stock trading platform has been hit by a ransomware attack. What's our first step?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Wait and see if the system resolves the issue on its own.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Conduct an immediate audit to identify the source and scope of the breach.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Shut down all network access to prevent further spread.</button>`;
//       break;
//     case 2:
//       nextScenarioText =
//         "The audit points to a phishing attack as the entry vector. Multiple workstations are affected. How do we proceed?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Isolate affected systems and cut internet access to critical assets.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Engage with the attackers to buy time.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Immediately inform all employees via email about the breach.</button>`;
//       break;
//     case 3:
//       nextScenarioText =
//         "Investors are panicking, and the media is calling. We need a communication strategy. Your advice?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Release a detailed report of the incident to the media.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Prepare a controlled statement emphasizing the containment and resolution efforts.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Stay silent until more information is available.</button>`;
//       break;
//     case 4:
//       nextScenarioText =
//         "We've stabilized the system, but recovery is pending. How should we proceed with system restoration?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Begin system recovery using secure backups.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Attempt to decrypt affected files using available tools.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Negotiate with attackers for decryption keys.</button>`;
//       break;
//     case 5:
//       nextScenarioText =
//         "With the immediate crisis managed, we need to address future security. What should be our focus?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Enhance employee training on cybersecurity best practices.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Invest in advanced threat detection systems.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Implement a comprehensive security policy overhaul and incident response plan.</button>`;
//       break;
//     case 6:
//       nextScenarioText =
//         "Stakeholders are demanding updates. How do we manage ongoing communication?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Provide minimal updates to avoid potential legal issues.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Establish a regular schedule of transparent, detailed updates.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Defer all communication to legal team.</button>`;
//       break;
//     case 7:
//       nextScenarioText =
//         "We've detected attempts at a second wave of attacks. What's our immediate response?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Implement additional security measures and monitor closely.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Shut down all systems temporarily.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Conduct another round of employee training.</button>`;
//       break;
//     case 8:
//       nextScenarioText =
//         "Our backup systems were compromised. How do we approach data recovery?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Attempt to recover data from potentially infected backups.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Recreate lost data manually from other sources.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Utilize offsite, uncompromised backups for recovery.</button>`;
//       break;
//     case 9:
//       nextScenarioText =
//         "We need to rebuild trust with our stakeholders. What's the best approach?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Offer compensation for any losses incurred.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Publish a detailed post-mortem of the incident.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Host a series of town halls and Q&A sessions with key stakeholders.</button>`;
//       break;
//     case 10:
//       nextScenarioText =
//         "As we wrap up this incident, what's our strategy moving forward?";
//       choicesHTML = `
//                 <button class="choice-button" onclick="makeChoice('A')" disabled title="Wait for the question to complete">Focus on damage control and public relations.</button>
//                 <button class="choice-button" onclick="makeChoice('B')" disabled title="Wait for the question to complete">Implement a long-term cybersecurity improvement plan.</button>
//                 <button class="choice-button" onclick="makeChoice('C')" disabled title="Wait for the question to complete">Return to business as usual with minor security adjustments.</button>`;
//       break;
//   }

//   const managerMessage = document.createElement("div");
//   managerMessage.className = "message it-security";
//   managerMessage.innerHTML = `<div class="message-content"></div>`;
//   chatBox.appendChild(managerMessage);

//   choicesElement.innerHTML = choicesHTML;
//   disableChoiceButtons();

//   typeMessage(
//     managerMessage.querySelector(".message-content"),
//     `IT Security: ${nextScenarioText}`,
//     30,
//     enableChoiceButtons
//   );

//   scrollToBottom();
// }

function nextStage() {
  if (currentStage > QUESTIONS.length) {
    endGame(true);
    return;
  }

  const question = QUESTIONS[currentStage - 1];
  let choicesHTML = question.options
    .map(
      (option, index) => `
    <button class="choice-button" onclick="makeChoice(${index})" disabled title="Wait for the question to complete">${option}</button>
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
  console.log(timeTaken, takenMinutes, "timetaken.....");
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

  console.log("Attempting to save data:", data);

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

    // Redirect to the results page with name, score, and time
    window.location.href = `cong.html?name=${encodeURIComponent(
      userNameLoggedIn
    )}&score=${score}&time=${takenSeconds}`;
  } else {
    failedMessageElement.innerHTML = `Game Over: The attack caused irreparable damage.<br><br>Your final score is ${score}.<br><br>Remember, in a real ransomware situation, never pay the ransom and immediately contact cybersecurity professionals and law enforcement.`;
    failedMessageElement.style.display = "block";
  }
  scrollToBottom();
}

function resetGame() {
  currentStage = 0;
  score = 0;
  timeLeft = 120;
  updateScore();
  clearInterval(countdown);
  timeRemainingElement.innerText = "Time: 2:00";
  timeRemainingElement.style.color = ""; // Reset to default color
  chatBox.innerHTML =
    '<div class="message it-security"><div class="message-content">Welcome to the AI Security Challenge. Click \'Start the challenge\' to begin.</div></div>';
  choicesElement.innerHTML = "";
  hackedScreenElement.style.display = "none";
  failedMessageElement.style.display = "none";
  scrollToBottom();
}

// Disclaimer
alert(
  "This is a simulation for educational purposes only. In a real ransomware situation, never pay the ransom and immediately contact cybersecurity professionals and law enforcement."
);

function checkLoggedInUser() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const loggedInUserID = localStorage.getItem("loggedInUserID");

  if (loggedInUser && loggedInUserID) {
    document.getElementById("userInfo").textContent = `Hello ${loggedInUser}`;
    document.querySelector(".dropdown-content").style.display = "block";
  } else {
    document.getElementById("userInfo").textContent = "Please log in to play";
    document.querySelector(".dropdown-content").style.display = "none";
  }
}

function login(username, userID) {
  localStorage.setItem("loggedInUser", username);
  localStorage.setItem("loggedInUserID", userID);
  checkLoggedInUser();
}

function logout() {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("loggedInUserID");
  checkLoggedInUser();
  // Redirect to login page or show login form
  // For example: window.location.href = 'login.html';
}

// Event listeners
document
  .getElementById("startButton")
  .addEventListener("click", startChallenge);
document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("logoutLink").addEventListener("click", function (e) {
  e.preventDefault();
  logout();
});

// Toggle dropdown on user info click
document.getElementById("userInfo").addEventListener("click", function () {
  var dropdownContent = document.querySelector(".dropdown-content");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
});

// Close dropdown when clicking outside
window.addEventListener("click", function (event) {
  if (!event.target.matches("#userInfo")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
});

// Initialize the game
resetGame();

// Call checkLoggedInUser when the page loads
window.onload = checkLoggedInUser;

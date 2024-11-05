import { QUESTIONS, XC_TOKEN, USER_TABLE_ID, LEADERBOARD_TABLE_ID } from "./constants.js";

$(document).ready(function () {
  var gameModule = (function () {
    var isValidEmail = function (email) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    var isValidCompanyEmail = function (email) {
      var companyEmailRegex = /^[^\s@]+@(?!gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)[^\s@]+\.[^\s@]+$/;
      return companyEmailRegex.test(email);
    };

    var playGame = function () {
      let email = $("#work-email").val();
      let name = $("#name").val();

      if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      if (!isValidCompanyEmail(email)) {
        alert("Please enter a valid company email address (no free email providers).");
        return;
      }

      $.ajax({
        url: `https://app.nocodb.com/api/v2/tables/${USER_TABLE_ID}/records`,
        type: "POST",
        headers: {
          "xc-token": XC_TOKEN,
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          Name: name,
          Email: email,
        }),
        success: function (response) {
          localStorage.setItem("loggedInUser", name);
          localStorage.setItem("loggedInUserID", response.Id);
          window.location.href = document.location.origin + "/index.html";
        },
        error: function (response) {
          alert("Failed to start the game");
        },
      });
    };

    var addEventListener = function () {
      $("#play-game-form").submit(function (e) {
        e.preventDefault();
        playGame();
      });
    };

    var init = function () {
      addEventListener();
    };

    return {
      init: init,
    };
  })();

  gameModule.init();
});

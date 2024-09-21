import {
  QUESTIONS,
  XC_TOKEN,
  USER_TABLE_ID,
  LEADERBOARD_TABLE_ID,
} from "./constants.js";

$(document).ready(function () {
  var loginModule = (function () {
    var checkEmailExists = function (email) {
      return new Promise((resolve, reject) => {
        $.ajax({
          url:
            `https://app.nocodb.com/api/v2/tables/${USER_TABLE_ID}/records?where=(Email%2Ceq%2C` +
            email +
            ")",
          type: "GET",
          headers: {
            "xc-token": XC_TOKEN,
          },
          success: function (response) {
            resolve(response.list.length > 0);
          },
          error: function (error) {
            reject(error);
          },
        });
      });
    };

    var isValidEmail = function (email) {
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    var isValidCompanyEmail = function (email) {
      var companyEmailRegex =
        /^[^\s@]+@(?!gmail\.com|yahoo\.com|hotmail\.com|outlook\.com)[^\s@]+\.[^\s@]+$/;
      return companyEmailRegex.test(email);
    };

    var isValidSocialLink = function (url) {
      var urlRegex =
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+([/?].*)?$/;
      return urlRegex.test(url);
    };

    var signup = function () {
      let email = $("#signup-email").val();
      let name = $("#signup-name").val();
      let password = $("#signup-password").val();
      let country = $("#signup-country").val();
      let social = $("#signup-social").val();
      let profession = $("#signup-occupation").val();
      let company = $("#signup-company").val();

      if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Validate company email only if user is a working professional
      if (
        profession === "working-professional" &&
        !isValidCompanyEmail(email)
      ) {
        alert("Please enter a valid company email address.");
        return;
      }

      if (social && !isValidSocialLink(social)) {
        alert("Please enter a valid URL for your social link.");
        return;
      }

      checkEmailExists(email)
        .then((exists) => {
          if (exists) {
            alert("This email is already registered. Please sign in.");
          } else {
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
                Password: password,
                Country: country,
                SocialLink: social,
                Profession: profession,
                Company: company,
              }),
              success: function (response) {
                localStorage.setItem("loggedInUser", name);
                localStorage.setItem("loggedInUserID", response.Id);
                window.location.href = document.location.origin + "/index.html";
              },
              error: function (response) {
                alert("Signup failed");
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error checking email:", error);
          alert("An error occurred. Please try again.");
        });
    };

    var signin = function () {
      let email = $("#signin-email").val();
      let password = $("#signin-password").val();

      if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      console.log(email, password);
      try {
        $.ajax({
          url:
            `https://app.nocodb.com/api/v2/tables/${USER_TABLE_ID}/records?offset=0&limit=1&where=(Email%2Ceq%2C` +
            email +
            ")~and(Password%2Ceq%2C" +
            password +
            ")",
          type: "GET",
          headers: {
            "xc-token": XC_TOKEN,
          },
          success: function (response) {
            console.log(response);
            if (response.list.length > 0) {
              localStorage.setItem("loggedInUser", response.list[0].Name);
              localStorage.setItem("loggedInUserID", response.list[0].Id);
              window.location.href = document.location.origin + "/index.html";
            } else {
              alert("Login failed! Please check your credentials");
            }
          },
        });
      } catch (e) {
        alert("Login failed! Please check your credentials");
      }
    };

    var addEventListener = function () {
      $("#signup-form").submit(function (e) {
        e.preventDefault();
        signup();
      });
      $("#signin-form").submit(function (e) {
        e.preventDefault();
        signin();
      });

      $("#signup-occupation").change(function () {
        if ($(this).val() === "working-professional") {
          $("#signup-company-email").show();
          $("#signup-email").attr("placeholder", "Enter your company email");
        } else {
          $("#signup-company-email").hide();
          $("#signup-email").attr("placeholder", "Enter your email");
        }
      });
    };

    var init = function () {
      addEventListener();
      const loginText = document.querySelector(".title-text .login");
      const loginForm = document.querySelector("form.login");
      const loginBtn = document.querySelector("label.login");
      const signupBtn = document.querySelector("label.signup");
      const signupLink = document.querySelector("form .signup-link a");
      signupBtn.onclick = () => {
        loginForm.style.marginLeft = "-50%";
        loginText.style.marginLeft = "-50%";
      };
      loginBtn.onclick = () => {
        loginForm.style.marginLeft = "0%";
        loginText.style.marginLeft = "0%";
      };
      signupLink.onclick = () => {
        signupBtn.click();
        return false;
      };
    };

    return {
      init: init,
    };
  })();

  loginModule.init();
});

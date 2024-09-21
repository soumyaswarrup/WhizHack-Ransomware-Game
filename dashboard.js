var dashboardModule = (function () {
  var userID = localStorage.getItem("loggedInUserID");
  var user = localStorage.getItem("loggedInUser");
  var showUserDetails = function () {
    user = localStorage.getItem("loggedInUser");

    userID = localStorage.getItem("loggedInUserID");

    console.log(userID, user);

    if (user && userID) {
      console.log("User is logged in");
      $("#dashboard-name").text("Hello " + user);
    }
  };

  var logoutUser = function () {
    //Clear the localstorage
    if (user && userID) {
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("loggedInUserID");
      window.location.href = document.location.origin + "/login.html";
    }
  };

  var addEventListener = function () {
    $("#dashboard-name").click(function () {
      logoutUser();
    });
  };
  var init = function () {
    showUserDetails();
    addEventListener();
  };
  return {
    init: init,
  };
})();

$(document).ready(function () {
  dashboardModule.init();
});

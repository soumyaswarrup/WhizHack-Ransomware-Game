var globalModule = (function () {
  var loggedInUser = null;
  var loggedInUserID = null;

  var init = function () {};
  return {
    init: init,
  };
})();

$(document).ready(function () {
  globalModule.init();
});

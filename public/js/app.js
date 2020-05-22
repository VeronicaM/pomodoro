// CSS
require("../css/app.scss");

import MainController from './main.controller';

$(() => {
  // request permission on page load
  window.onload = function onLoad() {
    $(document).ready(() => {
      const main = new MainController();
    });
  };
});

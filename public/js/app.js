// CSS
import MainController from './main.controller';

require('../css/app.scss');

test = 'this should not be here';
function injectFavIcon() {
  const favIco = require('../favicon.png'); // eslint-disable-line global-require
  const link = $('<link></link>');
  link[0].type = 'image/x-icon';
  link[0].rel = 'shortcut icon';
  link[0].href = favIco;
  $('head')[0].append(link[0]);
}

$(() => {
  // request permission on page load
  window.onload = function onLoad() {
    $(document).ready(() => {
      injectFavIcon();

      const main = new MainController(); // eslint-disable-line no-unused-vars
    });
  };
});

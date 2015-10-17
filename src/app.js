/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

var title = new UI.Card({
  title: 'PokePebble',
  banner: 'images/LogoPS.png',
  body: 'A Pebble client for Pokemon showdown. Press SELECT to begin.'
});

title.show();

// TODO: Log in

title.on('click', 'select', function (e) {
  var searching = new UI.Card();
  searching.title('Searching for an opponent.');
  searching.body('Press BACK to cancel.');
  searching.show();
  // TODO: Search for an opponent
  searching.on('click', 'back', function (e) {
    // TODO: cancel search
    title.show();
  });
});

/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var title = new UI.Card({
  title: 'PokePebble',
  banner: 'images/LogoPS.png',
  body: 'A Pebble client for Pokemon showdown. Press SELECT to begin.'
});

title.show();

// Login
var ws = new WebSocket("ws://159.203.89.223:8000/showdown/websocket");
var username;
var challstr;
var currRoom = null;
ws.onmessage = function (e) {
  // Parse message
  var message = e.data;
  console.log(message);
  if (currRoom) {
    // Parse battle messages
  } else {
    if (message[0] === '>') {
      currRoom = cmd.slice(1);
      return;
    }
    var args = message.split("|");
    var cmd = args[1];
    if (cmd === 'updateuser') {
      // Update username
      username = args[2];
      console.log("Username is", username);
    } else if (cmd === 'challstr') {
      // Get login information
      challstr = message.match(/\|challstr\|(.*)/)[1];
      console.log("Challstr is", challstr);
    }
  }
};

ws.onerror = function (error) {
  // Log error
  console.log("Error:", error);
};

title.on('click', 'back', function (e) {
  // Logout
  ws.close();
});

title.on('click', 'select', function (e) {
  var searching = new UI.Card();
  searching.title('Searching for an opponent.');
  searching.body('Press BACK to cancel.');
  searching.show();
  // Search for an opponent
  ws.send("|/search randombattle");
  console.log("Searching for a battle");
  searching.on('click', 'back', function (e) {
    // Cancel search
    ws.send("|/cancelsearch");
    console.log("Canceling search");
    title.show();
  });
});

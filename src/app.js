/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
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
var battleState = null;
ws.onmessage = function (e) {
  // Parse message
  var messages = e.data.split("\n");
  var args, cmd;
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    console.log(message);
    if (currRoom) {
      // Parse battle messages
      if (message.length !== 0 && message[0] === '>') {
        args = message.split('|');
        cmd = args[1];
        if (cmd === 'request') {
          // Update battle state
          battleState = JSON.parse(args[2]);
          // TODO: call update
        }
      }
    } else {
      if (message[0] === '>') {
        // Change to battle state and screen
        currRoom = message.slice(1);
        console.log("Current room is", currRoom);
        battleWind.show();
      } else {
        args = message.split("|");
        cmd = args[1];
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
    }
  }
};

ws.onerror = function (error) {
  // Log error
  console.log("Error:", error);
};

// TITLE SCREEN AND SEARCH SCREEN

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

// BATTLE SCREEN

var battleWind = new UI.Window({
  fullscreen: true
});
var drawBattleWind = function (state) {
  // TODO
};
var clearRect = new UI.Rect({
  size: new Vector2(144, 168)
});
battleWind.add(clearRect);
var infoRect = new UI.Rect({
  position: new Vector2(0, 144),
  size: new Vector2(144, 24),
  borderColor: 'black',
  backgroundColor: 'white'
});
battleWind.add(infoRect);

// BATTLE MENUS

// TODO: make attackMenu and switchMenu dynamic

var attackMenu = new UI.Menu({
  sections: [{
    title: 'Attack',
    items: [{
      title: 'Attack 1',
      subtitle: 'Some info'
    }, {
      title: 'Attack 2',
      subtitle: 'Some more info'
    }, {
      title: 'Attack 3',
      subtitle: 'Yet even more info'
    }]
  }]
});

var switchMenu = new UI.Menu({
  sections: [{
    title: 'Switch Pokemon',
    items: [{
      title: 'Pokemon 1',
      subtitle: 'Its condition'
    }, {
      title: 'Pokemon 2',
      subtitle: 'Second poke condition'
    }, {
      title: 'Pokemon 3',
      subtitle: 'Third poke'
    }, {
      title: 'Pokemon 4',
      subtitle: 'Fourth info'
    }]
  }]
});

var forfeitMenu = new UI.Menu({
  sections: [{
    title: 'Are you sure?',
    items: [{
      title: 'No',
      subtitle: "Don't forfeit"
    }, {
      title: 'Yes',
      subtitle: 'I QUIT!'
    }]
  }]
});

var battleMenu = new UI.Menu({
  sections: [{
    title: 'Options',
    items: [{
      title: 'Attack'
    }, {
      title: 'Switch'
    }, {
      title: 'Forfeit'
    }]
  }]
});

// BATTLE MENUS ACTIONS

battleMenu.on('click', 'back', function (e) {
  battleWind.show();
});
battleMenu.on('select', function (e) {
  switch (e.itemIndex) {
    case 0:
      attackMenu.show();
      break;
    case 1:
      switchMenu.show();
      break;
    case 2:
      forfeitMenu.show();
      break;
    default:
      console.log("Error occured on battle menu");
  }
});

attackMenu.on('click', 'back', function (e) {
  battleMenu.show();
});
attackMenu.on('select', function (e) {
  // TODO: send websocket attack
  console.log("Selected", e.itemIndex+1, "attack");
});

switchMenu.on('click', 'back', function (e) {
  battleMenu.show();
});
switchMenu.on('select', function (e) {
  // TODO: send websocket switch
  console.log("Switch to", e.itemIndex+2);
});

forfeitMenu.on('click', 'back', function (e) {
  battleMenu.show();
});
forfeitMenu.on('select', function (e) {
  switch (e.itemIndex) {
    case 0:
      battleMenu.show();
      break;
    case 1:
      // Forfeit :sadface:
      ws.send(currRoom + '|/forfeit');
      // TODO: handle forfeit
      currRoom = null;
      title.show();
  }
});

battleWind.on('click', 'select', function (e) {
  battleMenu.show();
});

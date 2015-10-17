/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Utils = require('utils');

// TITLE SCREEN

var title = new UI.Card({
  title: 'PokePebble',
  banner: 'images/LogoPS.png',
  body: 'A Pebble client for Pokemon showdown. Press SELECT to begin.'
});

title.show();

// BATTLE SCREEN

var battleWindMenu = new UI.Menu({
  sections: [{
    title: 'Opponent',
    items: [{
      title: 'OPPONENTPOKE',
      subtitle: '45%, L81, PAR'
    }]
  }, {
    title: 'You',
    items: [{
      title: 'YOURPOKEMON',
      subtitle: '92%, L69, F, BRN'
    }]
  }, {
    title: 'Action',
    items: [{
      title: 'The has started',
      subtitle: 'Press SELECT'
    }]
  }]
});
battleWindMenu.on('click', 'back', function (e) {});

// Login
var username;
var currRoom;

// TITLE SCREEN AND SEARCH SCREEN

title.on('click', 'back', function (e) {
  // Logout
  /*Pebble.sendAppMessage({ '0': 'logout' }, function (e) {
    console.log("Logout acknowledged");
  }, function (e) {
    console.log("Logout failed");
  });*/
});

title.on('click', 'select', function (e) {
  var searching = new UI.Card();
  searching.title('Searching for an opponent.');
  searching.body('Press BACK to cancel.');
  searching.show();
  // Search for an opponent
  Pebble.sendAppMessage({ '0': 1, '1': 1 }, function (e) {
    console.log("Searching for battle");
  }, function (e) {
    console.log("Failed to search for battle:", e.error.message);
  });
  searching.on('click', 'back', function (e) {
    // Cancel search
    Pebble.sendAppMessage({ '0': 1, '1': 0 }, function (e) {
      console.log("Canceled search");
      title.show();
    }, function (e) {
      console.log("Failed to cancel search:", e.error.message);
    });
  });
});

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
    }, {
      title: 'Attack 4',
      subtitle: 'info'
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
    }, {
      title: 'Pokemon 5',
      subtitle: 'Last poke'
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
  battleWindMenu.show();
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
  // Select attack
  Pebble.sendAppMessage({ '0': 2, '1': e.itemIndex+1 }, function () {
    console.log("Selected", e.itemIndex+1, "attack");
    battleMenu.show();
  }, function (err) {
    console.log("Failed to send attack", e.itemIndex+1, ":", err.error.message);
  });
});

switchMenu.on('click', 'back', function (e) {
  battleMenu.show();
});
switchMenu.on('select', function (e) {
  // Switch pokemon
  Pebble.sendAppMessage({ '0': 3, '1': e.itemIndex }, function () {
    console.log("Switch to", e.itemIndex+2);
  }, function (err) {
    console.log("Failed to switch to", e.itemIndex+2, ":", err.error.message);
  });
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
      Pebble.sendAppMessage({ '0': 4 }, function () {
        console.log("Forfeited!");
        currRoom = null;
        title.show();
      }, function (err) {
        console.log("Failed to forfeit:", err.error.message);
      });
      break;
    default:
      battleMenu.show();
      break;
  }
});

battleWindMenu.on('click', 'select', function (e) {
  battleMenu.show();
});

// PEBBLE EVENT LISTENERS

Pebble.addEventListener('ready', function (e) {
  // First retrieve login info
  Pebble.sendAppMessage({ '0': 0 }, function (e) {
    console.log("Login request received.");
  }, function (e) {
    console.log("Login request failed:", e.error.message);
  });
});

Pebble.addEventListener('appmessage', function (e) {
  var firstEl = JSON.parse(e.payload['0']);
  if (firstEl.login) {
    // Store login info
    username = firstEl.username;
  } else if (firstEl.startBattle) {
    // Store room info and render battle screen with first pokemon
    currRoom = firstEl.roomid;
    // TODO: render battle screen
  } else if (firstEl.turn) {
    // Update battle state
  }
});

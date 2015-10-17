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
var infoText = new UI.Text({
  text: "The battle has started. Press SELECT",
  font: 'gothic-14-bold',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(0, 144)
});
battleWind.add(infoText);
var textQueue = [];
var displayingText = false;
var displayText = function (msg) {
  if (msg) textQueue.push(msg);
  if (displayingText || textQueue.length === 0) return;
  displayingText = true;
  infoText.text = textQueue.shift();
  setTimeout(function () {
    displayingText = false;
    if (textQueue.length > 0) displayText();
  }, 1000);
};

// Login
var ws = new WebSocket("ws://159.203.89.223:8000/showdown/websocket");
var username;
var challstr;
var currRoom = null;
var battleState = null;
var currPoke = {};
var opponentPoke = {};
ws.onmessage = function (e) {
  // Parse message
  var messages = e.data.split("\n");
  var args, cmd;
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    console.log(message);
    
    if (currRoom) {
      // Parse battle messages
      if (message.length > 0 && message[0] !== '>') {
        args = message.split('|');
        cmd = args[1];
        if (cmd === 'request') {
          // Update battle state
          battleState = JSON.parse(args[2]);
        } else if (cmd === 'switch') {
          // Process pokemon switch
          var affectedPlayerNum = args[2].slice(0, 2);
          var switchInfo = args[3];
          var pokeInfo = Utils.parseSwitchInfo(switchInfo);
          var switchHP = args[4];
          var hp = Utils.parseHP(switchHP);
          if (affectedPlayerNum === battleState.side.id) {
            // Switch is yours
            currPoke = pokeInfo;
            currPoke.hp = hp;
          } else {
            // Switch is opponents
            opponentPoke = pokeInfo;
            opponentPoke.hp = hp;
          }
        } else if (cmd === 'detailschange') {
          // Process details change (e.g. mega evolution, forme change)
          var affectedPlayerNum = args[2].slice(0, 2);
          var switchInfo = args[3];
          var pokeInfo = Utils.parseSwitchInfo(switchInfo);
          var hp;
          if (affectedPlayerNum === battleState.side.id) {
            // Change is yours
            hp = currPoke.hp;
            currPoke = pokeInfo;
            currPoke.hp = hp;
          } else {
            // Change is opponents
            hp = opponentPoke.hp;
            opponentPoke = pokeInfo;
            opponentPoke.hp = hp;
          }
        } else if (cmd === 'cant') {
          // Process pokemon inability
          var affectedPlayerNum = args[2].slice(0, 2);
          var affectedPoke = args[2].slice(5);
          var reason = args[3];
          console.log(affectedPlayerNum, "'s", affectedPoke, "failed to move because of", reason);
          displayText(affectedPlayerNum + "'s " + affectedPoke + " failed to move because of " + reason);
        } else if (cmd === 'faint') {
          // Process pokemon faint
          var affectedPlayerNum = args[2].slice(0, 2);
          var affectedPoke = args[2].slice(5);
          console.log(affectedPlayerNum, "'s", affectedPoke, "fainted");
          displayText(affectedPlayerNum + "'s " + affectedPoke + " fainted");
        } else if (cmd === '-fail') {
          // Process action failure
        } else if (cmd === '-damage') {
          // Process damage
        } else if (cmd === '-heal') {
          // Process heal
        } else if (cmd === '-status') {
          // Process status
        } else if (cmd === '-curestatus') {
          // Process cure status
        } else if (cmd === '-cureteam') {
          // Process cure team
        } else if (cmd === '-boost') {
          // Process stat boost
        } else if (cmd === '-unboost') {
          // Process stat unboost
        } else if (cmd === '-weather') {
          // Process weather
        } else if (cmd === '-sidestart') {
          // Process hazards
        } else if (cmd === '-sideend') {
          // Process hazard removal
        } else if (cmd === '-crit') {
          // Process crit
        } else if (cmd === '-supereffective') {
          // Process super effective
        } else if (cmd === '-resisted') {
          // Process resisted
        } else if (cmd === '-immune') {
          // Process immune
        } else if (cmd === '-item') {
          // Process item change or revelation
        } else if (cmd === '-enditem') {
          // Process item use or destruction
        } else if (cmd === '-ability') {
          // Process ability activation or change
        } else if (cmd === '-endability') {
          // Process ability suppression
        } else if (cmd === '-mega') {
          // Process mega evolution
          var megaPoke = args[2];
          var megastone = args[3];
          console.log(megaPoke, "evolved using a ", megastone);
          displayText(megaPoke + " evolved using a " + megastone);
        } else if (cmd === '-activate') {
          // Process misc effect
        }
        
        // TODO: call update battle screen function
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
  ws.send(currRoom + '|/move ' + (e.itemIndex+1));
  battleMenu.show();
});

switchMenu.on('click', 'back', function (e) {
  battleMenu.show();
});
switchMenu.on('select', function (e) {
  // TODO: send websocket switch
  console.log("Switch to", e.itemIndex+2);
  ws.send(currRoom + '|/switch ' + (e.itemIndex+2));
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
      ws.send(currRoom + '|/leave');
      title.show();
      break;
    default:
      battleMenu.show();
      break;
  }
});

battleWind.on('click', 'select', function (e) {
  battleMenu.show();
});

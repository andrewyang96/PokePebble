/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

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

// TITLE SCREEN AND SEARCH SCREEN

title.on('click', 'back', function (e) {});

title.on('click', 'select', function (e) {
  var searching = new UI.Card();
  searching.title('Searching for an opponent.');
  searching.body('Press BACK to cancel.');
  searching.show();
  searching.on('click', 'select', function (e) {
    // Debug: move onto battle screen
    battleWindMenu.show();
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
});

switchMenu.on('click', 'back', function (e) {
  battleMenu.show();
});
switchMenu.on('select', function (e) {
  // Switch pokemon
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
      title.show();
      break;
    default:
      battleMenu.show();
      break;
  }
});

battleWindMenu.on('click', 'select', function (e) {
  battleMenu.show();
});

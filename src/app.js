/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');

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

var yourHP = new UI.Rect({
  size: new Vector2(52, 5),
  position: new Vector2(72, 120),
  borderColor: 'black',
  backgroundColor: 'white'
});
battleWind.add(yourHP);
var yourHPBar = new UI.Rect({
  size: new Vector2(50, 3),
  position: new Vector2(73, 121),
  borderColor: 'black',
  backgroundColor: 'black'
}); // TODO: make dynamic
battleWind.add(yourHPBar);
var yourPokeName = new UI.Text({
  text: "YOURPOKE",
  font: 'gothic-18-bold',
  color: 'black',
  textOverflow: 'ellipsis',
  textAlign: 'left',
  position: new Vector2(73, 81),
  size: new Vector2(50, 25)
});
battleWind.add(yourPokeName);
var yourPokeInfo = new UI.Text({
  text: "L69, M, BRN",
  font: 'gothic-14',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(73, 106),
  size: new Vector2(50, 15)
});
battleWind.add(yourPokeInfo);

var opponentHP = new UI.Rect({
  size: new Vector2(52, 5),
  position: new Vector2(20, 64),
  borderColor: 'black',
  backgroundColor: 'white'
});
battleWind.add(opponentHP);
var opponentHPBar = new UI.Rect({
  size: new Vector2(50, 3),
  position: new Vector2(21, 65),
  borderColor: 'black',
  backgroundColor: 'black'
});
battleWind.add(opponentHPBar);
var opponentPokeName = new UI.Text({
  text: "OPPONENT",
  font: 'gothic-18-bold',
  color: 'black',
  textOverflow: 'ellipsis',
  textAlign: 'left',
  position: new Vector2(20, 24),
  size: new Vector2(50, 25)
});
battleWind.add(opponentPokeName);
var opponentPokeInfo = new UI.Text({
  text: "L81, PAR",
  font: 'gothic-14',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(20, 49),
  size: new Vector2(50, 15)
});
battleWind.add(opponentPokeInfo);

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
  font: 'gothic-14',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(0, 144),
  size: new Vector2(144, 24)
});
battleWind.add(infoText);

// TITLE SCREEN AND SEARCH SCREEN

title.on('click', 'back', function (e) {});

title.on('click', 'select', function (e) {
  var searching = new UI.Card();
  searching.title('Searching for an opponent.');
  searching.body('Press BACK to cancel.');
  searching.show();
  searching.on('click', 'select', function (e) {
    // Debug: move onto battle screen
    battleWind.show();
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

battleWind.on('click', 'select', function (e) {
  battleMenu.show();
});

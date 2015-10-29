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
var clearRect = new UI.Rect({
  size: new Vector2(144, 168)
});
battleWind.add(clearRect);
var infoRect = new UI.Rect({
  position: new Vector2(0, 108),
  size: new Vector2(144, 60),
  borderColor: 'black',
  backgroundColor: 'white'
});

var yourPokemon = new UI.Image({
  position: new Vector2(4, 80),
  compositing: 'and',
  image: 'images/charizard-back.png'
});
battleWind.add(yourPokemon);
var opponentPokemon = new UI.Image({
  position: new Vector2(80, 4),
  compositing: 'and',
  image: 'images/umbreon-front.png'
});
battleWind.add(opponentPokemon);

var yourHP = new UI.Rect({
  size: new Vector2(52, 5),
  position: new Vector2(72, 100),
  borderColor: 'black',
  backgroundColor: 'white'
});
battleWind.add(yourHP);
var yourHPBar = new UI.Rect({
  size: new Vector2(50, 3),
  position: new Vector2(73, 101),
  borderColor: 'black',
  backgroundColor: 'black'
});
battleWind.add(yourHPBar);
var yourPokeName = new UI.Text({
  text: "CHARIZARD",
  font: 'gothic-14-bold',
  color: 'black',
  textOverflow: 'ellipsis',
  textAlign: 'left',
  position: new Vector2(72, 60),
  size: new Vector2(72, 15)
});
battleWind.add(yourPokeName);
var yourPokeInfo = new UI.Text({
  text: "L74, M",
  font: 'gothic-14',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(72, 80),
  size: new Vector2(50, 15)
});
battleWind.add(yourPokeInfo);

var opponentHP = new UI.Rect({
  size: new Vector2(52, 5),
  position: new Vector2(4, 44),
  borderColor: 'black',
  backgroundColor: 'white'
});
battleWind.add(opponentHP);
var opponentHPBar = new UI.Rect({
  size: new Vector2(50, 3),
  position: new Vector2(5, 45),
  borderColor: 'black',
  backgroundColor: 'black'
});
battleWind.add(opponentHPBar);
var opponentPokeName = new UI.Text({
  text: "UMBREON",
  font: 'gothic-14-bold',
  color: 'black',
  textOverflow: 'ellipsis',
  textAlign: 'left',
  position: new Vector2(4, 4),
  size: new Vector2(72, 15)
});
battleWind.add(opponentPokeName);
var opponentPokeInfo = new UI.Text({
  text: "L77, F",
  font: 'gothic-14',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(4, 24),
  size: new Vector2(50, 15)
});
battleWind.add(opponentPokeInfo);

battleWind.add(infoRect);
var infoText = new UI.Text({
  text: "The battle has started. Press SELECT to begin!",
  font: 'gothic-14',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'left',
  position: new Vector2(0, 108),
  size: new Vector2(144, 60)
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
    title: 'Attack',
    items: [{
      title: 'Fire Blast',
      subtitle: 'Fire, 110 BP, 85%, 6/8'
    }, {
      title: 'Ancient Power',
      subtitle: 'Rock, 60 BP, 100%, 7/8'
    }, {
      title: 'Solar Beam',
      subtitle: 'Grass, 120 BP, 100%, 16/16'
    }, {
      title: 'Roost',
      subtitle: 'Flying, 16/16'
    }]
  }, {
    title: 'Switch Pokemon',
    items: [{
      title: 'Wigglytuff',
      subtitle: 'Normal/Fairy, L81'
    }, {
      title: 'Machamp',
      subtitle: 'Fighting, L75'
    }, {
      title: 'Arbok',
      subtitle: 'Poison, L78'
    }, {
      title: 'Fearow',
      subtitle: 'Normal/Flying, L78'
    }, {
      title: 'Giratina',
      subtitle: 'Ghost/Dragon, L70'
    }]
  }, {
    title: 'Forfeit',
    items: [{
      title: 'Forfeit'
    }]
  }]
});

// BATTLE MENUS ACTIONS

battleMenu.on('click', 'back', function (e) {
  battleWind.show();
});
battleMenu.on('select', function (e) {
  switch (e.sectionIndex) {
    case 0: // Attack
      infoText.text("Charizard uses " + e.item.title);
      battleMenu.hide();
      break;
    case 1: // Switch
      infoText.text("Come back, Charizard! Go " + e.item.title + "!");
      battleMenu.hide();
      break;
    case 2: // Forfeit
      forfeitMenu.show();
      break;
    default:
      console.log("Error occured on battle menu");
  }
});

forfeitMenu.on('click', 'back', function (e) {
  forfeitMenu.hide();
});
forfeitMenu.on('select', function (e) {
  switch (e.itemIndex) {
    case 0:
      battleMenu.show();
      break;
    case 1:
      // Forfeit :sadface:
      forfeitMenu.hide();
      battleMenu.hide();
      battleWind.hide();
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
battleWind.on('click', 'back', function (e) {}); // Disable battleWind click back

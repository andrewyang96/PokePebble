var utils = {
  parseSwitchInfo: function (info) {
    var infoArgs = info.split(', ');
    return {
      pokemon: infoArgs[0],
      level: infoArgs[1],
      gender: infoArgs[2] || null
    };
  },
  parseHP: function (hp) {
    var hpPlus = hp.split(" ");
    if (hpPlus.length === 1) {
      var match = hp.match(/(\d*)\/(\d*)/);
      var normHP = Math.round(match[1] / match[2] * 100);
      return normHP;
    } else {
      if (hp.Plus[1] === 'fnt') {
        return 0;
      } else {
        var match = hp.match(/(\d*)\/(\d*) (.*)/);
        var normHP = Math.round(match[1] / match[2] * 100);
        return normHP;
      }
    }
  }
};

this.exports = utils;

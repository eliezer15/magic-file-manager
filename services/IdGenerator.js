const uuid = require('uuid/v1');

module.exports = {
  generateRandomId: function() {
    return uuid().substring(0,8);
  }
}
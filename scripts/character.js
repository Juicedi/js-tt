const Character = (function() {

  // Constructor
  const Character = function(character) {
    this.character = character;

    if (character === ' ') {
      this.type = 'space';
      this.typeable = false;
    }

    if (character === '\t') {
      this.type = 'tab';
      this.typeable = false;
    }

    if (character === '\n' || character === '\r') {
      this.type = 'line-break';
      this.typeable = false;
      this.character = '↓';
    }
  }

  Character.prototype.type = 'char';
  Character.prototype.typeable = true;

  return Character;
})();

const Character = (function() {

  // Constructor
  const Character = function(character) {
    this.type = 'char';
    this.typeable = true;
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
    }
  }

  return Character;
})();

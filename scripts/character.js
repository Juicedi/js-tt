// eslint-disable-next-line no-unused-vars
const Character = (function() {

  // Constructor
  const Character = function(character) {
    this.character = character;

    if (character === ' ') {
      this.type = 'space';
      this.whiteSpace = true;
    }

    if (character === '\t') {
      this.type = 'tab';
      this.whiteSpace = true;
    }

    if (character === '\n' || character === '\r') {
      this.type = 'line-break';
      this.whiteSpace = true;
      this.character = '↓';
    }
  };

  // Default values
  Character.prototype.type = 'char';
  Character.prototype.whiteSpace = false;

  return Character;
}());

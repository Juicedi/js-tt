/* globals Character */
// eslint-disable-next-line no-unused-vars
const Line = (function() {

  // Constructor
  const Line = function(line, newline) {
    this.characters = [];
    this.skipChars = [];

    let okChar = false;

    for (let i = 0; i < line.length; i += 1) {
      this.characters.push(new Character(line[i]));
      const character = this.characters[i];

      if (!okChar) {
        if (character.whiteSpace) {
          this.skipChars.push(i);
        } else {
          okChar = true;
        }
      }
    }

    if (newline === true) {
      this.characters.push(new Character('\n'));
    }

    // Check if the line is a comment
    if ((/\/\*.*\*\//).test(line)) {
      this.comment = 'line';
      this.status = 'skip';
    } else if ((/\/\*/).test(line)) {
      this.comment = 'start';
      this.status = 'skip';
    } else if ((/\*\//).test(line)) {
      this.comment = 'end';
      this.status = 'skip';
    } else if ((/\/\//).test(line)) {
      this.comment = 'line';
      this.status = 'skip';
    }
    // TODO: Check if line is inside of a block comment ie. below
    // Imma block <--- this line here

    // Check if the line is empty
    if (line.length === 1 && (line[0] === '\n' || line[0] === '\r')) {
      this.status = 'skip';
    }

    if (this.characters.length === this.skipChars.length) {
      this.status = 'skip';
    }
  };

  // Default values
  Line.prototype.status = 'ok';
  Line.prototype.comment = false;
  Line.prototype.shown = false;

  Line.prototype.appendChars = function(target) {
    for (let i = 0; i < this.characters.length; i += 1) {
      const newCharacter = document.createElement('SPAN');
      newCharacter.innerHTML = this.characters[i].character;
      target.appendChild(newCharacter);
    }
  };

  return Line;
}());

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

    if (newline === true && this.status !== 'skip') {
      this.characters.push(new Character('\n'));
    }

    // Check if the line is empty
    if (line.length === 0) {
      this.status = 'skip';
    }

    if (this.characters.length === this.skipChars.length) {
      this.status = 'skip';
    }
  };

  // Default values
  Line.prototype.status = 'ok';
  Line.prototype.comment = false;

  return Line;
}());

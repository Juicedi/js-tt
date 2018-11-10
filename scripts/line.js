const Line = (function() {

  // Constructor
  const Line = function(line) {
    this.characters = [];
    this.skipChars = [];

    let okChar = false;
    let comment = [];

    for(let i = 0; i < line.length; i++) {
      this.characters.push(new Character(line[i]));
      const char = this.characters[i];

      if (!okChar) {
        if (!char.whiteSpace) {
          okChar = true;
        } else {
          this.skipChars.push(i);
        }
      }
    }

    // Check if the line is a comment
    if (/\/\*.*\*\//.test(line)) {
      // Block comment on the same line
      this.comment = true;
      this.status = 'skip';
    } else if (/\/\*/.test(line)) {
      // Comment start
      this.comment = 'start';
      this.status = 'skip';
    } else if (/\*\//.test(line)) {
      // Comment end
      this.comment = 'end';
      this.status = 'skip';
    } else if (/\/\//.test(line)) {
      // Line comment
      this.comment = true;
      this.status = 'skip';
    }

    // Check if the line is empty
    if (line.length === 1 && (line[0] === '\n' || line[0] === '\r')) {
      this.status = 'skip';
    }

    if (this.characters.length === this.skipChars.length) {
      this.status = 'skip';
    }
  }

  // Default values
  Line.prototype.status = 'ok';
  Line.prototype.comment = false;
  Line.prototype.shown = false;

  Line.prototype.appendChars = function(target) {
    for (let i = 0; i < this.characters.length; i++) {
      const newCharacter = document.createElement('SPAN');
      newCharacter.innerHTML = this.characters[i].character;
      target.appendChild(newCharacter);
    }
  }

  return Line;
})();


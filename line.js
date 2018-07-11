const Line = function(line) {
  this.characters = [];
  this.status = 'ok';
  this.comment = false;
  this.skipChars = [];

  let okChar = false;
  let comment = [];

  for(let i = 0; i < line.length; i++) {
    this.characters.push(new Character(line[i]));
    const char = this.characters[i];

    if (!okChar) {
      if (char.typeable) {
        okChar = true;
      } else {
        this.skipChars.push(i);
      }
    }
  }

  if (/\/\*.*\*\//.test(line)) {
    this.comment = true;
    this.status = 'skip';
  } else if (/\/\*/.test(line)) {
    this.comment = 'start';
    this.status = 'skip';
  } else if (/\*\//.test(line)) {
    this.comment = 'end';
    this.status = 'skip';
  } else if (/\/\//.test(line)) {
    this.comment = true;
    this.status = 'skip';
  }

  if (line.length === 1 && (line[0] === '\n' || line[0] === '\r')) {
    this.status = 'skip';
  }
}

Line.prototype.appendChars = function(target) {
  for (let i = 0; i < this.characters.length; i++) {
    const newCharacter = document.createElement('SPAN');
    newCharacter.innerHTML = this.characters[i].character;
    target.appendChild(newCharacter);
  }
}
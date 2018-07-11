const Text = function(text, input, codearea) {
  this.input = input;
  this.codearea = codearea;
  this.lines = [];
  this.fullText = text;

  const textLines = text.split('\n');
  const len = 40;
  for(let i = 0; i < len; i++) {
    const newLine = new Line(textLines[i]);
    this.lines.push(newLine);
  }
}

Text.prototype.showText = function() {
  for (let i = 0; i < this.lines.length; i++) {
    const newLine = document.createElement('DIV');
    this.lines[i].appendChars(newLine);
    this.codearea.appendChild(newLine);
  }
}

Text.prototype.highlightLine = function(lineIndex) {
  this.codearea
    .querySelector(`div:nth-child(${lineIndex + 1})`)
    .classList.add('highlight');
}

Text.prototype.removeLineHighlight = function(lineIndex) {
  this.codearea
    .querySelector(`div:nth-child(${lineIndex + 1})`)
    .classList.remove('highlight');
}

Text.prototype.highlightChar = function(lineIndex, charIndex) {
  const line = this.codearea.querySelector(`div:nth-child(${lineIndex + 1}`);
  line.querySelector(`span:nth-child(${charIndex + 1})`)
    .classList.add('highlight');
}

Text.prototype.removeCharHighlight = function(lineIndex, charIndex) {
  const line = this.codearea.querySelector(`div:nth-child(${lineIndex + 1}`);
  line.querySelector(`span:nth-child(${charIndex + 1})`)
    .classList.remove('highlight');
}

Text.prototype.lowlightLine = function(lineIndex) {
  this.codearea
    .querySelector(`div:nth-child(${lineIndex + 1})`)
    .classList.add('lowlight');
}
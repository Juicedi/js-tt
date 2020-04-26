/* globals Line */
// eslint-disable-next-line no-unused-vars
const Text = (function() {

  // Constructor: text, codearea, maxLines
  const Text = function(options) {
    this.maxLines = options.maxLines;
    this.codearea = options.codeArea;
    this.lines = [];
    this.fullText = options.text;

    const textLines = options.text.split('\n');

    // Remove last empty line
    textLines.pop();
    const len = textLines.length;

    for (let i = 0; i < len; i += 1) {
      const newline = i === len - 1
        ? new Line(textLines[i])
        : new Line(textLines[i], true);

      this.lines.push(newline);
    }
  };

  Text.prototype.showText = function(startingLine) {
    let validLineNr = 0;
    let iterator = 0 + startingLine;

    while (validLineNr < this.maxLines && iterator < this.lines.length) {
      if (this.lines[iterator].status !== 'skip') {
        validLineNr += 1;
      }

      const newLine = document.createElement('DIV');
      this.lines[iterator].appendChars(newLine);
      this.codearea.appendChild(newLine);

      this.lines[iterator].shown = true;
      iterator += 1;
    }
  };

  Text.prototype.highlightLine = function(lineIndex) {
    this.codearea.querySelector(`div:nth-child(${lineIndex + 1})`)
      .classList.add('highlight');
  };

  Text.prototype.removeLineHighlight = function(lineIndex) {
    this.codearea
      .querySelector(`div:nth-child(${lineIndex + 1})`)
      .classList.remove('highlight');
  };

  Text.prototype.highlightChar = function(lineIndex, charIndex) {
    const line = this.codearea.querySelector(`div:nth-child(${lineIndex + 1}`);
    line.querySelector(`span:nth-child(${charIndex + 1})`)
      .classList.add('highlight');
  };

  Text.prototype.removeCharHighlight = function(lineIndex, charIndex) {
    const line = this.codearea.querySelector(`div:nth-child(${lineIndex + 1}`);
    line.querySelector(`span:nth-child(${charIndex + 1})`)
      .classList.remove('highlight');
  };

  Text.prototype.lowlightLine = function(lineIndex) {
    this.codearea
      .querySelector(`div:nth-child(${lineIndex + 1})`)
      .classList.add('lowlight');
  };

  return Text;
}());


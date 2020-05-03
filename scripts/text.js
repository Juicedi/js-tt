/* globals Line */
// eslint-disable-next-line no-unused-vars
const ParsedText = (function() {

  // Constructor
  const ParsedText = function(rawText) {
    this.lines = [];
    this.fullText = rawText;

    const textLines = rawText.split('\n');

    // Remove last empty line
    textLines.pop();
    const len = textLines.length;

    for (let i = 0; i < len; i += 1) {
      this.lines.push(new Line(textLines[i], true));
    }
  };

  return ParsedText;
}());


var App = (function() {
  var App = function() {
    this.texts = [];
    this.totalLinesCompleted = 0;
    this.currentLine = 0;
    this.currentChar = 0;
    this.lastCorrect = 0;
    this.started = false;
  }

  App.prototype.getText = function(url, callback) {
    const xhr = new XMLHttpRequest();
    const checkStatus = () => {
      const status = xhr.status;

      if (status === 200) {
        console.log(this);
        callback(xhr.response);
      } else {
        callback(xhr.response)
      }
    }

    xhr.open('GET', url, true);
    xhr.respondeType = 'txt';
    xhr.onload = checkStatus;
    xhr.send();
  }

  App.prototype.addNewText = function(text) {
    const input = document.getElementById('invis-input');
    const codeArea = document.getElementById('code-area');
    this.texts.push(new Text(text, input, codeArea, 10));
  }

  App.prototype.nextLine = function() {
    this.texts[0].removeLineHighlight(this.currentLine);
    this.currentLine++;
    this.totalLinesCompleted++;
    console.log('changing line');
    console.log('  current line: ' + this.currentLine);
    console.log('  total lines completed: ' + this.totalLinesCompleted);

    // Skip lines until valid line is found. Do this until all shown lines have
    // been looked through
    for (let i = 0; this.texts[0].lines[i + this.totalLinesCompleted - 1].shown; i++) {
      if (this.texts[0].lines[this.totalLinesCompleted].status === 'skip') {
        this.currentLine++;
        this.totalLinesCompleted++;
        console.log('skipped line');
        console.log('  current line: ' + this.currentLine);
        console.log('  total lines completed: ' + this.totalLinesCompleted);
      } else {
        break;
      }
    }

    // End the current exercise if end of lines have been reached
    if (!this.texts[0].lines[this.totalLinesCompleted].shown) {
      this.end();
      return;
    }

    this.currentChar = this.texts[0].lines[this.totalLinesCompleted].skipChars.length;
    this.texts[0].highlightChar(this.currentLine, this.currentChar);
    this.texts[0].highlightLine(this.currentLine);
  }

  App.prototype.nextChar = function() {
    this.texts[0].removeCharHighlight(this.currentLine, this.currentChar);
    this.currentChar++;

    if (this.texts[0].lines[this.totalLinesCompleted].characters.length === this.currentChar) {
      console.log('Start line change from:');
      console.log('  current line: ' + this.currentLine);
      console.log('  total lines completed: ' + this.totalLinesCompleted);
      this.nextLine();
    } else {
      this.texts[0].highlightChar(this.currentLine, this.currentChar);
    }
  }

  App.prototype.end = function() {
    console.log('checking for end');
    this.started = false;

    if (false) {
      this.texts[0].input.disabled = true;
      console.log('ended');
      return;
    }

    this.currentLine = 0;
    this.texts[0].codearea.innerHTML = '';
    this.texts[0].showText(this.totalLinesCompleted);
    this.start();
  }

  App.prototype.start = function() {
    let iter = 0;
    let comments = 0;
    console.log(this.texts[0].lines);

    while (this.texts[0].lines[this.totalLinesCompleted + iter].shown === true) {
      if (!this.started && this.texts[0].lines[this.totalLinesCompleted + iter].status !== 'skip') {
        this.started = true;
        this.currentLine = iter;
        this.texts[0].highlightLine(iter);
        this.currentChar = this.texts[0].lines[iter + this.totalLinesCompleted].skipChars.length
        this.texts[0].highlightChar(iter, this.currentChar);
      }

      if (this.texts[0].lines[this.totalLinesCompleted + iter].status === 'skip') {
        // Add the skipped comment-lines to the total completed lines number.
        this.texts[0].lowlightLine(iter);

        if (!this.started) {
          comments++;
        }
      }

      iter++;
    }

    this.totalLinesCompleted += comments;
    console.log('starting a new text');
    console.log('  current line: ' + this.currentLine);
    console.log('  total lines completed: ' + this.totalLinesCompleted);
    console.log('  comments: ' + comments);
  }

  App.prototype.initText = function(index) {
    const self = this;
    this.texts[index].showText(0);

    this.texts[index].input.addEventListener('keydown', function(e) {
      e.preventDefault();
      const chars = self.texts[0].lines[self.totalLinesCompleted].characters;
      self.value = '';

      if (
        e.key === chars[self.currentChar].character
        || (e.key === 'Enter' && self.currentChar === chars.length - 1)
      ) {
        self.nextChar();
      }
    });

    this.start();
  }

  App.prototype.run = function() {
    const cb = function(text) {
      console.log('imma callback');
      this.addNewText(text);
      this.initText(this.texts.length - 1);
    }

    this.getText('./resources/text.txt', cb.bind(this));
  }

  return App;
})();

const application = new App();
application.run();


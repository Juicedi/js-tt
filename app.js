const texts = [];
let currentLine = 0;
let currentChar = 0;
let lastCorrect = 0;
let started = false;

function getText(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.respondeType = 'txt';
  xhr.onload = () => {
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response)
    }
  };
  xhr.send();
}

function addNewText(text) {
  const input = document.getElementById('invis-input');
  const codeArea = document.getElementById('code-area');
  texts.push(new Text(text, input, codeArea));
}

function nextLine() {
  texts[0].removeLineHighlight(currentLine);
  currentLine++;

  // Skip lines until valid line is found
  for(let i = currentLine + 0; i < texts[0].lines.length; i++) {
    // TODO: Get next lines if there are any
    // End the current exercise if end of lines have been reached
    if (i + 1 >= texts[0].lines.length) {
      end();
      return;
    }

    if (texts[0].lines[i].status === 'skip') {
      currentLine++
    } else {
      break;
    }
  }

  currentChar = 0 + texts[0].lines[currentLine].skipChars.length;
  texts[0].highlightChar(currentLine, currentChar);
  texts[0].highlightLine(currentLine);
}

function nextChar() {
  texts[0].removeCharHighlight(currentLine, currentChar);
  currentChar++;

  if (texts[0].lines[currentLine].characters.length === currentChar) {
    console.log('change line');
    nextLine();
  } else {
    texts[0].highlightChar(currentLine, currentChar);
  }
}

function end() {
  texts[0].input.disabled = true;
  console.log('ended');
}

function start() {
  for (let i = 0; i < texts[0].lines.length; i++) {
    if (!started && texts[0].lines[i].status !== 'skip') {
      started = true;
      currentLine = i;
      texts[0].highlightLine(i);
      texts[0].highlightChar(i, currentChar);
    }

    if(texts[0].lines[i].status === 'skip') {
      texts[0].lowlightLine(i);
    }
  }
}

function initText(index) {
  texts[index].showText();
  texts[index].input.addEventListener('keydown', function(e) {
    e.preventDefault();
    const chars = texts[0].lines[currentLine].characters;
    this.value = '';

    if (
      e.key === chars[currentChar].character ||
      (e.key === 'Enter' && currentChar === chars.length - 1)
    ) {
      nextChar();
    }
  });
  console.log(texts[index]);
  start();
}

getText('text.txt', function(arg, text) {
  addNewText(text);
  initText(texts.length - 1);
});

const texts = [];
let totalLinesCompleted = 0;
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
  totalLinesCompleted++;
  console.log('changing line');
  console.log('  current line: ' + currentLine);
  console.log('  total lines completed: ' + totalLinesCompleted);

  // Skip lines until valid line is found. Do this until all shown lines have
  // been looked through
  for (let i = 0; texts[0].lines[i + totalLinesCompleted - 1].shown; i++) {
    if (texts[0].lines[totalLinesCompleted].status === 'skip') {
      currentLine++;
      totalLinesCompleted++;
      console.log('skipped line');
      console.log('  current line: ' + currentLine);
      console.log('  total lines completed: ' + totalLinesCompleted);
    } else {
      break;
    }
  }

  // End the current exercise if end of lines have been reached
  if (!texts[0].lines[totalLinesCompleted].shown) {
    end();
    return;
  }

  currentChar = texts[0].lines[totalLinesCompleted].skipChars.length;
  texts[0].highlightChar(currentLine, currentChar);
  texts[0].highlightLine(currentLine);
}

function nextChar() {
  texts[0].removeCharHighlight(currentLine, currentChar);
  currentChar++;

  if (texts[0].lines[totalLinesCompleted].characters.length === currentChar) {
    console.log('Start line change from:');
    console.log('  current line: ' + currentLine);
    console.log('  total lines completed: ' + totalLinesCompleted);
    nextLine();
  } else {
    texts[0].highlightChar(currentLine, currentChar);
  }
}

function end() {
  console.log('checking for end');
  started = false;

  if (false) {
    texts[0].input.disabled = true;
    console.log('ended');
    return;
  }

  currentLine = 0;
  texts[0].codearea.innerHTML = '';
  texts[0].showText(totalLinesCompleted);
  start();
}

function start() {
  let iter = 0;
  let comments = 0;
  console.log(texts);

  while (texts[0].lines[totalLinesCompleted + iter].shown === true) {
    if (!started && texts[0].lines[totalLinesCompleted + iter].status !== 'skip') {
      started = true;
      currentLine = iter;
      texts[0].highlightLine(iter);
      currentChar = texts[0].lines[iter + totalLinesCompleted].skipChars.length
      texts[0].highlightChar(iter, currentChar);
    }

    if (texts[0].lines[totalLinesCompleted + iter].status === 'skip') {
      // Add the skipped comment-lines to the total completed lines number.
      texts[0].lowlightLine(iter);

      if (!started) {
        comments++;
      }
    }

    iter++;
  }

  totalLinesCompleted += comments;
  console.log('starting a new text');
  console.log('  current line: ' + currentLine);
  console.log('  total lines completed: ' + totalLinesCompleted);
  console.log('  comments: ' + comments);
}

function initText(index) {
  texts[index].showText(0);
  texts[index].input.addEventListener('keydown', function(e) {
    e.preventDefault();
    const chars = texts[0].lines[totalLinesCompleted].characters;
    this.value = '';

    if (
      e.key === chars[currentChar].character ||
      (e.key === 'Enter' && currentChar === chars.length - 1)
    ) {
      nextChar();
    }
  });
  // console.log(texts[index]);
  start();
}

getText('./resources/text.txt', function(arg, text) {
  addNewText(text);
  initText(texts.length - 1);
});

let totalLinesCompleted = 0;
let started = false;
let currentLine = 0;
let currentChar = 0;

const initTextFocus = function(input, codeArea) {
  codeArea.addEventListener('click', () => {
    input.focus();
  });

  input.addEventListener('blur', () => {
    codeArea.classList.add('blur');
  });

  input.addEventListener('focus', () => {
    codeArea.classList.remove('blur');
  });
};

const start = function(text) {
  let iter = 0;
  let comments = 0;

  while (text.lines[totalLinesCompleted + iter].shown === true) {
    if (!started && text.lines[totalLinesCompleted + iter].status !== 'skip') {
      started = true;
      currentLine = iter;
      text.highlightLine(iter);
      currentChar = text.lines[iter + totalLinesCompleted].skipChars.length;
      text.highlightChar(iter, currentChar);
    }

    if (text.lines[totalLinesCompleted + iter].status === 'skip') {
      // Add the skipped comment-lines to the total completed lines number.
      text.lowlightLine(iter);

      if (!started) {
        comments++;
      }
    }

    iter++;
  }

  totalLinesCompleted += comments;
};

const end = function(text, input) {
  //
  // TODO: Should the started value be some kind of a check? Like is the last
  // text chunk been completed or something
  //

  started = false;

  if (started) {
    input.disabled = true;
    console.log('ended');
    return;
  }

  currentLine = 0;
  text.codearea.innerHTML = '';
  text.showText(totalLinesCompleted);
  start(text);
};

const nextLine = function(text) {
  text.removeLineHighlight(currentLine);
  currentLine++;
  totalLinesCompleted++;

  // Skip lines until valid line is found. Do this until all shown lines have
  // been looked through
  for (let i = 0; text.lines[i + totalLinesCompleted - 1].shown; i++) {
    if (text.lines[totalLinesCompleted].status === 'skip') {
      currentLine++;
      totalLinesCompleted++;
    } else {
      break;
    }
  }

  // End the current exercise if end of lines have been reached
  if (!text.lines[totalLinesCompleted].shown) {
    end(text);
    return;
  }

  currentChar = text.lines[totalLinesCompleted].skipChars.length;
  text.highlightChar(currentLine, currentChar);
  text.highlightLine(currentLine);
};

const wrongButtonFlash = function(eventKey) {
  const warning = document.querySelector('#wrong-button-warning');
  let key = eventKey;

  if (key === ' ') {
    key = 'Space';
  }

  warning.innerHTML = key;
  warning.style.transition = 'none';
  warning.style.opacity = 0.8;

  return setTimeout(() => {
    warning.style.transition = 'opacity 0.6s';
    warning.style.opacity = 0;
  }, 600);
};

const createInputHandler = (text) => {
  let warningTimeout = null;

  return (e) => {
    e.preventDefault();
    const chars = text.lines[totalLinesCompleted].characters;

    if ((/Tab|Shift|Control|Alt|CapsLock/).test(e.key)) {
      return;
    }

    const isCurrentChar = e.key === chars[currentChar].character;
    const isLinebreak = (e.key === 'Enter' && currentChar === chars.length - 1);

    const lineLength = text.lines[totalLinesCompleted].characters.length;
    const isLastChar = lineLength === currentChar + 1;

    const shouldGoNextChar = isCurrentChar || isLinebreak;
    const shouldGoNextLine = shouldGoNextChar && isLastChar;

    if (shouldGoNextLine) {
      text.removeCharHighlight(currentLine, currentChar);
      currentChar++;
      nextLine(text);
    } else if (shouldGoNextChar) {
      text.removeCharHighlight(currentLine, currentChar);
      currentChar++;
      text.highlightChar(currentLine, currentChar);
    } else {
      if (warningTimeout !== null) {
        clearTimeout(warningTimeout);
        warningTimeout = null;
      }

      warningTimeout = wrongButtonFlash(e.key);
    }
  };
};

const runApp = function(rawText) {
  const input = document.getElementById('invis-input');
  const codeArea = document.getElementById('code-area');

  const options = {
    codeArea,
    input,
    maxLines: 2,
    text: rawText
  };

  const text = new Text(options);

  initTextFocus(input, codeArea);

  const handleInput = createInputHandler(text);
  input.addEventListener('keydown', handleInput);

  text.showText(0);
  start(text);
};

const getText = function(url, callback) {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);
  xhr.respondType = 'txt';

  xhr.onload = () => {
    if (xhr.status !== 200) {
      throw new Error(`couldn't load text\nxhr status = ${xhr.status}`);
    }

    callback(xhr.response);
  };

  xhr.send();
};

getText('./resources/text.txt', runApp);

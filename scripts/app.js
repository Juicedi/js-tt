let totalLinesCompleted = 0;
let started = false;
let currentLine = 0;
let currentChar = 0;

const showTextChunk = function(text, startLine) {
  let iter = 0;
  let comments = 0;

  text.codearea.innerHTML = '';
  text.showText(startLine);

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
        comments += 1;
      }
    }

    iter += 1;

    // The last line has just been iterated over, no need to continue
    if (typeof text.lines[totalLinesCompleted + iter] === 'undefined') {
      break;
    }
  }

  totalLinesCompleted += comments;
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

const skipInvalidLines = function(text) {
  let iter = 0;

  // Skip lines until valid line is found. Do this until all shown lines have
  // been looked through
  while (text.lines[iter + totalLinesCompleted - 1].shown) {
    if (text.lines[totalLinesCompleted].status === 'skip') {
      currentLine += 1;
      totalLinesCompleted += 1;
      iter += 1;

      if (typeof text.lines[iter + totalLinesCompleted - 1] === 'undefined') {
        break;
      }
    } else {
      break;
    }
  }
};

const highlightNextLine = function(text) {
  skipInvalidLines(text);
  currentChar = text.lines[totalLinesCompleted].skipChars.length;
  text.highlightChar(currentLine, currentChar);
  text.highlightLine(currentLine);
};

const createInputHandler = (text, input) => {
  let warningTimeout = null;

  return (e) => {
    e.preventDefault();
    const chars = text.lines[totalLinesCompleted].characters;

    if ((/Tab|Shift|Control|Alt|CapsLock/).test(e.key)) {
      return;
    }

    const isCurrentChar = e.key === chars[currentChar].character;
    const isLinebreak = e.key === 'Enter' && currentChar === chars.length - 1;
    const shouldGoNextChar = isCurrentChar || isLinebreak;
    const lineLength = text.lines[totalLinesCompleted].characters.length;
    const isLastChar = lineLength === currentChar + 1;
    const shouldGoNextLine = shouldGoNextChar && isLastChar;
    const shouldEnd = shouldGoNextLine
      && totalLinesCompleted + 1 === text.lines.length;
    const shouldStartNextTextChunk = !shouldEnd && shouldGoNextLine
      && !text.lines[totalLinesCompleted + 1].shown;

    if (shouldEnd) {
      text.removeCharHighlight(currentLine, currentChar);
      text.removeLineHighlight(currentLine);
      console.log('whole text is now finished');
      input.disabled = true;
      // TODO: Do something else on finish?
    } else if (shouldStartNextTextChunk) {
      currentLine = 0;
      totalLinesCompleted += 1;
      showTextChunk(text, totalLinesCompleted);
      highlightNextLine(text);
    } else if (shouldGoNextLine) {
      text.removeCharHighlight(currentLine, currentChar);
      text.removeLineHighlight(currentLine);
      currentLine += 1;
      totalLinesCompleted += 1;
      highlightNextLine(text);
    } else if (shouldGoNextChar) {
      text.removeCharHighlight(currentLine, currentChar);
      currentChar += 1;
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

const initTextFocus = function(text, input, codeArea) {
  const handleInput = createInputHandler(text, input);
  input.addEventListener('keydown', handleInput);

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

const runApp = function(rawText) {
  const input = document.getElementById('invis-input');
  const codeArea = document.getElementById('code-area');

  const options = {
    codeArea,
    input,
    maxLines: 4,
    text: rawText
  };

  const text = new Text(options);

  initTextFocus(text, input, codeArea);
  showTextChunk(text, 0);
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

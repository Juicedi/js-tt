/* globals ParsedText */
let totalLinesCompleted = 0;
let started = false;
let currentLine = 0;
let currentChar = 0;

const showTextChunk = function(data, startLine, codeArea, highlightClassStr) {
  const {text, chunkSize} = data;

  //
  // Add lines and their chars to the codeArea
  //

  let validLineNr = 0;
  let iterator = 0 + startLine;

  codeArea.innerHTML = '';

  while (validLineNr < chunkSize && iterator < text.lines.length) {
    if (text.lines[iterator].status !== 'skip') {
      validLineNr += 1;
    }

    const newLine = document.createElement('DIV');

    for (let i = 0; i < text.lines[iterator].characters.length; i += 1) {
      const newCharacter = document.createElement('SPAN');
      newCharacter.innerHTML = text.lines[iterator].characters[i].character;
      newLine.appendChild(newCharacter);
    }

    codeArea.appendChild(newLine);
    iterator += 1;
  }

  //
  // Add highlight and lowlights to the codeArea
  //

  let iter = 0 + startLine;
  let comments = 0;
  let skipLines = 0;

  while (iter < chunkSize + startLine + comments) {
    const line = codeArea.querySelector(`div:nth-child(${iter + 1})`);
    const lineData = text.lines[totalLinesCompleted + iter];

    if (!started && lineData.status !== 'skip') {
      started = true;
      currentLine = iter;
      line.classList.add(highlightClassStr);

      // Highligh the first valid character
      currentChar = lineData.skipChars.length;
      line.querySelector(`span:nth-child(${currentChar + 1})`)
        .classList.add(highlightClassStr);
    }

    if (lineData.status === 'skip') {
      // Add the skipped comment-lines to the total completed lines number.
      line.classList.add('lowlight');
      comments += 1;

      if (!started) {
        skipLines += 1;
      }
    }

    iter += 1;

    // The last line has just been iterated over, no need to continue
    if (typeof text.lines[totalLinesCompleted + iter] === 'undefined') {
      break;
    }
  }

  totalLinesCompleted += skipLines;
};

// Skip lines until valid line is found. Do this until all shown lines have
// been looked through
const skipInvalidLines = function(text) {
  while (text.lines[totalLinesCompleted].status === 'skip') {
    currentLine += 1;
    totalLinesCompleted += 1;

    if (typeof text.lines[totalLinesCompleted] === 'undefined') {
      break;
    }
  }
};

const createCbNextChar = (codeArea, highlightClassStr) => () => {
  const line = codeArea.querySelector(`div:nth-child(${currentLine + 1})`);
  line.querySelector(`span:nth-child(${currentChar + 1})`).classList.remove(highlightClassStr);
  currentChar += 1;
  line.querySelector(`span:nth-child(${currentChar + 1})`).classList.add(highlightClassStr);
};

const createCbNextLine = (codeArea, highlightClassStr, text) => () => {
  let line = codeArea.querySelector(`div:nth-child(${currentLine + 1})`);
  line.classList.remove(highlightClassStr);
  line.querySelector(`span:nth-child(${currentChar + 1})`).classList.remove(highlightClassStr);

  currentLine += 1;
  totalLinesCompleted += 1;

  skipInvalidLines(text);

  currentChar = text.lines[totalLinesCompleted].skipChars.length;
  line = codeArea.querySelector(`div:nth-child(${currentLine + 1})`);

  line.classList.add(highlightClassStr);
  line.querySelector(`span:nth-child(${currentChar + 1})`).classList.add(highlightClassStr);
};

const createCbNextChunk = (codeArea, highlightClassStr, textData) => () => {
  const line = codeArea.querySelector(`div:nth-child(${currentLine + 1})`);
  const {text} = textData;

  currentLine = 0;
  totalLinesCompleted += 1;

  showTextChunk(textData, totalLinesCompleted, codeArea, highlightClassStr);
  skipInvalidLines(text);

  currentChar = text.lines[totalLinesCompleted].skipChars.length;

  line.classList.add(highlightClassStr);
  line.querySelector(`span:nth-child(${currentChar + 1})`).classList.add(highlightClassStr);
};

const createCbEnd = (codeArea, highlightClassStr, input) => () => {
  const line = codeArea.querySelector(`div:nth-child(${currentLine + 1})`);

  line.classList.remove(highlightClassStr);
  line.querySelector(`span:nth-child(${currentChar + 1})`).classList.remove(highlightClassStr);

  console.log('whole text is now finished');

  input.disabled = true;
};

const hideWarning = (element) => {
  element.style.transition = 'opacity 0.6s';
  element.style.opacity = 0;
};

const createCbShowWarning = () => (warningTimeout, text) => {
  const warning = document.querySelector('#wrong-button-warning');
  let result = null;

  if (warningTimeout !== null) {
    clearTimeout(warningTimeout);
  }

  warning.innerHTML = text;
  warning.style.transition = 'none';
  warning.style.opacity = 0.8;

  result = setTimeout(hideWarning.bind(null, warning), 600);
  return result;
};

const createStateCb = (text, callbacks) => {
  const {nextChar, nextLine, nextChunk, end, showWarning} = callbacks;

  // eslint-disable-next-line no-unused-vars
  let warningTimeout = null;

  return (key) => {
    const chars = text.lines[totalLinesCompleted].characters;

    // 0. currentchar 1. linebreak 2. all lines complete 3.last chunk line
    const state = ((key === chars[currentChar].character & 1) << 0)
      | ((key === 'Enter' && currentChar === (chars.length - 1) & 1) << 1)
      | ((totalLinesCompleted + 1 === text.lines.length & 1) << 2)
      | ((text.lines[totalLinesCompleted + 1]
        && text.lines[totalLinesCompleted + 1].shown === false & 1) << 3);

    switch (state.toString(2)) {
      case '1001':
      case '101':
      case '1': {
        nextChar();
        break;
      }
      case '10': {
        nextLine();
        break;
      }
      case '110': {
        end();
        break;
      }
      case '1010': {
        nextChunk();
        break; }
      default: {
        const param = key === ' ' ? 'Space' : key;
        warningTimeout = showWarning(warningTimeout, param);
        break;
      }
    }
  };
};

const createInputHandler = (callback) => (e) => {
  e.preventDefault();

  if ((/Tab|Shift|Control|Alt|CapsLock/).test(e.key)) {
    return;
  }

  callback(e.key);
};

const createCbAddClass = (classStr, element) => () => {
  element.classList.add(classStr);
};

const createCbRemoveClass = (classStr, element) => () => {
  element.classList.remove(classStr);
};

const createCbFocus = (element) => () => {
  element.focus();
};

const runApp = function(rawText) {
  const input = document.getElementById('invis-input');
  const codeArea = document.getElementById('code-area');
  const text = new ParsedText(rawText);
  const highlightClassStr = 'highlight';

  const textData = {
    chunkSize: 7,
    text
  };

  const stateCallbacks = {
    end: createCbEnd(codeArea, highlightClassStr, input),
    nextChar: createCbNextChar(codeArea, highlightClassStr),
    nextChunk: createCbNextChunk(codeArea, highlightClassStr, textData),
    nextLine: createCbNextLine(codeArea, highlightClassStr, text),
    showWarning: createCbShowWarning()
  };

  const state = createStateCb(text, stateCallbacks);

  codeArea.addEventListener('click', createCbFocus(input));
  input.addEventListener('keydown', createInputHandler(state));
  input.addEventListener('blur', createCbAddClass('blur', codeArea));
  input.addEventListener('focus', createCbRemoveClass('blur', codeArea));

  showTextChunk(textData, 0, codeArea, highlightClassStr);
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

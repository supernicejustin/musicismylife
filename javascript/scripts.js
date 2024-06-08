let composition = [];
let isRecording = false;
let currentInstrument = '';

function showInstrumentModal() {
  document.getElementById('instrument-modal').classList.remove('hidden');
}

function hideInstrumentModal() {
  document.getElementById('instrument-modal').classList.add('hidden');
}

function addInstrument(instrument) {
  document.querySelector('.instrument-display').classList.remove('hidden');
  hideInstrumentModal();
  
  const instrumentControl = document.createElement('div');
  instrumentControl.classList.add('instrument-control');
  instrumentControl.dataset.instrument = instrument;
  
  const instrumentTitleInput = document.createElement('input');
  instrumentTitleInput.type = 'text';
  instrumentTitleInput.value = instrument;
  instrumentControl.appendChild(instrumentTitleInput);
  
  instrumentControl.addEventListener('click', () => {
    updateInstrumentSelect(instrumentControl);
    showInstrument(instrument);
  });
  
  const rangeLabel = document.createElement('label');
  rangeLabel.textContent = 'Volume';
  instrumentControl.appendChild(rangeLabel);
  
  const rangeInput = document.createElement('input');
  rangeInput.type = 'range';
  rangeInput.min = 0;
  rangeInput.max = 100;
  rangeInput.value = 50;
  rangeInput.classList.add('instrument-range');
  instrumentControl.appendChild(rangeInput);
  
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  deleteButton.onclick = function() {
    instrumentControl.remove();
    checkInstruments();
  };
  instrumentControl.appendChild(deleteButton);
  
  document.getElementById('instrument-controls').appendChild(instrumentControl);
  
  updateInstrumentSelect(instrumentControl);
  showInstrument(instrument);
  checkInstruments();

  const newLine = document.createElement('div');
  newLine.classList.add('composition-line');
  newLine.dataset.instrument = instrument;
  
  const newLineTitle = document.createElement('div');
  newLineTitle.classList.add('composition-line-title');
  newLineTitle.textContent = instrument;
  newLine.appendChild(newLineTitle);
  
  document.getElementById('composition-area').appendChild(newLine);
  currentInstrument = instrument;
}

function updateInstrumentSelect(instrumentControl) {
  const instrument = instrumentControl.dataset.instrument;
  const selectedType = instrumentControl.dataset.selectedType || 'First';
  const instrumentSelect = document.querySelector('.instrument-select');
  instrumentSelect.innerHTML = `
    <h3>Select a ${instrument} type</h3>
    <button onclick="selectInstrumentType('${instrument}', 'First', this)" class="${selectedType === 'First' ? 'selected' : ''}">First</button>
    <button onclick="selectInstrumentType('${instrument}', 'Second', this)" class="${selectedType === 'Second' ? 'selected' : ''}">Second</button>
  `;
}

function selectInstrumentType(instrument, type, button) {
  const instrumentControl = Array.from(document.querySelectorAll('.instrument-control')).find(control => control.dataset.instrument === instrument);
  instrumentControl.dataset.selectedType = type;
  
  const buttons = document.querySelectorAll('.instrument-select button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');
}

function checkInstruments() {
  const instrumentControls = document.getElementById('instrument-controls');
  const instrumentDisplay = document.querySelector('.instrument-display');
  
  if (instrumentControls.children.length === 0) {
    instrumentDisplay.classList.add('hidden');
  } else {
    instrumentDisplay.classList.remove('hidden');
  }
}

function showInstrument(instrument) {
  const instrumentList = document.getElementById('instrument-list');
  instrumentList.innerHTML = '';

  if (instrument === 'Piano') {
    createPiano(instrumentList);
  }
}

function createPiano(container) {
  const pianoKeys = [
    { note: 'C', color: 'white' },
    { note: 'C2', color: 'black' },
    { note: 'D', color: 'white' },
    { note: 'D2', color: 'black' },
    { note: 'E', color: 'white' },
    { note: 'F', color: 'white' },
    { note: 'F2', color: 'black' },
    { note: 'G', color: 'white' },
    { note: 'G2', color: 'black' },
    { note: 'A', color: 'white' },
    { note: 'A2', color: 'black' },
    { note: 'B', color: 'white' }
  ];

  const piano = document.createElement('div');
  piano.classList.add('piano-keyboard');

  pianoKeys.forEach((key) => {
    const keyElement = document.createElement('div');
    keyElement.classList.add('piano-key');
    keyElement.textContent = key.note;
    keyElement.dataset.note = key.note;

    if (key.color === 'black') {
      keyElement.classList.add('black');
    }

    keyElement.addEventListener('mousedown', () => playNoteAndAddToComposition(key.note, keyElement));
    keyElement.addEventListener('mouseup', () => stopNoteKey(keyElement));
    keyElement.addEventListener('mouseleave', () => stopNoteKey(keyElement));

    piano.appendChild(keyElement);
  });

  container.appendChild(piano);
}

function playNoteAndAddToComposition(note, keyElement) {
  playNote(note, keyElement);
  if (isRecording) {
    addToComposition(note);
  }
}

function playNote(note, keyElement) {
  keyElement.classList.add('active');
  const audio = new Audio(`sounds/${note}.mp3`);
  audio.play();
  keyElement.audio = audio;
}

function stopNoteKey(keyElement) {
  keyElement.classList.remove('active');
  if (keyElement.audio) {
    keyElement.audio.pause();
    keyElement.audio.currentTime = 0;
    keyElement.audio = null;
  }
}

function addToComposition(note) {
  const compositionArea = document.getElementById('composition-area');
  const noteElement = document.createElement('div');
  noteElement.classList.add('composition-note');
  noteElement.textContent = note;
  noteElement.dataset.note = note;
  noteElement.addEventListener('click', () => removeFromComposition(noteElement));

  composition.push(note);

  const currentLine = Array.from(compositionArea.children).find(line => line.dataset.instrument === currentInstrument);
  if (currentLine) {
    currentLine.appendChild(noteElement);
  }
}

function removeFromComposition(noteElement) {
  const index = Array.from(noteElement.parentNode.children).indexOf(noteElement);
  composition.splice(index, 1);
  noteElement.remove();
}

function saveComposition() {
  localStorage.setItem('composition', JSON.stringify(composition));
}

function loadComposition() {
  const savedComposition = JSON.parse(localStorage.getItem('composition'));
  if (savedComposition) {
    savedComposition.forEach(note => addToComposition(note));
  }
  //addInstrument('Piano')
  //창 열었을 때 피아노 바로 뜨게하기
}

function playComposition() {
  let index = 0;

  function playNextNote() {
    if (index < composition.length) {
      const note = composition[index];
      const audio = new Audio(`sounds/${note}.mp3`);
      audio.play();
      index++;
      setTimeout(playNextNote, 500);
    }
  }

  playNextNote();
}

function toggleRecording() {
  isRecording = !isRecording;
  const recordButton = document.querySelector('.control-button.record');
  if (isRecording) {
    recordButton.classList.add('recording');
  } else {
    recordButton.classList.remove('recording');
  }
}

window.onload = loadComposition;

document.querySelector('.control-button.record').addEventListener('click', toggleRecording);

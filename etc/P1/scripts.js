function showInstrumentModal() {
  document.getElementById('instrument-modal').classList.remove('hidden');
}

function hideInstrumentModal() {
  document.getElementById('instrument-modal').classList.add('hidden');
}

function addInstrument(instrument) {
  document.querySelector('.instrument-display').classList.remove('hidden');
  hideInstrumentModal();
  
  // 악기 추가
  const instrumentControl = document.createElement('div');
  instrumentControl.classList.add('instrument-control');
  instrumentControl.dataset.instrument = instrument;
  
  const instrumentTitleInput = document.createElement('input');
  instrumentTitleInput.type = 'text';
  instrumentTitleInput.value = instrument;
  instrumentControl.appendChild(instrumentTitleInput);
  
  instrumentControl.addEventListener('click', () => {
    updateInstrumentSelect(instrumentControl);
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
  deleteButton.textContent = '삭제';
  deleteButton.classList.add('delete-button');
  deleteButton.onclick = function() {
    instrumentControl.remove();
    checkInstruments();
  };
  instrumentControl.appendChild(deleteButton);
  
  document.getElementById('instrument-controls').appendChild(instrumentControl);
  
  // 초기 선택 영역 업데이트
  updateInstrumentSelect(instrumentControl);
  checkInstruments();
}

function updateInstrumentSelect(instrumentControl) {
  const instrument = instrumentControl.dataset.instrument;
  const selectedType = instrumentControl.dataset.selectedType || '첫번째';
  const instrumentSelect = document.querySelector('.instrument-select');
  instrumentSelect.innerHTML = `
    <h3>${instrument} 종류 선택</h3>
    <button onclick="selectInstrumentType('${instrument}', '첫번째', this)" class="${selectedType === '첫번째' ? 'selected' : ''}">첫번째</button>
    <button onclick="selectInstrumentType('${instrument}', '두번째', this)" class="${selectedType === '두번째' ? 'selected' : ''}">두번째</button>
  `;
}

function selectInstrumentType(instrument, type, button) {
  const instrumentControl = Array.from(document.querySelectorAll('.instrument-control')).find(control => control.dataset.instrument === instrument);
  instrumentControl.dataset.selectedType = type;
  
  const buttons = document.querySelectorAll('.instrument-select button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  button.classList.add('selected');

  console.log(`${instrument} - ${type} 선택됨`);
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

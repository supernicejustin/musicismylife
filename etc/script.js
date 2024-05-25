const pianoKeys = document.querySelectorAll(".piano-keys .key"),
    volumeSlider = document.querySelector(".volume-slider input"),
    keysCheckbox = document.querySelector(".keys-checkbox input");

let allKeys = [],
    audio = new Audio(`tunes/a.wav`); // 기본값, 'a'튠이 기본음

const playTune = (key) => {
    audio.src = `tunes/${key}.wav`; // 키보드 입력에 따른 음 출력 
    audio.play(); // 오디오 출력

    const clickedKey = document.querySelector(`[data-key="${key}"]`); // 클릭 상호작용
    clickedKey.classList.add("active"); // 클릭된 키 요소에 active 클래스 추가
    setTimeout(() => { // 추가된 active 클래스 150ms 뒤에 삭제
        clickedKey.classList.remove("active");
    }, 150);
}

pianoKeys.forEach(key => {
    allKeys.push(key.dataset.key); // allKeys 배열에 data-key 값을 추가
    // 데이터 키 값을 전달하여 playTune 기능을 호출
    key.addEventListener("click", () => playTune(key.dataset.key));
});

const handleVolume = (e) => {
    audio.volume = e.target.value; // 오디오의 볼륨을 input-range의 슬라이더를 통해 조절
}

const showHideKeys = () => {
    // 체크박스 클릭을 통해 클래스 숨김을 전환
    pianoKeys.forEach(key => key.classList.toggle("hide"));
}

const pressedKey = (e) => {
    // allKeys 배열 안에 눌린 키가 있다면, playTune 기능만 호출
    if (allKeys.includes(e.key)) playTune(e.key);
}

keysCheckbox.addEventListener("click", showHideKeys);
volumeSlider.addEventListener("input", handleVolume);
document.addEventListener("keydown", pressedKey);
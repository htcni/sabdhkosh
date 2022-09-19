import { getRandomInt } from './utils.js';

const wordInput = document.getElementById('word');
const speakBtn = document.getElementById('speak-btn');
const phonetic = document.getElementById('phonetic');
const partOfSpeech = document.getElementById('part-of-speech');
const definition = document.getElementById('definition');
const synonyms = document.getElementById('synonyms');
const antonyms = document.getElementById('antonyms');
const searchedWord = document.getElementById('searched-word');

const handleError = (err) => {
  definition.innerText = err.response.data.message;
  phonetic.innerText = '';
};

const resetData = () => {
  definition.innerHTML = '';
  searchedWord.innerHTML = '';
  synonyms.innerHTML = '';
  antonyms.innerHTML = '';
  speakBtn.disabled = true;
};

const setData = (data) => {
  resetData();
  phonetic.innerText = data[0].phonetic;
  searchedWord.innerText = data[0].word;
  partOfSpeech.innerText = data[0].meanings[0].partOfSpeech;

  for (let i = 0; i < data[0].meanings[0].definitions.length; i++) {
    if (i == 2) break;
    let x = document.createElement('p');
    x.innerText = `${i + 1}. ${data[0].meanings[0].definitions[i].definition}`;
    definition.appendChild(x);
  }

  for (let i = 0; i < data[0].meanings[0].antonyms.length; i++) {
    if (i == 5) break;
    let x = document.createElement('span');

    x.innerText = `${data[0].meanings[0].antonyms[i]}`;
    antonyms.appendChild(x);
  }

  for (let i = 0; i < data[0].meanings[0].synonyms.length; i++) {
    if (i == 5) break;
    let x = document.createElement('span');

    x.innerText = `${data[0].meanings[0].synonyms[i]}`;
    synonyms.appendChild(x);
  }

  for (let i = 0; i < data[0].phonetics.length; i++) {
    if (data[0].phonetics[i].audio !== '') {
      setAudio(data[0].phonetics[i].audio);
      break;
    }
  }
};

const getMeaning = (word) => {
  axios
    .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((res) => res.data)
    .then((data) => setData(data))
    .catch((err) => {
      handleError(err);
    });
};

wordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    let word = e.currentTarget.value;
    if (word) {
      getMeaning(word);
    } else {
      // Display msg
    }
  }
});

getMeaning('Love');

let myAudioElement;
const setAudio = (audioUrl) => {
  if (myAudioElement) {
    myAudioElement.innerHTML = '';
  }

  myAudioElement = new Audio(audioUrl);
  myAudioElement.addEventListener('canplaythrough', (event) => {
    speakBtn.disabled = false;
    speakBtn.addEventListener('click', (event) => {
      myAudioElement.play();
    });
  });
};

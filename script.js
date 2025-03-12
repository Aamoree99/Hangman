let locale = 'ru';
let translations = {};

async function loadLocale(lang = locale) {
  try {
    const res = await fetch(`./locales/${lang}.json`);
    translations = await res.json();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[key]) el.innerHTML = translations[key];
    });
  } catch (e) {
    console.error("Ошибка загрузки локализации", e);
  }
}

async function getAvailableLanguages() {
    const langSelect = document.getElementById('lang-select');
    try {
      const res = await fetch('./locales/index.json');
      const langs = await res.json();
  
      langSelect.innerHTML = ''; 
      langs.forEach(lang => {
        const opt = document.createElement('option');
        opt.value = lang;
        opt.textContent = lang.toUpperCase();
        if (lang === locale) opt.selected = true;
        langSelect.appendChild(opt);
      });
    } catch (e) {
      console.error("Не удалось загрузить список языков", e);
    }
  }
  

function toggleLanguage(lang) {
  locale = lang;
  loadLocale(lang);
}

let selectedLength = 0;

function switchMode(mode) {
  document.getElementById('game-mode').style.display = mode === 'game' ? 'block' : 'none';
  document.getElementById('helper-mode').style.display = mode === 'helper' ? 'block' : 'none';
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`.tab[onclick="switchMode('${mode}')"]`).classList.add('active');

  if (mode === 'helper' && selectedLength === 0) {
    const firstBtn = document.querySelector('.word-length-buttons button');
    if (firstBtn) firstBtn.click();
  }
}

function selectLength(length, btn) {
  selectedLength = length;
  document.querySelectorAll('.word-length-buttons button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  generateInputs();
}

function generateInputs() {
  const container = document.getElementById("inputs");
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < selectedLength; i++) {
    const input = document.createElement("input");
    input.maxLength = 1;
    input.className = "letter-box";
    input.type = "text";
    input.maxlength="1"
    input.addEventListener("input", fetchWords);
    container.appendChild(input);
  }
  const firstInput = container.querySelector("input");
  if (firstInput) firstInput.focus();
  fetchWords();
}

function resetHelper() {
  const container = document.getElementById("inputs");
  if (container) container.innerHTML = '';
  document.getElementById("excluded-letters").value = '';
  document.getElementById("suggestions").innerHTML = translations.suggestionPlaceholder || 'Подсказки появятся здесь...';
  const hintEl = document.getElementById("letter-hint");
  hintEl.innerHTML = '';
  hintEl.style.display = 'none';
  document.querySelectorAll('.word-length-buttons button').forEach(b => b.classList.remove('active'));
  selectedLength = 0;
}

async function fetchWords() {
  const excludedInput = document.getElementById("excluded-letters");
  if (!excludedInput) return;

  const inputs = document.querySelectorAll("#inputs input");
  if (inputs.length === 0) return;

  let pattern = '';
  let knownLetters = {};

  inputs.forEach(input => {
    const val = input.value.toLowerCase();
    if (val) {
      pattern += val;
      knownLetters[val] = (knownLetters[val] || 0) + 1;
    } else {
      pattern += '?';
    }
  });

  const excludedRaw = excludedInput.value || '';
  const excluded = excludedRaw.replace(/[^a-zа-яё]/gi, '').toLowerCase().split('');

  const res = await fetch(`https://api.datamuse.com/words?sp=${pattern}`);
  const words = await res.json();

  const filtered = words
    .filter(w => w.word.match(/^[a-z]+$/))
    .filter(w => !excluded.some(ch => w.word.includes(ch)))
    .filter(w =>
      Object.entries(knownLetters).every(([char, count]) => {
        return (w.word.match(new RegExp(char, 'g')) || []).length === count;
      })
    );

  const usedLetters = new Set([
    ...excluded,
    ...Array.from(inputs).map(i => i.value.toLowerCase()).filter(Boolean)
  ]);

  const letterFrequency = {};
  const totalScore = filtered.reduce((acc, w) => acc + w.score, 0);

  filtered.forEach(({ word, score }) => {
    const unique = new Set(word);
    unique.forEach(letter => {
      if (!usedLetters.has(letter)) {
        letterFrequency[letter] = (letterFrequency[letter] || 0) + score;
      }
    });
  });

  const topLetters = Object.entries(letterFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const hintEl = document.getElementById("letter-hint");
  if (topLetters.length) {
    let hintHTML = `<b>${translations.letterHintIntro || '🔍 Возможно стоит попробовать:'}</b><br>`;
    hintHTML += topLetters.map(([l, c]) => {
      const pct = Math.round((c / totalScore) * 100);
      return `• <span style="color:#00ffff;"><b>${l.toUpperCase()}</b></span> (${pct}%)`;
    }).join('  ');
    hintHTML += `<br><br>📊 ${translations.analysisBasedOn || 'Анализ на основе'} <b>${filtered.length}</b> ${translations.words || 'слов'}`;
    hintEl.innerHTML = hintHTML;
    hintEl.style.display = 'block';
  } else {
    hintEl.innerHTML = '';
    hintEl.style.display = 'none';
  }

  document.getElementById("suggestions").innerHTML = filtered.slice(0, 20).map(w => w.word).join(', ') || 'Ничего не найдено';
}

// -------------------- GAME MODE --------------------

const wordDisplay = document.getElementById('word-display');
const input = document.getElementById('guess-input');
const errorsEl = document.getElementById('errors');
const statusEl = document.getElementById('game-status');
const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");

let hiddenWord = "", displayArray = [], guessedLetters = [], wrongLetters = [], remainingAttempts = 6;

async function startGame() {
  const res = await fetch(`https://api.datamuse.com/words?sp=${'?'.repeat(getRandomInt(5, 8))}`);
  const words = await res.json();
  const list = words
    .map(w => w.word)
    .filter(w => /^[a-z]+$/.test(w));
  hiddenWord = list[Math.floor(Math.random() * list.length)].toLowerCase();
  displayArray = Array(hiddenWord.length).fill('_');
  guessedLetters = [];
  wrongLetters = [];
  remainingAttempts = 6;
  wordDisplay.textContent = displayArray.join(' ');
  errorsEl.textContent = translations.errors + ": —";
  statusEl.textContent = "";
  statusEl.style.display = 'none';
  clearCanvas();
  input.disabled = false;
  input.focus();
}

input.addEventListener("input", () => {
  const letter = input.value.toLowerCase();
  input.value = '';
  if (!letter.match(/[a-z]/) || letter.length !== 1) return;
  if (guessedLetters.includes(letter)) {
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 300);
    return;
  }
  guessedLetters.push(letter);
  if (hiddenWord.includes(letter)) {
    hiddenWord.split('').forEach((ch, idx) => {
      if (ch === letter) displayArray[idx] = letter;
    });
    wordDisplay.textContent = displayArray.join(' ');
  } else {
    wrongLetters.push(letter);
    remainingAttempts--;
    drawHangman(6 - remainingAttempts);
    errorsEl.textContent = translations.errors + ": " + wrongLetters.join(', ');
  }
  checkGameStatus();
});

function checkGameStatus() {
  if (!displayArray.includes('_')) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = `🎉 ${translations.victory || 'Победа! Слово'}: <b>${hiddenWord}</b><br><button onclick="startGame()" class="btn btn-primary">${translations.playAgain || 'Сыграть снова'}</button>`;
    input.disabled = true;
  } else if (remainingAttempts <= 0) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = `💀 ${translations.defeat || 'Проигрыш. Было'}: <b>${hiddenWord}</b><br><button onclick="startGame()" class="btn btn-primary">${translations.playAgain || 'Сыграть снова'}</button>`;
    wordDisplay.textContent = hiddenWord.split('').join(' ');
    input.disabled = true;
  }
}

function drawHangman(stage) {
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 3;
  switch (stage) {
    case 1: ctx.beginPath(); ctx.moveTo(10, 240); ctx.lineTo(190, 240); ctx.stroke(); break;
    case 2: ctx.beginPath(); ctx.moveTo(50, 240); ctx.lineTo(50, 20); ctx.stroke(); break;
    case 3: ctx.beginPath(); ctx.moveTo(50, 20); ctx.lineTo(150, 20); ctx.lineTo(150, 50); ctx.stroke(); break;
    case 4: ctx.beginPath(); ctx.arc(150, 70, 20, 0, Math.PI * 2); ctx.stroke(); break;
    case 5: ctx.beginPath(); ctx.moveTo(150, 90); ctx.lineTo(150, 150); ctx.stroke(); break;
    case 6:
      ctx.beginPath();
      ctx.moveTo(150, 110); ctx.lineTo(120, 130);
      ctx.moveTo(150, 110); ctx.lineTo(180, 130);
      ctx.moveTo(150, 150); ctx.lineTo(130, 190);
      ctx.moveTo(150, 150); ctx.lineTo(170, 190);
      ctx.stroke();
      break;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// INIT
window.addEventListener('DOMContentLoaded', () => {
  getAvailableLanguages();
  loadLocale();

  const btnContainer = document.getElementById("length-buttons");

  for (let i = 3; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.onclick = () => selectLength(i, btn);
    btnContainer.appendChild(btn);
  }

  document.getElementById('lang-select').addEventListener('change', e => {
    toggleLanguage(e.target.value);
  });
});

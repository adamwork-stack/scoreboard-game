/**
 * Deal or No Deal Scoreboard - Browser Game
 * Run via local server (e.g. npx serve .) to load images from game-assets/
 */

const VALUES = [10, 20, 30, 50, 60, 75, 100, 150, 200, 1000];
const CASES_PER_ROUND = [3, 2, 2, 1];
const MAX_ROUND = 4;

let state = {
  folder: null,
  round: 1,
  casesLeft: 0,
  eliminated: [],
  phase: 'select',  // 'select' | 'playing' | 'round-over' | 'deal-prompt' | 'game-over'
  imagesLoaded: false
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function init() {
  const folderModal = $('#folder-modal');
  const folderBtns = $$('.folder-buttons button');
  const gameBoard = $('#game-board');
  const cards = $$('.card');

  folderBtns.forEach(btn => {
    btn.addEventListener('click', () => selectFolder(parseInt(btn.dataset.folder, 10)));
  });

  cards.forEach(card => {
    card.addEventListener('click', () => handleCardClick(parseInt(card.dataset.index, 10)));
  });

  document.addEventListener('keydown', handleKeydown);
}

async function selectFolder(num) {
  state.folder = num;
  state.phase = 'playing';
  state.round = 1;
  state.casesLeft = CASES_PER_ROUND[0];
  state.eliminated = [];

  $('#folder-modal').classList.remove('active');
  $('#game-board').classList.remove('hidden');

  await loadImages(num);
  revealAllCards();
  updateUI();
}

const PLACEHOLDER_BASE = 'https://picsum.photos/seed';
const PLACEHOLDER_IDS = ['briefcase', 'case', 'box', 'prize', 'vault', 'treasure', 'reward', 'bonus', 'jackpot', 'win'];

async function loadImages(folderNum) {
  const base = `game-assets/${folderNum}`;
  const cards = $$('.card');

  const loads = cards.map((card, i) => {
    const idx = String(i + 1).padStart(2, '0');
    const customSrc = `${base}/${idx}.jpg`;
    const fallbackSrc = `${PLACEHOLDER_BASE}/${PLACEHOLDER_IDS[i]}-${folderNum}/300/400`;
    const front = card.querySelector('.card-front');
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        front.style.backgroundImage = `url(${customSrc})`;
        resolve();
      };
      img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => {
          front.style.backgroundImage = `url(${fallbackSrc})`;
          resolve();
        };
        fallback.onerror = () => {
          front.style.backgroundImage = 'none';
          front.style.backgroundColor = '#2a1a1a';
          resolve();
        };
        fallback.src = fallbackSrc;
      };
      img.src = customSrc;
    });
  });

  await Promise.all(loads);
  state.imagesLoaded = true;
}

function revealAllCards() {
  $$('.card').forEach(card => {
    card.classList.remove('revealed', 'eliminated');
  });
  setTimeout(() => {
    $$('.card').forEach(card => card.classList.add('revealed'));
  }, 100);
}

function handleCardClick(index) {
  if (state.phase !== 'playing') return;
  if (state.eliminated.includes(index)) return;
  if (state.casesLeft <= 0) return;

  state.eliminated.push(index);
  state.casesLeft--;

  const card = $(`.card[data-index="${index}"]`);
  card.classList.remove('revealed');
  card.classList.add('eliminated');

  updateUI();

  if (state.casesLeft === 0) {
    state.phase = 'deal-prompt';
    $('#deal-prompt').classList.remove('hidden');
  }
}

function handleKeydown(e) {
  if (e.key.toLowerCase() === 'z') {
    resetGame();
    return;
  }

  if (state.phase === 'deal-prompt') {
    if (e.code === 'Space') {
      e.preventDefault();
      noDeal();
      return;
    }
    if (e.key.toLowerCase() === 'd') {
      e.preventDefault();
      deal();
      return;
    }
  }

  if (state.phase === 'round-over') {
    if (e.code === 'Space') {
      e.preventDefault();
      advanceRound();
      return;
    }
  }
}

function noDeal() {
  $('#deal-prompt').classList.add('hidden');
  playSound('no-deal');
  showOverlay('round-over.png');
  state.phase = 'round-over';
}

function deal() {
  $('#deal-prompt').classList.add('hidden');
  playSound('deal');
  showOverlay('deal.png');
  state.phase = 'game-over';
}

function playSound(name) {
  const audio = new Audio(`game-assets/sounds/${name}.mp3`);
  audio.play().catch(() => {});
}

function showOverlay(imageName) {
  const overlay = $('#overlay');
  const img = $('#overlay-image');
  img.src = `game-assets/${imageName}`;
  img.onerror = () => { img.src = ''; };
  overlay.classList.remove('hidden');
}

function advanceRound() {
  const overlay = $('#overlay');
  overlay.classList.add('hidden');

  state.round++;
  if (state.round > MAX_ROUND) {
    state.round = MAX_ROUND;
  }
  state.casesLeft = CASES_PER_ROUND[state.round - 1];
  state.phase = 'playing';

  updateUI();
}

function updateUI() {
  $('#round-display').textContent = state.round;
  $('#cases-display').textContent = state.casesLeft;

  const inPlay = VALUES.filter((_, i) => !state.eliminated.includes(i));
  const avg = inPlay.length > 0
    ? inPlay.reduce((a, b) => a + b, 0) / inPlay.length
    : 0;
  const avg75 = avg * 0.75;

  $('#average-display').textContent = '$' + avg.toFixed(2);
  $('#avg75-display').textContent = '$' + avg75.toFixed(2);
}

function resetGame() {
  $('#overlay').classList.add('hidden');
  $('#deal-prompt').classList.add('hidden');
  $('#game-board').classList.add('hidden');
  $('#folder-modal').classList.add('active');

  state = {
    folder: null,
    round: 1,
    casesLeft: 0,
    eliminated: [],
    phase: 'select',
    imagesLoaded: false
  };
}

init();

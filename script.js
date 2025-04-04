/**
 * Modern Tic Tac Toe Game
 * A complete game with sound effects, vibration, and animations
 */

// Game constants
const VIBRATION_SHORT = 20;
const VIBRATION_MEDIUM = 40;
const VIBRATION_LONG = 80;

// Winning emoji variations
const WIN_EMOJIS = ['🎉', '🎊', '🏆', '🥇', '🙌', '✨'];
const DRAW_EMOJIS = ['🤝', '🔄', '🎮', '🎯'];

// Winning combinations (indexes)
const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let lastWinner = null;
let scores = {
    X: 0,
    O: 0
};

// Settings
let settings = {
    soundEnabled: true,
    vibrationEnabled: true,
    vibrationIntensity: 50,
    isDarkMode: false
};

// Audio paths and cache
const AUDIO_PATHS = {
    place: 'audio/place.mp3',
    win: 'audio/win.mp3',
    draw: 'audio/draw.mp3',
    click: 'audio/click.mp3',
    error: 'audio/error.mp3'
};
let audioCache = {};

// DOM Elements
let cells, status, xScore, oScore, gameOverModal, gameOverText, settingsModal;
let newGameBtn, resetScoreBtn, settingsBtn, modalActionBtn, darkModeToggle;
let soundToggle, vibrationToggle, vibrationIntensity, intensityValue;
let modalCloseBtns;

// Initialize game on DOM content loaded
document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('Initializing game...');
    
    // Get DOM elements
    cells = document.querySelectorAll('.cell');
    status = document.querySelector('.status');
    xScore = document.querySelector('.x-score');
    oScore = document.querySelector('.o-score');
    gameOverModal = document.getElementById('gameOverModal');
    settingsModal = document.getElementById('settingsModal');
    gameOverText = gameOverModal.querySelector('.modal-text');
    
    // Buttons
    newGameBtn = document.getElementById('newGameBtn');
    resetScoreBtn = document.getElementById('resetScoreBtn');
    settingsBtn = document.querySelector('.settings-btn');
    modalActionBtn = gameOverModal.querySelector('.modal-action-btn');
    modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    
    // Settings DOM elements
    darkModeToggle = document.getElementById('darkModeToggle');
    soundToggle = document.getElementById('soundToggle');
    vibrationToggle = document.getElementById('vibrationToggle');
    vibrationIntensity = document.getElementById('vibrationIntensity');
    intensityValue = document.getElementById('intensityValue');
    
    // Add event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    newGameBtn.addEventListener('click', startNewGame);
    resetScoreBtn.addEventListener('click', resetScore);
    settingsBtn.addEventListener('click', () => openModal(settingsModal));
    modalActionBtn.addEventListener('click', () => { closeModal(gameOverModal); startNewGame(); });
    modalCloseBtns.forEach(btn => btn.addEventListener('click', (e) => closeModal(e.target.closest('.modal'))));
    
    // Settings event listeners
    darkModeToggle.addEventListener('change', toggleDarkMode);
    soundToggle.addEventListener('change', toggleSound);
    vibrationToggle.addEventListener('change', toggleVibration);
    vibrationIntensity.addEventListener('input', updateVibrationIntensity);
    
    // Load settings from storage
    loadSettings();
    
    // Apply initial theme
    applyTheme();
    
    console.log('Game initialized successfully');
}

function handleCellClick(event) {
    // Get clicked cell element
    const cell = event.target;
    
    // Get cell index from data attribute
    const index = parseInt(cell.getAttribute('data-index'));
    if (isNaN(index)) {
        console.error('Invalid cell index', cell);
        return;
    }
    
    // Check if valid move
    if (board[index] !== '' || !gameActive) {
        // Play error sound
        playSound('error');
        vibrate(VIBRATION_SHORT / 2);
        return;
    }
    
    // Update board and UI
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    
    // Play sound and vibrate
    playSound('place');
    vibrate(VIBRATION_SHORT);
    
    // Check for win or draw
    if (checkWin()) {
        endGame(false);
    } else if (checkDraw()) {
        endGame(true);
    } else {
        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }
}

function checkWin() {
    for (const combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            // Highlight winning cells
            combo.forEach(index => {
                document.querySelector(`.cell[data-index="${index}"]`).classList.add('winning');
            });
            return combo;
        }
    }
    return false;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}

function endGame(isDraw) {
    gameActive = false;
    lastWinner = isDraw ? null : currentPlayer;
    
    // Update UI
    if (!isDraw) {
        // Update score
        scores[currentPlayer]++;
        updateScoreDisplay();
        
        // Play win sound
        playSound('win');
        vibrate(VIBRATION_LONG);
        
        // Create confetti
        createConfetti(20);
        
        // Show win message
        const randomEmoji = WIN_EMOJIS[Math.floor(Math.random() * WIN_EMOJIS.length)];
        gameOverText.textContent = `Player ${currentPlayer} wins! ${randomEmoji}`;
    } else {
        // Play draw sound
        playSound('draw');
        vibrate(VIBRATION_MEDIUM);
        
        // Show draw message
        const randomEmoji = DRAW_EMOJIS[Math.floor(Math.random() * DRAW_EMOJIS.length)];
        gameOverText.textContent = `It's a draw! ${randomEmoji}`;
    }
    
    // Show game over modal
    setTimeout(() => {
        openModal(gameOverModal);
    }, 1000);
}

function startNewGame() {
    // Reset game state
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Clear cells
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });
    
    // Set starting player (winner goes first, or X if it was a draw)
    currentPlayer = lastWinner || 'X';
    
    // Play click sound
    playSound('click');
    vibrate(VIBRATION_SHORT);
    
    // Update status display
    updateStatus();
}

function resetScore() {
    scores.X = 0;
    scores.O = 0;
    updateScoreDisplay();
    
    // Play click sound
    playSound('click');
    vibrate(VIBRATION_SHORT);
}

function updateStatus() {
    status.textContent = `Player ${currentPlayer}'s turn`;
    status.className = 'status';
    status.classList.add(`${currentPlayer.toLowerCase()}-turn`);
}

function updateScoreDisplay() {
    xScore.textContent = scores.X;
    oScore.textContent = scores.O;
}

function openModal(modal) {
    modal.classList.add('open');
    playSound('click');
}

function closeModal(modal) {
    modal.classList.remove('open');
    playSound('click');
}

function loadSettings() {
    try {
        // Try to load from localStorage
        const savedSettings = localStorage.getItem('tictactoe-settings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        } else {
            // Detect system dark mode preference as default if not saved
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            settings.isDarkMode = prefersDarkMode;
        }
        
        // Apply settings to UI
        darkModeToggle.checked = settings.isDarkMode;
        soundToggle.checked = settings.soundEnabled;
        vibrationToggle.checked = settings.vibrationEnabled;
        vibrationIntensity.value = settings.vibrationIntensity;
        intensityValue.textContent = settings.vibrationIntensity;
        
        console.log('Settings loaded:', settings);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function saveSettings() {
    try {
        localStorage.setItem('tictactoe-settings', JSON.stringify(settings));
        console.log('Settings saved:', settings);
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

function toggleDarkMode() {
    settings.isDarkMode = darkModeToggle.checked;
    applyTheme();
    saveSettings();
    vibrate(VIBRATION_SHORT);
}

function applyTheme() {
    console.log('Applying theme, dark mode:', settings.isDarkMode);
    if (settings.isDarkMode) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
    }
}

function toggleSound() {
    settings.soundEnabled = soundToggle.checked;
    saveSettings();
    vibrate(VIBRATION_SHORT);
}

function toggleVibration() {
    settings.vibrationEnabled = vibrationToggle.checked;
    saveSettings();
    
    // Provide feedback if vibration is enabled
    if (settings.vibrationEnabled) {
        vibrate(VIBRATION_SHORT);
    }
}

function updateVibrationIntensity() {
    settings.vibrationIntensity = vibrationIntensity.value;
    intensityValue.textContent = settings.vibrationIntensity;
    saveSettings();
    
    // Provide feedback with new intensity
    if (settings.vibrationEnabled) {
        vibrate(VIBRATION_SHORT);
    }
}

function vibrate(duration) {
    if (!settings.vibrationEnabled) return;
    
    // Apply vibration intensity setting (scale 1-100)
    const scaledDuration = Math.round(duration * (settings.vibrationIntensity / 50));
    
    if (navigator.vibrate) {
        navigator.vibrate(scaledDuration);
    }
}

function playSound(soundName) {
    if (!settings.soundEnabled) return;
    
    try {
        if (audioCache[soundName]) {
            // Reset to beginning if already playing
            audioCache[soundName].currentTime = 0;
            audioCache[soundName].play().catch(e => console.error(`Error playing ${soundName} sound:`, e));
        } else {
            // Create and play audio if not cached
            const audio = new Audio(AUDIO_PATHS[soundName]);
            audio.play().catch(e => console.error(`Error playing ${soundName} sound:`, e));
            audioCache[soundName] = audio;
        }
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}

function createConfetti(count) {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Random position, color, and animation duration
        const x = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        
        confetti.style.left = `${x}%`;
        confetti.style.backgroundColor = color;
        confetti.style.animationDelay = `${delay}s`;
        
        container.appendChild(confetti);
        
        // Remove confetti after animation ends
        setTimeout(() => {
            confetti.remove();
        }, 3000 + (delay * 1000));
    }
}
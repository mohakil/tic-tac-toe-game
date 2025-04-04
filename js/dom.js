/**
 * Modern Tic Tac Toe Game - DOM Elements
 * DOM element selection and initialization
 */

// ========== DOM ELEMENTS ==========
const bodyElement = document.body;
const boardElement = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusElement = document.getElementById('status');
const newGameBtn = document.getElementById('newGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const settingsBtn = document.getElementById('settingsBtn');
const xScoreElement = document.getElementById('xScore');
const oScoreElement = document.getElementById('oScore');

// Modal Elements
const resultModal = document.getElementById('resultModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const playAgainBtn = document.getElementById('playAgainBtn');
const settingsModal = document.getElementById('settingsModal');

// Settings Elements
const soundToggle = document.getElementById('soundToggle');
const vibrationToggle = document.getElementById('vibrationToggle');
const vibrationSlider = document.getElementById('vibrationIntensity');
const intensityValueSpan = document.getElementById('intensityValue');
const modalCloseBtns = document.querySelectorAll('[data-close-modal]');
const themeToggleInput = document.getElementById('themeToggleInput');

// Audio context for enhanced audio effects
let audioContext;
let audioEnabled = false;

// Try to initialize the audio context
try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioEnabled = true;
} catch (e) {
    console.warn('Web Audio API not supported in this browser');
    audioEnabled = false;
}

/**
 * Validates that all required DOM elements are present
 * @returns {boolean} True if all required elements exist
 */
function validateDOMElements() {
    return !!(
        settingsBtn && 
        themeToggleInput && 
        soundToggle && 
        vibrationToggle && 
        vibrationSlider && 
        cells.length === 9 && 
        newGameBtn && 
        resetScoreBtn && 
        playAgainBtn && 
        modalCloseBtns.length > 0
    );
}

// Export DOM elements for use in other modules
export {
    bodyElement,
    boardElement,
    cells,
    statusElement,
    newGameBtn,
    resetScoreBtn,
    settingsBtn,
    xScoreElement,
    oScoreElement,
    resultModal,
    modalTitle,
    modalText,
    playAgainBtn,
    settingsModal,
    soundToggle,
    vibrationToggle,
    vibrationSlider,
    intensityValueSpan,
    modalCloseBtns,
    themeToggleInput,
    audioContext,
    audioEnabled,
    validateDOMElements
}; 
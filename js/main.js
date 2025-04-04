/**
 * Modern Tic Tac Toe Game - Main Module
 * Initializes the game and sets up event listeners
 */

import {
    boardElement, cells, newGameBtn, resetScoreBtn, settingsModal, 
    settingsBtn, soundToggle, vibrationToggle,
    vibrationSlider, themeToggleInput,
    resultModal, playAgainBtn, modalCloseBtns,
    validateDOMElements
} from './dom.js';

import {
    handleCellClick, resetGame, resetScores, initGame
} from './game.js';

import {
    toggleTheme, handleSoundToggle, handleVibrationToggle,
    handleVibrationSliderInput, handleVibrationSliderChange,
    initSettings, updateSliderFill
} from './ui.js';

import { initAudioContext, preloadSounds } from './audio.js';

/**
 * Initialize the application
 */
function initialize() {
    console.log('Initializing game...');
    
    // Validate DOM elements
    if (!validateDOMElements()) {
        console.error('DOM elements missing - game cannot initialize properly');
        alert('Error loading game components. Please reload the page.');
        return;
    }
    
    // Log ready state
    console.log('DOM elements found, setting up game...');
    
    // Initialize audio
    initAudioContext();
    preloadSounds();
    
    // Initialize game board
    initGame();
    
    // Initialize settings
    initSettings();
    
    // Add direct click handler to each cell
    cells.forEach((cell) => {
        cell.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'), 10);
            console.log(`Cell ${index} clicked`);
            handleCellClick(this, index);
        });
    });
    
    // Game buttons events
    newGameBtn.addEventListener('click', function() {
        console.log('New Game button clicked');
        resetGame();
    });
    
    resetScoreBtn.addEventListener('click', function() {
        console.log('Reset Score button clicked');
        resetScores();
    });
    
    // Settings button events
    settingsBtn.addEventListener('click', function() {
        console.log('Settings button clicked');
        settingsModal.classList.add('show');
    });
    
    // Closing modals
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Modal close button clicked');
            const modal = this.closest('.modal');
            if (modal) modal.classList.remove('show');
        });
    });
    
    // Result modal events
    playAgainBtn.addEventListener('click', function() {
        console.log('Play Again button clicked');
        resultModal.classList.remove('show');
        resetGame();
    });
    
    // Settings events
    themeToggleInput.addEventListener('change', toggleTheme);
    soundToggle.addEventListener('change', handleSoundToggle);
    vibrationToggle.addEventListener('change', handleVibrationToggle);
    vibrationSlider.addEventListener('input', handleVibrationSliderInput);
    vibrationSlider.addEventListener('change', handleVibrationSliderChange);
    
    // Initialize slider visuals
    updateSliderFill(vibrationSlider);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            console.log('Modal background clicked, closing modal');
            e.target.classList.remove('show');
        }
    });
    
    // Keyboard accessibility
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('Escape key pressed, closing any open modals');
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }
    });
    
    console.log('Game initialization complete!');
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing game...');
    initialize();
}); 
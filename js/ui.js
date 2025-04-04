/**
 * Modern Tic Tac Toe Game - UI Utilities
 * Functions for handling UI interactions
 */

import { 
    bodyElement, boardElement, resultModal, modalTitle, 
    modalText, xScoreElement, oScoreElement, 
    intensityValueSpan, statusElement, vibrationSlider
} from './dom.js';

import { 
    vibrationIntensity, isDarkMode, isSoundEnabled, isVibrationEnabled,
    VIBRATION_DEFAULT_INTENSITY, WIN_EMOJIS, DRAW_EMOJIS, currentPlayer
} from './constants.js';

import { playSound, triggerHapticFeedback } from './audio.js';

/**
 * Shows the game result modal
 * @param {boolean} isWin - Whether the result is a win or draw
 */
function showResultModal(isWin) {
    modalTitle.textContent = isWin ? `Player ${currentPlayer} Wins!` : "It's a Draw!";
    modalText.textContent = isWin ? 'Congratulations!' : 'No winner this time.';
    resultModal.classList.add('show');
}

/**
 * Creates confetti animation for winning
 */
function createConfetti() {
    const rect = boardElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${centerX + (Math.random() - 0.5) * rect.width * 0.8}px`;
        confetti.style.top = `${centerY + (Math.random() - 0.5) * rect.height * 0.5}px`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
        
        const delay = Math.random() * 0.5;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
        
        document.body.appendChild(confetti);
        
        // Clean up confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000 + delay * 1000);
    }
}

/**
 * Updates the slider fill based on its value
 * @param {HTMLInputElement} slider - The slider element to update
 */
function updateSliderFill(slider) {
    if (!slider) return;
    
    const rootStyle = getComputedStyle(document.documentElement);
    const currentTrackColor = rootStyle.getPropertyValue('--slider-bg').trim() || '#e2e8f0';
    const currentFillColor = rootStyle.getPropertyValue('--primary-color').trim() || '#6366f1';
    
    // Calculate percentage
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const clampedVal = Math.max(min, Math.min(val, max));
    const range = max - min;
    const percentage = range > 0 ? ((clampedVal - min) / range) * 100 : 0;
    
    if (slider.disabled) {
        slider.style.backgroundImage = 'none';
        return;
    }
    
    // Apply gradient for visual feedback
    slider.style.backgroundImage = `linear-gradient(to right, ${currentFillColor} 0%, ${currentFillColor} ${percentage}%, ${currentTrackColor} ${percentage}%, ${currentTrackColor} 100%)`;
}

/**
 * Toggles dark mode
 */
function toggleTheme() {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
    localStorage.setItem('ticTacToeTheme', isDarkMode ? 'dark' : 'light');
    playSound('click');
    triggerHapticFeedback();
}

/**
 * Applies theme based on setting
 * @param {boolean} darkMode - Whether to apply dark mode
 */
function applyTheme(darkMode) {
    bodyElement.classList.toggle('dark-mode', darkMode);
    document.getElementById('themeToggleInput').checked = darkMode;
    document.getElementById('themeToggleInput').setAttribute('aria-checked', darkMode);
    
    // Update sliders when theme changes
    requestAnimationFrame(() => {
        updateSliderFill(vibrationSlider);
    });
}

/**
 * Handles sound toggle changes
 * @param {Event} e - Change event
 */
function handleSoundToggle(e) {
    isSoundEnabled = e.target.checked;
    e.target.setAttribute('aria-checked', isSoundEnabled);
    localStorage.setItem('tTTSound', isSoundEnabled);
    
    if (isSoundEnabled) {
        playSound('click');
    }
}

/**
 * Handles vibration toggle changes
 * @param {Event} e - Change event
 */
function handleVibrationToggle(e) {
    isVibrationEnabled = e.target.checked;
    e.target.setAttribute('aria-checked', isVibrationEnabled);
    localStorage.setItem('tTTVibration', isVibrationEnabled);
    
    vibrationSlider.disabled = !isVibrationEnabled;
    updateSliderFill(vibrationSlider);
    
    if (isVibrationEnabled) {
        triggerHapticFeedback();
    }
}

/**
 * Handles vibration slider input
 * @param {Event} e - Input event
 */
function handleVibrationSliderInput(e) {
    vibrationIntensity = parseInt(e.target.value, 10);
    intensityValueSpan.textContent = vibrationIntensity;
    updateSliderFill(e.target);
}

/**
 * Handles vibration slider change (when user stops moving it)
 */
function handleVibrationSliderChange() {
    localStorage.setItem('tTTVibIntensity', vibrationIntensity);
    triggerHapticFeedback();
}

/**
 * Initializes settings from localStorage
 */
function initSettings() {
    const savedSound = localStorage.getItem('tTTSound');
    const savedVib = localStorage.getItem('tTTVibration');
    const savedInt = localStorage.getItem('tTTVibIntensity');
    const savedTheme = localStorage.getItem('ticTacToeTheme');
    
    // Initialize sound setting
    isSoundEnabled = savedSound !== null ? JSON.parse(savedSound) : true;
    document.getElementById('soundToggle').checked = isSoundEnabled;
    document.getElementById('soundToggle').setAttribute('aria-checked', isSoundEnabled);
    
    // Initialize vibration setting
    isVibrationEnabled = savedVib !== null ? JSON.parse(savedVib) : true;
    document.getElementById('vibrationToggle').checked = isVibrationEnabled;
    document.getElementById('vibrationToggle').setAttribute('aria-checked', isVibrationEnabled);
    
    // Initialize vibration intensity
    vibrationIntensity = savedInt !== null ? parseInt(savedInt, 10) : VIBRATION_DEFAULT_INTENSITY;
    document.getElementById('vibrationIntensity').value = vibrationIntensity;
    document.getElementById('intensityValue').textContent = vibrationIntensity;
    document.getElementById('vibrationIntensity').disabled = !isVibrationEnabled;
    
    // Initialize theme
    isDarkMode = savedTheme ? savedTheme === 'dark' : 
                (window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false);
    applyTheme(isDarkMode);
    
    // Update slider fill
    updateSliderFill(vibrationSlider);
}

// Export UI functions
export {
    showResultModal,
    createConfetti,
    updateSliderFill,
    toggleTheme,
    applyTheme,
    handleSoundToggle,
    handleVibrationToggle,
    handleVibrationSliderInput,
    handleVibrationSliderChange,
    initSettings
}; 
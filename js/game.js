/**
 * Modern Tic Tac Toe Game - Core Game Logic
 * Core game functionality: handling moves, checking for wins, updating UI
 */

import { 
    WINNING_COMBINATIONS,
    board, currentPlayer, gameActive, scores
} from './constants.js';

import {
    cells, statusElement, xScoreElement, oScoreElement
} from './dom.js';

import { playSound, triggerHapticFeedback } from './audio.js';
import { createConfetti, showResultModal } from './ui.js';

/**
 * Initializes the game state
 */
function initGame() {
    // Reset the board
    for (let i = 0; i < board.length; i++) {
        board[i] = '';
    }
    
    // Set initial state
    currentPlayer = 'X';
    gameActive = true;
    
    // Update UI
    updateStatus();
    
    // Clear any existing cell classes
    cells.forEach((cell, index) => {
        cell.className = 'cell';
        cell.setAttribute('data-index', index); // Make sure data-index is set
        cell.setAttribute('aria-label', `Cell ${index + 1}, empty`);
    });
    
    // Display initial scores
    xScoreElement.textContent = scores.X;
    oScoreElement.textContent = scores.O;
}

/**
 * Handles cell click event
 * @param {HTMLElement} cell - The cell element
 * @param {number} index - The cell index
 */
function handleCellClick(cell, index) {
    // If index is not provided, try to get it from data-index attribute
    if (index === undefined || index === null) {
        index = parseInt(cell.getAttribute('data-index'), 10);
        if (isNaN(index)) return; // Exit if we can't determine the index
    }
    
    // Ignore if cell already filled or game not active
    if (board[index] !== '' || !gameActive) return;
    
    // Update the board state and UI
    board[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.setAttribute('aria-label', `Cell ${index + 1}, ${currentPlayer}`);
    
    // Sound and haptic feedback
    playSound('place');
    triggerHapticFeedback();
    
    // Check game state
    const winningCombo = checkWin();
    if (winningCombo) {
        gameActive = false;
        updateScore();
        highlightWinningCells(winningCombo);
        showResultModal(true);
        playSound('win');
        triggerHapticFeedback(null, 'win');
        createConfetti();
    } else if (checkDraw()) {
        gameActive = false;
        showResultModal(false);
        playSound('draw');
        triggerHapticFeedback(null, 'draw');
        statusElement.textContent = "It's a Draw!";
    } else {
        // Switch player and update status
        switchPlayer();
        updateStatus();
    }
}

/**
 * Checks if there is a win
 * @returns {number[]|null} - Winning combination indexes or null
 */
function checkWin() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const combo = WINNING_COMBINATIONS[i];
        if (board[combo[0]] && 
            board[combo[0]] === board[combo[1]] && 
            board[combo[0]] === board[combo[2]]) {
            return combo;
        }
    }
    return null;
}

/**
 * Checks if there is a draw
 * @returns {boolean} - True if draw
 */
function checkDraw() {
    return board.every(cell => cell !== '');
}

/**
 * Updates the game status UI
 */
function updateStatus() {
    statusElement.className = `status ${currentPlayer.toLowerCase()}-turn`;
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

/**
 * Updates the score for the current player
 */
function updateScore() {
    scores[currentPlayer]++;
    xScoreElement.textContent = scores.X;
    oScoreElement.textContent = scores.O;
}

/**
 * Switches the current player
 */
function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Resets the game board
 */
function resetGame() {
    // Reset game state
    for (let i = 0; i < board.length; i++) {
        board[i] = '';
    }
    
    currentPlayer = 'X';
    gameActive = true;
    updateStatus();
    
    // Reset UI
    cells.forEach((cell, index) => {
        cell.className = 'cell';
        cell.setAttribute('aria-label', `Cell ${index + 1}, empty`);
    });
    
    // Clean up any remaining confetti
    document.querySelectorAll('.confetti').forEach(c => c.remove());
    
    // Play sound
    playSound('click');
    triggerHapticFeedback();
}

/**
 * Resets both player scores to zero
 */
function resetScores() {
    scores.X = 0;
    scores.O = 0;
    xScoreElement.textContent = '0';
    oScoreElement.textContent = '0';
    resetGame();
    playSound('click');
    triggerHapticFeedback();
}

/**
 * Highlights winning cells
 * @param {number[]} winningCombo - Array of indexes of winning cells
 */
function highlightWinningCells(winningCombo) {
    winningCombo.forEach(index => cells[index].classList.add('win'));
}

// Export game functions
export {
    initGame,
    handleCellClick,
    checkWin,
    checkDraw,
    updateStatus,
    updateScore,
    switchPlayer,
    resetGame,
    resetScores,
    highlightWinningCells
}; 
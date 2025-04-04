/**
 * Modern Tic Tac Toe Game - Constants
 * Constants, game state variables, and DOM elements
 */

// ========== CONSTANTS ==========
const VIBRATION_DEFAULT_INTENSITY = 7;
const VIBRATION_MAX_INTENSITY = 20;
const VIBRATION_MIN_INTENSITY = 1;
const VIBRATION_STEP = 1;
const EMOJI_SETTINGS = '⚙️';
const WIN_EMOJIS = ['🎉', '🏆', '🥇', '✨', '👑'];
const DRAW_EMOJIS = ['🤝', '🔄', '⚖️', '🎮', '🎯'];

// Winning combinations (indexes of the board array)
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

// ========== GAME STATE ==========
var board = ['', '', '', '', '', '', '', '', ''];
var currentPlayer = 'X';
var gameActive = true;
var scores = { X: 0, O: 0 };

// ========== SETTINGS STATE ==========
var isSoundEnabled = true;
var isVibrationEnabled = true;
var vibrationIntensity = VIBRATION_DEFAULT_INTENSITY;
var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

// ========== AUDIO SETTINGS ==========
// Define sound paths
const soundPaths = {
    place: 'audio/place.mp3',
    win: 'audio/win.mp3',
    draw: 'audio/draw.mp3',
    click: 'audio/click.mp3',
    error: 'audio/error.mp3'
};

// Audio elements cache
const audioCache = {};

// Export constants and state variables
export {
    VIBRATION_DEFAULT_INTENSITY,
    VIBRATION_MAX_INTENSITY,
    VIBRATION_MIN_INTENSITY,
    VIBRATION_STEP,
    EMOJI_SETTINGS,
    WIN_EMOJIS,
    DRAW_EMOJIS,
    WINNING_COMBINATIONS,
    board,
    currentPlayer,
    gameActive,
    scores,
    isSoundEnabled,
    isVibrationEnabled,
    vibrationIntensity,
    isDarkMode,
    soundPaths,
    audioCache
}; 
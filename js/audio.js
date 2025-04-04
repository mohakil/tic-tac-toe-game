/**
 * Modern Tic Tac Toe Game - Audio Utilities
 * Functions for handling sound and haptic feedback
 */

import { 
    isSoundEnabled, isVibrationEnabled, vibrationIntensity, 
    soundPaths, audioCache
} from './constants.js';
import { audioContext, audioEnabled } from './dom.js';

/**
 * Loads and caches a sound file
 * @param {string} name - Name of the sound to load from soundPaths
 * @returns {HTMLAudioElement|null} - The audio element or null if error
 */
function loadSound(name) {
    // Return cached audio if available
    if (audioCache[name]) return audioCache[name];
    
    // Check if sound path exists
    if (!soundPaths[name]) {
        console.warn(`Sound path "${name}" missing.`);
        return null;
    }
    
    try {
        const audio = new Audio(soundPaths[name]);
        audio.preload = 'auto';
        
        // Only add event listener once during creation
        audio.addEventListener('error', (e) => {
            console.error(`Error loading sound "${name}" from ${soundPaths[name]}. File exists? Path correct?`, e);
            delete audioCache[name]; // Remove from cache on error
        }, { once: true }); 
        
        audio.load();
        audioCache[name] = audio;
        return audio;
    } catch (e) {
        console.error(`Audio create error "${name}":`, e);
        return null;
    }
}

/**
 * Plays a sound
 * @param {string} name - Name of the sound to play
 */
function playSound(name) {
    if (!isSoundEnabled) return;
    
    const audio = loadSound(name);
    if (!audio) return;
    
    // Create a clone if we're already playing this sound
    if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
        const clone = audio.cloneNode();
        clone.play().catch(e => {
            if (e.name !== 'NotAllowedError') {
                console.error(`Play error "${name}":`, e);
            }
        });
        clone.addEventListener('ended', () => clone.remove(), { once: true });
    } else {
        audio.currentTime = 0;
        audio.play().catch(e => {
            if (e.name !== 'NotAllowedError') {
                console.error(`Play error "${name}":`, e);
            }
        });
    }
}

/**
 * Triggers device vibration if enabled and supported
 * @param {number} intensity - Optional custom intensity
 * @param {string} pattern - Optional vibration pattern
 */
function triggerHapticFeedback(intensity = null, pattern = null) {
    if (!isVibrationEnabled || !('vibrate' in navigator)) return;
    
    try {
        if (pattern === 'win') {
            // Special pattern for winning
            navigator.vibrate([vibrationIntensity, 100, vibrationIntensity, 100, vibrationIntensity * 2]);
        } else if (pattern === 'draw') {
            // Pattern for draw
            navigator.vibrate([vibrationIntensity, 200, vibrationIntensity]);
        } else if (pattern === 'error') {
            // Pattern for errors
            navigator.vibrate([vibrationIntensity * 2, 50, vibrationIntensity]);
        } else {
            // Standard vibration
            const finalIntensity = intensity !== null ? intensity : vibrationIntensity;
            if (finalIntensity > 0) {
                navigator.vibrate(finalIntensity);
            }
        }
    } catch (e) {
        console.warn("Haptic failed:", e);
    }
}

/**
 * Initialize audio context on user interaction to comply with browser autoplay policies
 */
function initAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext successfully resumed');
        }).catch(error => {
            console.warn('Failed to resume AudioContext', error);
        });
    }
}

/**
 * Preloads all sound files defined in soundPaths
 */
function preloadSounds() {
    Object.keys(soundPaths).forEach(loadSound);
}

// Export audio functions
export {
    loadSound,
    playSound,
    triggerHapticFeedback,
    initAudioContext,
    preloadSounds
}; 
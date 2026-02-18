// ============================================
// STOLEN ROSES - Interactive Mystery Game
// ============================================

// DEBUG mode - set to true to reveal hotspot locations
const DEBUG = false;

// ============================================
// HOTSPOT DATA (Easy to edit)
// ============================================
const hotspots = [
    {
        id: 'rose-1',
        top: '25%',
        left: '15%',
        width: '6%',
        height: '8%',
        clue: 'The first petal whispers of beginnings, stolen from the thorns of ambition.'
    },
    {
        id: 'rose-2',
        top: '40%',
        left: '60%',
        width: '6%',
        height: '8%',
        clue: 'The second rose blooms in shadow, where desire grows without light.'
    },
    {
        id: 'rose-3',
        top: '65%',
        left: '30%',
        width: '6%',
        height: '8%',
        clue: 'Third among the stolen: beauty taken, never earned.'
    },
    {
        id: 'rose-4',
        top: '50%',
        left: '80%',
        width: '6%',
        height: '8%',
        clue: 'Four petals fall when greed plucks what was never meant to be possessed.'
    },
    {
        id: 'rose-5',
        top: '20%',
        left: '70%',
        width: '6%',
        height: '8%',
        clue: 'The fifth rose remembers the gardener\'s touch, before the theft.'
    },
    {
        id: 'rose-6',
        top: '70%',
        left: '65%',
        width: '6%',
        height: '8%',
        clue: 'The final fragment reveals: what you take withers; what you grow endures.'
    }
];

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    foundHotspots: new Set(),
    musicPlaying: false
};

// Roman numeral conversion
const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

// ============================================
// DOM ELEMENTS
// ============================================
let hotspotContainer;
let modal;
let modalCloseBtn;
let clueText;
let progressIndicator;
let musicToggle;
let unlockButton;
let finalMessage;
let audio;
let darkOverlay;
let wingShadow;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM references
    hotspotContainer = document.getElementById('hotspot-container');
    modal = document.getElementById('modal');
    modalCloseBtn = document.getElementById('modal-close');
    clueText = document.getElementById('clue-text');
    progressIndicator = document.getElementById('progress-indicator');
    musicToggle = document.getElementById('music-toggle');
    unlockButton = document.getElementById('unlock-button');
    finalMessage = document.getElementById('final-message');

    // Create overlay elements (referenced in CSS)
    createOverlayElements();

    // Initialize audio
    audio = new Audio('./assets/music.mp3');
    audio.loop = true;
    audio.volume = 0.3;

    // Inject hotspots into the DOM
    injectHotspots();

    // Set up event listeners
    setupEventListeners();

    // Initialize progress display
    updateProgress();
});

// ============================================
// CREATE OVERLAY ELEMENTS
// ============================================
function createOverlayElements() {
    // Create dark overlay
    darkOverlay = document.createElement('div');
    darkOverlay.id = 'dark-overlay';
    document.body.appendChild(darkOverlay);

    // Create wing shadow overlay
    wingShadow = document.createElement('div');
    wingShadow.id = 'wing-shadow';
    document.body.appendChild(wingShadow);
}

// ============================================
// INJECT HOTSPOTS
// ============================================
function injectHotspots() {
    hotspots.forEach(hotspot => {
        const hotspotDiv = document.createElement('div');
        hotspotDiv.classList.add('hotspot');
        if (DEBUG) {
            hotspotDiv.classList.add('debug');
        }
        hotspotDiv.dataset.id = hotspot.id;
        hotspotDiv.style.top = hotspot.top;
        hotspotDiv.style.left = hotspot.left;
        hotspotDiv.style.width = hotspot.width;
        hotspotDiv.style.height = hotspot.height;

        // Click handler for each hotspot
        hotspotDiv.addEventListener('click', () => handleHotspotClick(hotspot));

        hotspotContainer.appendChild(hotspotDiv);
    });

    // One-time hint shimmer on first hotspot
    setTimeout(() => {
        const firstHotspot = hotspotContainer.querySelector('.hotspot');
        if (firstHotspot) {
            firstHotspot.classList.add('hint');
            setTimeout(() => {
                firstHotspot.classList.remove('hint');
            }, 1200);
        }
    }, 900);
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Modal close button
    modalCloseBtn.addEventListener('click', closeModal);

    // Close modal on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Music toggle
    musicToggle.addEventListener('click', toggleMusic);

    // Unlock button
    unlockButton.addEventListener('click', revealFinalMessage);
}

// ============================================
// HOTSPOT INTERACTION
// ============================================
function handleHotspotClick(hotspot) {
    // Mark as found (if not already)
    const wasAlreadyFound = state.foundHotspots.has(hotspot.id);

    if (!wasAlreadyFound) {
        state.foundHotspots.add(hotspot.id);
        updateProgress();
        triggerFlickerEffect();

        // Check if all hotspots found
        if (state.foundHotspots.size === hotspots.length) {
            setTimeout(showUnlockButton, 800);
        }
    }

    // Show modal with clue
    openModal(hotspot.clue);
}

// ============================================
// MODAL MANAGEMENT
// ============================================
function openModal(clueMessage) {
    clueText.textContent = clueMessage;
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
}

// ============================================
// PROGRESS TRACKING
// ============================================
function updateProgress() {
    const count = state.foundHotspots.size;
    progressIndicator.textContent = `Fragments: ${count} / ${hotspots.length}`;
}

// ============================================
// VISUAL EFFECTS
// ============================================
function triggerFlickerEffect() {
    // Fade in dark overlay and wing shadow
    darkOverlay.classList.add('active');
    wingShadow.classList.add('active');

    // Fade out after 600ms
    setTimeout(() => {
        darkOverlay.classList.remove('active');
        wingShadow.classList.remove('active');
    }, 600);
}

// ============================================
// UNLOCK BUTTON
// ============================================
function showUnlockButton() {
    unlockButton.classList.remove('hidden');
}

// ============================================
// FINAL MESSAGE
// ============================================
function revealFinalMessage() {
    const finalTitle = document.getElementById('final-title');
    const finalText = document.getElementById('final-text');

    finalTitle.textContent = 'The Garden Remembers';
    finalText.textContent = 'You were never meant to steal beauty. You were meant to cultivate it.';

    finalMessage.classList.remove('hidden');

    // Fade out music if playing
    if (state.musicPlaying) {
        fadeOutMusic();
    }
}

// ============================================
// MUSIC CONTROL
// ============================================
function toggleMusic() {
    if (state.musicPlaying) {
        // Pause music
        audio.pause();
        state.musicPlaying = false;
        musicToggle.textContent = '🔇';
    } else {
        // Play music
        audio.play().catch(err => {
            console.log('Audio play failed:', err);
            musicToggle.textContent = '🔇';
        });
        state.musicPlaying = true;
        musicToggle.textContent = '🔊';
    }
}

function fadeOutMusic() {
    const fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
            audio.volume -= 0.05;
        } else {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeInterval);
        }
    }, 100);
}

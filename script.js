const cursor = document.querySelector('.cursor');
const magneticBtns = document.querySelectorAll('.magnetic-btn');

// Disable right click
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Disable dragging
window.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

// Cursor click pulse
// Changed mousedown to document and added z-index handling to ensure
// the click always registers regardless of what element is being clicked.
document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
});

// Smoothly follow the mouse with the custom cursor
window.addEventListener('mousemove', (e) => {
    // We use a small delay via requestAnimationFrame or direct transform for perf
    cursor.style.opacity = '1';
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Show cursor when entering window
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

// Magnetic Button Logic - removed old code to prevent duplicate logic
// The logic has been merged into the block below that adds the sound design
// keeping the file clean.

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeSpan = themeToggle.querySelector('span');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeSpan.textContent = 'light';
    } else {
        themeSpan.textContent = 'dark';
    }
});

// Sound design for magnetic buttons
const hoverSound = new Audio('data:audio/wav;base64,UklGRqAFAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='); // Placeholder base64 for a silent/empty file to not throw errors if audio generation isn't supported via text. 
// A real ticking sound should be added here, or dynamically generated using Web Audio API for a cleaner approach:

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playHoverSound() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Pitch
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05); // Snap pitch down quickly
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.01); // Very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.05);
}


// Modified Magnetic Button Logic slightly to add sound
magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        const position = btn.getBoundingClientRect();
        
        // Calculate distance from center of element
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;
        
        // Increase multiplier so the links stick to cursor a bit further
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        const span = btn.querySelector('span');
        if(span) span.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        playHoverSound();
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        const span = btn.querySelector('span');
        if(span) span.style.transform = 'translate(0px, 0px)';
        cursor.classList.remove('hovering');
    });
});

// Local Time Logic
function updateTime() {
    const timeElement = document.getElementById('local-time');
    if (!timeElement) return;
    
    // Edinburgh timezone
    const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    timeElement.textContent = `EDI ${formatter.format(new Date())}`;
}

// Initial call and interval
setInterval(updateTime, 1000);
updateTime();
setInterval(updateTime, 1000);
const cursor = document.querySelector('.cursor');
const magneticBtns = document.querySelectorAll('.magnetic-btn');

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

window.addEventListener('dragstart', (e) => {
    e.preventDefault();
});

document.addEventListener('mousedown', () => {
    cursor.classList.add('clicking');
});
document.addEventListener('mouseup', () => {
    cursor.classList.remove('clicking');
});

window.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

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

const hoverSound = new Audio('data:audio/wav;base64,UklGRqAFAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA='); 


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

magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
        const position = btn.getBoundingClientRect();
        
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        // Add a smooth short transition for tracking so it feels "pulled"
        btn.style.transition = 'transform 0.1s linear';
        const span = btn.querySelector('span');
        if(span) span.style.transition = 'transform 0.1s linear';
        
        btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        if(span) span.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        // Let CSS handle the scale transition
        playHoverSound();
    });

    btn.addEventListener('mouseleave', () => {
        // Restore smooth springing transition when mouse leaves
        btn.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        btn.style.transform = 'translate(0px, 0px)';
        
        const span = btn.querySelector('span');
        if(span) {
            span.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            span.style.transform = 'translate(0px, 0px)';
        }
        
        cursor.classList.remove('hovering');
    });
});

function updateTime() {
    const timeElement = document.getElementById('local-time');
    if (!timeElement) return;
    
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
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

// Smoothly follow the mouse with the custom cursor
window.addEventListener('mousemove', (e) => {
    // We use a small delay via requestAnimationFrame or direct transform for perf
    cursor.style.opacity = '1';
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
});

// Hide cursor when leaving window
window.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

// Magnetic Button Logic
magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        // Skip magnetic effect on mobile/touch devices since they don't have mousemove
        if (window.innerWidth <= 768) return;

        const position = btn.getBoundingClientRect();
        
        // Calculate distance from center of element
        const x = e.pageX - position.left - position.width / 2;
        const y = e.pageY - position.top - position.height / 2;

        // Move the button container slightly towards the mouse (more sticky)
        btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        
        // Move the text inside a bit further for a 3D parallax effect
        const span = btn.querySelector('span');
        if(span) span.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
    });

    btn.addEventListener('mouseleave', () => {
        // Reset everything on mouse leave
        btn.style.transform = 'translate(0px, 0px)';
        const span = btn.querySelector('span');
        if(span) span.style.transform = 'translate(0px, 0px)';
        
        cursor.classList.remove('hovering');
    });
});

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
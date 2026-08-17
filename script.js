const cursor = document.querySelector('.cursor');
const magneticBtns = document.querySelectorAll('.magnetic-btn');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    themeSpan.textContent = isDark ? 'light' : 'dark';
}

const storedTheme = localStorage.getItem('theme');
const isDark = storedTheme
    ? storedTheme === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(isDark);

themeToggle.addEventListener('click', () => {
    const nowDark = !document.body.classList.contains('dark-mode');
    applyTheme(nowDark);
    localStorage.setItem('theme', nowDark ? 'dark' : 'light');
});

magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        if (prefersReducedMotion || window.innerWidth <= 768) return;
        const position = btn.getBoundingClientRect();

        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        btn.style.transition = 'transform 0.1s linear';
        const span = btn.querySelector('span');
        if(span) span.style.transition = 'transform 0.1s linear';

        btn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        if(span) span.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });

    btn.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
    });

    btn.addEventListener('mouseleave', () => {
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

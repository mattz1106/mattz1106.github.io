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

const DISCORD_ID = '800592695843356702';
const spotifyStatus = document.getElementById('spotify-status');

function connectLanyard() {
    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    
    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.op === 1) {
            ws.send(JSON.stringify({
                op: 2,
                d: { subscribe_to_id: DISCORD_ID }
            }));
        } else if (data.op === 0) {
            updateSpotify(data.d);
        }
    };

    ws.onclose = () => {
        setTimeout(connectLanyard, 5000); 
    };
}

function updateSpotify(data) {
    if (data.spotify) {
        const title = data.spotify.song;
        const artist = data.spotify.artist.split(';')[0]; 
        
        spotifyStatus.innerHTML = `<span>♫ Currently Listening: ${title} - ${artist}</span>`;
    } else {
        spotifyStatus.innerHTML = `<span>♫ Currently Listening: Not playing</span>`;
    }
}

connectLanyard();

magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768) return;
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
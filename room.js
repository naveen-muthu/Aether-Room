document.addEventListener('DOMContentLoaded', () => {
    // Day/Night Toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const weatherText = document.querySelector('#weather-display span');
    const weatherIcon = document.querySelector('#weather-display i');

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('night-mode');
        const isNight = body.classList.contains('night-mode');
        
        if (isNight) {
            themeIcon.className = 'fa-solid fa-sun';
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Day Mode';
            weatherText.innerText = 'Night Rain';
            weatherIcon.className = 'fa-solid fa-cloud-moon-rain';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Night Mode';
            weatherText.innerText = 'Sunny Day';
            weatherIcon.className = 'fa-solid fa-sun';
        }
    });

    // Toast Notification System
    const toast = document.getElementById('toast');
    let toastTimeout;

    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Interactive Objects Logic
    
    // 1. Radio
    const radio = document.getElementById('radio');
    let isPlaying = false;
    radio.addEventListener('click', () => {
        isPlaying = !isPlaying;
        const icon = radio.querySelector('i');
        if (isPlaying) {
            icon.classList.add('fa-beat-fade');
            showToast('Playing: Lofi Hip Hop Radio 🎧');
        } else {
            icon.classList.remove('fa-beat-fade');
            showToast('Music Paused ⏸️');
        }
    });

    // 2. Lamp
    const lamp = document.getElementById('lamp');
    lamp.addEventListener('click', () => {
        showToast('Toggled ambient lighting 💡');
    });

    // 3. Cat
    const cat = document.getElementById('cat');
    let isPurring = false;
    cat.addEventListener('click', () => {
        isPurring = !isPurring;
        const icon = cat.querySelector('i');
        if (isPurring) {
            icon.classList.add('fa-bounce');
            showToast('The cat is purring... 🐾');
        } else {
            icon.classList.remove('fa-bounce');
            showToast('The cat went back to sleep 💤');
        }
    });

    // 4. Window
    const windowArea = document.getElementById('window');
    windowArea.addEventListener('click', () => {
        showToast('Opened weather controls panel 🌧️');
    });

    // 5. Bookshelf
    const bookshelf = document.getElementById('bookshelf');
    bookshelf.addEventListener('click', () => {
        showToast('Browsing saved relaxation mixes 📚');
    });
});

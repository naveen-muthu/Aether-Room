document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Live Clock & Date ---
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayStr = days[now.getDay()];
        
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        const dateStr = now.toLocaleDateString(undefined, dateOptions);

        const timeEl = document.getElementById("time");
        if(timeEl) {
            timeEl.textContent = timeStr;
            document.getElementById("day").textContent = dayStr;
            document.getElementById("date").textContent = dateStr;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. Theme Toggle ---
    const themeBtn = document.getElementById("theme-toggle");
    const overlay = document.getElementById("main-overlay");
    let isNight = true;

    if(themeBtn) {
        themeBtn.addEventListener("click", () => {
            isNight = !isNight;
            const icon = themeBtn.querySelector('.action-icon i');
            const text = themeBtn.querySelector('.action-text p');

            if(isNight) {
                overlay.classList.remove('day-mode');
                icon.className = 'fa-solid fa-moon';
                text.textContent = 'Toggle day/night';
            } else {
                overlay.classList.add('day-mode');
                icon.className = 'fa-solid fa-sun';
                text.textContent = 'Day mode active';
            }
        });
    }

    // --- 3. Scene Switching ---
    const sceneCards = document.querySelectorAll('.scene-card');
    const mainBg = document.getElementById('main-bg');
    const statScene = document.getElementById('stat-scene');

    sceneCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove active from all
            sceneCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            card.classList.add('active');

            // Update Background (currently uses roombg.png for all as per constraints, 
            // but structure allows for specific images)
            const bgImage = card.getAttribute('data-bg');
            if(mainBg) {
                // To simulate changing background, we reset animation
                mainBg.style.filter = 'blur(10px)';
                setTimeout(() => {
                    mainBg.style.backgroundImage = `url('${bgImage}')`;
                    mainBg.style.filter = 'blur(0px)';
                }, 300);
            }

            // Update Status Card
            const sceneName = card.querySelector('h3').textContent;
            if(statScene) statScene.textContent = sceneName;
        });
    });

    // --- 4. Ambient Audio ---
    const soundItems = document.querySelectorAll(".sound-item");
    const statSound = document.getElementById('stat-sound');
    let currentAudioId = null;

    soundItems.forEach(item => {
        const audioId = item.getAttribute('data-audio');
        const audioEl = document.getElementById(audioId);
        const playBtn = item.querySelector('.play-btn');
        const playIcon = playBtn.querySelector('i');
        const slider = item.querySelector('.volume-slider');
        const soundName = item.getAttribute('data-name');

        if(audioEl && slider) {
            audioEl.volume = slider.value;
        }

        if(slider) {
            slider.addEventListener('input', (e) => {
                e.stopPropagation();
                if(audioEl) audioEl.volume = e.target.value;
            });
        }

        item.addEventListener("click", (e) => {
            // Prevent triggering if clicked directly on slider
            if(e.target.classList.contains('volume-slider')) return;
            
            if(!audioEl) return;

            const isPlaying = !audioEl.paused;

            if(isPlaying) {
                fadeOutAndPause(audioEl);
                item.classList.remove('active');
                playIcon.className = 'fa-solid fa-play';
                if(currentAudioId === audioId) {
                    currentAudioId = null;
                    if(statSound) statSound.textContent = 'None';
                }
            } else {
                // Pause others
                if(currentAudioId && currentAudioId !== audioId) {
                    const prevAudio = document.getElementById(currentAudioId);
                    const prevItem = document.querySelector(`.sound-item[data-audio="${currentAudioId}"]`);
                    if(prevAudio) fadeOutAndPause(prevAudio);
                    if(prevItem) {
                        prevItem.classList.remove('active');
                        prevItem.querySelector('.play-btn i').className = 'fa-solid fa-play';
                    }
                }

                audioEl.volume = slider.value;
                audioEl.play().catch(e => console.log('Audio play failed:', e));
                item.classList.add('active');
                playIcon.className = 'fa-solid fa-pause';
                currentAudioId = audioId;
                
                if(statSound) statSound.textContent = soundName;
            }
        });
        
        if(playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                item.click();
            });
        }
    });

    function fadeOutAndPause(audioElement) {
        let vol = audioElement.volume;
        const fadeInterval = setInterval(() => {
            if (vol > 0.05) {
                vol -= 0.05;
                audioElement.volume = vol;
            } else {
                clearInterval(fadeInterval);
                audioElement.pause();
                const slider = document.querySelector(`.sound-item[data-audio="${audioElement.id}"] .volume-slider`);
                if(slider) audioElement.volume = slider.value;
            }
        }, 50);
    }

    // --- 5. Focus Timer (Pomodoro) ---
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    
    const statTime = document.getElementById('stat-time');
    const statSessions = document.getElementById('stat-sessions');

    let timerInterval = null;
    const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds
    let timeLeft = DEFAULT_TIME;
    let isTimerRunning = false;
    
    let totalFocusSeconds = 0;
    let completedSessions = 0;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        if(timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
    }

    function updateStats() {
        if(statTime) {
            const minutes = Math.floor(totalFocusSeconds / 60);
            statTime.textContent = `${minutes}m`;
        }
        if(statSessions) statSessions.textContent = completedSessions;
    }

    if(startBtn && pauseBtn && resetBtn) {
        startBtn.addEventListener('click', () => {
            if(isTimerRunning) return;
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if(timeLeft > 0) {
                    timeLeft--;
                    totalFocusSeconds++;
                    updateTimerDisplay();
                    
                    // Update stats every minute
                    if(totalFocusSeconds % 60 === 0) updateStats();
                } else {
                    // Session Complete
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    completedSessions++;
                    updateStats();
                    timeLeft = DEFAULT_TIME; // Auto reset for next session
                    updateTimerDisplay();
                    
                    // Play a soft bell or notification sound here if available
                    alert("Focus session completed! Great job.");
                }
            }, 1000);
        });

        pauseBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            isTimerRunning = false;
        });

        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            isTimerRunning = false;
            timeLeft = DEFAULT_TIME;
            updateTimerDisplay();
        });
    }

    // --- 6. Floating Particles ---
    const particlesContainer = document.getElementById('particles');
    function createParticles() {
        if(!particlesContainer) return;
        const numParticles = 20;
        for(let i=0; i<numParticles; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 10 + 10;

            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.left = `${left}%`;
            p.style.animationDelay = `${delay}s`;
            p.style.animationDuration = `${duration}s`;

            particlesContainer.appendChild(p);
        }
    }
    createParticles();

    console.log("Infinity Room Dashboard initialized successfully.");
});
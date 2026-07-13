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

    // --- 3. Scene Architecture ---
    const scenes = {
        rain: {
            video: "video/rainroom1.mp4",
            audio: "audio/rainroom1audio.mp3",
            title: "Rain Room",
            sound: "Rain Ambience"
        },
        train: {
            video: "video/endlesstrainroom1.mp4",
            audio: "audio/endlesstrainroom1audio.mp3",
            title: "Endless Train",
            sound: "Train Ambience"
        },
        fire: {
            video: "video/fireplaceroom1.mp4",
            audio: "audio/fireplaceroom1audio.mp3",
            title: "Fireplace Room",
            sound: "Fireplace Crackle"
        },
        natural: {
            video: "video/naturalroom1.mp4",
            audio: "audio/naturalroom1audio.mp3",
            title: "Natural Room",
            sound: "Nature Ambience"
        }
    };

    const sceneCards = document.querySelectorAll('.scene-card');
    const bgVideo = document.getElementById('bgVideo');
    const ambientAudio = document.getElementById('ambientAudio');
    const statScene = document.getElementById('stat-scene');
    const statSound = document.getElementById('stat-sound');
    
    // Scene Audio Controls
    const sceneSoundControl = document.getElementById('scene-sound-control');
    const sceneSoundName = document.getElementById('scene-sound-name');
    const sceneVolumeSlider = document.getElementById('scene-volume');
    const scenePlayBtn = document.getElementById('scene-play-btn');
    const scenePlayIcon = scenePlayBtn ? scenePlayBtn.querySelector('i') : null;
    const miniVideo = document.getElementById('mini-video');

    // Immersive Mode Elements Sync
    const immersiveRoomName = document.getElementById('immersive-room-name');
    const immersivePlayBtn = document.getElementById('immersive-play-btn');
    const immersivePlayIcon = immersivePlayBtn ? immersivePlayBtn.querySelector('i') : null;
    const immersiveVolume = document.getElementById('immersive-volume');

    sceneCards.forEach(card => {
        card.addEventListener('click', () => {
            const sceneId = card.getAttribute('data-scene');
            const sceneData = scenes[sceneId];

            if (!sceneData) return; // Only process if we have data for this scene

            // Remove active from all
            sceneCards.forEach(c => c.classList.remove('active'));
            // Add active to clicked
            card.classList.add('active');

            // Fade Transition for Video
            if (bgVideo) {
                bgVideo.style.opacity = '0';
                setTimeout(() => {
                    bgVideo.src = sceneData.video;
                    bgVideo.style.opacity = '1';
                }, 500);
            }
            
            // Update Mini Player Video
            if (miniVideo) {
                miniVideo.src = sceneData.video;
            }

            // Update Audio Source and Autoplay
            if (ambientAudio) {
                ambientAudio.src = sceneData.audio;
                ambientAudio.volume = sceneVolumeSlider ? sceneVolumeSlider.value : 0.5;
                ambientAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
                
                // Show controls and set to active/playing state
                if (scenePlayIcon) {
                    scenePlayIcon.className = 'fa-solid fa-pause';
                }
                if (immersivePlayIcon) {
                    immersivePlayIcon.className = 'fa-solid fa-pause';
                }
                if (sceneSoundControl) {
                    sceneSoundControl.style.display = 'flex';
                    // Trigger reflow to ensure transition works if needed
                    void sceneSoundControl.offsetWidth;
                    sceneSoundControl.classList.add('active');
                }
            }

            // Update Status Panel
            if (statScene) statScene.textContent = sceneData.title;
            if (statSound) statSound.textContent = sceneData.sound;
            if (sceneSoundName) sceneSoundName.textContent = sceneData.sound;
            if (immersiveRoomName) immersiveRoomName.textContent = sceneData.title;
        });
    });

    // --- 4. Ambient Audio Controls ---
    if (ambientAudio && sceneVolumeSlider) {
        ambientAudio.volume = sceneVolumeSlider.value;

        sceneVolumeSlider.addEventListener('input', (e) => {
            ambientAudio.volume = e.target.value;
            if (immersiveVolume) immersiveVolume.value = e.target.value;
        });
    }

    if (scenePlayBtn && ambientAudio) {
        scenePlayBtn.addEventListener("click", () => {
            const isPlaying = !ambientAudio.paused;

            if (isPlaying) {
                ambientAudio.pause();
                if (sceneSoundControl) sceneSoundControl.classList.remove('active');
                if (scenePlayIcon) scenePlayIcon.className = 'fa-solid fa-play';
                if (immersivePlayIcon) immersivePlayIcon.className = 'fa-solid fa-play';
            } else {
                ambientAudio.volume = sceneVolumeSlider.value;
                ambientAudio.play().catch(e => console.log('Audio play failed:', e));
                if (sceneSoundControl) sceneSoundControl.classList.add('active');
                if (scenePlayIcon) scenePlayIcon.className = 'fa-solid fa-pause';
                if (immersivePlayIcon) immersivePlayIcon.className = 'fa-solid fa-pause';
            }
        });
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

    // --- 7. Immersive Mode Logic ---
    const enterFullscreenBtn = document.getElementById('enter-fullscreen-btn');
    const enterFullscreenBtn2 = document.getElementById('enter-fullscreen-btn-2');
    const exitFullscreenBtn = document.getElementById('exit-fullscreen-btn');

    function toggleFullscreen() {
        const elem = document.documentElement;
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(err => {
                    console.log(`Error attempting to enable full-screen mode: ${err.message}`);
                });
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
            document.body.classList.add('immersive-mode');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            document.body.classList.remove('immersive-mode');
        }
    }

    if (enterFullscreenBtn) {
        enterFullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    if (enterFullscreenBtn2) {
        enterFullscreenBtn2.addEventListener('click', toggleFullscreen);
    }
    
    if (exitFullscreenBtn) {
        exitFullscreenBtn.addEventListener('click', () => {
             if (document.fullscreenElement || document.webkitFullscreenElement) {
                 if (document.exitFullscreen) {
                     document.exitFullscreen();
                 } else if (document.webkitExitFullscreen) {
                     document.webkitExitFullscreen();
                 }
             }
             document.body.classList.remove('immersive-mode');
        });
    }

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            document.body.classList.remove('immersive-mode');
        } else {
            document.body.classList.add('immersive-mode');
        }
    });

    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement) {
            document.body.classList.remove('immersive-mode');
        } else {
            document.body.classList.add('immersive-mode');
        }
    });

    // Sync Immersive UI Audio Controls
    if (immersiveVolume && ambientAudio) {
        immersiveVolume.addEventListener('input', (e) => {
            ambientAudio.volume = e.target.value;
            if (sceneVolumeSlider) sceneVolumeSlider.value = e.target.value;
        });
    }
    if (immersivePlayBtn && ambientAudio) {
        immersivePlayBtn.addEventListener('click', () => {
            if (ambientAudio.paused) {
                ambientAudio.play();
                if (immersivePlayIcon) immersivePlayIcon.className = 'fa-solid fa-pause';
                if (scenePlayIcon) scenePlayIcon.className = 'fa-solid fa-pause';
            } else {
                ambientAudio.pause();
                if (immersivePlayIcon) immersivePlayIcon.className = 'fa-solid fa-play';
                if (scenePlayIcon) scenePlayIcon.className = 'fa-solid fa-play';
            }
        });
    }

    console.log("Infinity Room Dashboard initialized successfully.");
});
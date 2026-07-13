document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Background Video Setup (from room.html/room.js style) ---
    const bgVideo = document.getElementById('bgVideo');
    if(bgVideo) {
        // Just setting a default relaxing video if available, or keep it empty as roombg.png is fallback
        // Using a similar path as room.js
        bgVideo.src = "video/rainroom1.mp4"; 
    }

    // --- 2. Floating Particles (from room.js) ---
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

    // --- 3. Upload Drag & Drop Logic ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const previewSection = document.getElementById('preview-section');
    const mediaPreviewContainer = document.getElementById('media-preview-container');
    const fileNameDisplay = document.getElementById('file-name-display');
    const btnClear = document.getElementById('btn-clear');
    const btnUpload = document.getElementById('btn-upload');
    const toast = document.getElementById('toast');

    let currentFile = null;

    if(dropZone && fileInput) {
        // Click to browse
        dropZone.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        // Handle drop
        dropZone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        });

        // Handle file input change
        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });
    }

    function handleFiles(files) {
        if(files.length > 0) {
            const file = files[0];
            const validTypes = ['video/mp4', 'audio/mpeg', 'audio/mp3', 'image/jpeg', 'image/png'];
            
            if(validTypes.includes(file.type)) {
                currentFile = file;
                showPreview(file);
            } else {
                showToast('<i class="fa-solid fa-triangle-exclamation"></i> Invalid file type! Please upload MP4, MP3, JPG, or PNG.');
            }
        }
    }

    function showPreview(file) {
        mediaPreviewContainer.innerHTML = '';
        fileNameDisplay.textContent = file.name;
        
        const fileURL = URL.createObjectURL(file);

        if(file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = fileURL;
            video.controls = true;
            video.autoplay = true;
            video.muted = true;
            video.loop = true;
            mediaPreviewContainer.appendChild(video);
        } 
        else if (file.type.startsWith('audio/')) {
            const audio = document.createElement('audio');
            audio.src = fileURL;
            audio.controls = true;
            // Add a visual for audio
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-music';
            icon.style.fontSize = '4rem';
            icon.style.color = 'var(--accent-purple)';
            icon.style.marginBottom = '15px';
            
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.appendChild(icon);
            wrapper.appendChild(audio);
            
            mediaPreviewContainer.appendChild(wrapper);
        }
        else if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = fileURL;
            mediaPreviewContainer.appendChild(img);
        }

        dropZone.style.display = 'none';
        previewSection.style.display = 'block';
    }

    if(btnClear) {
        btnClear.addEventListener('click', () => {
            currentFile = null;
            fileInput.value = '';
            mediaPreviewContainer.innerHTML = '';
            previewSection.style.display = 'none';
            dropZone.style.display = 'block';
        });
    }

    if(btnUpload) {
        btnUpload.addEventListener('click', () => {
            if(!currentFile) {
                showToast('<i class="fa-solid fa-circle-exclamation"></i> Please select a file first.');
                return;
            }
            
            // Simulate upload process
            const originalText = btnUpload.innerHTML;
            btnUpload.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';
            btnUpload.disabled = true;

            setTimeout(() => {
                showToast('<i class="fa-solid fa-circle-check"></i> Successfully uploaded: ' + currentFile.name);
                
                // Reset
                btnClear.click();
                btnUpload.innerHTML = originalText;
                btnUpload.disabled = false;
            }, 1500);
        });
    }

    let toastTimeout;
    function showToast(message) {
        if(!toast) return;
        toast.innerHTML = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

});

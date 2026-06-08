document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadPhase = document.getElementById('upload-phase');
    const previewPhase = document.getElementById('preview-phase');
    const mediaContainer = document.getElementById('media-container');
    const fileNameDisplay = document.getElementById('file-name');
    const btnCancel = document.getElementById('btn-cancel');
    const btnApply = document.getElementById('btn-apply');
    const toast = document.getElementById('toast');
    let toastTimeout;

    // Toast Notification System
    function showToast(message) {
        toast.innerText = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Trigger file input when clicking drop zone
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // Drag and drop logic
    ['dragover', 'dragenter'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        });
    });

    ['dragleave', 'dragend', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        });
    });

    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // File input change logic
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Process the file and generate preview
    function handleFile(file) {
        // Basic validation
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            showToast('Invalid file type. Please upload an image or video.');
            return;
        }

        // Update filename display
        fileNameDisplay.innerText = file.name;

        // Clear previous media
        mediaContainer.innerHTML = '';

        // Create object URL for previewing local file securely
        const fileUrl = URL.createObjectURL(file);

        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = fileUrl;
            img.alt = 'Uploaded preview';
            mediaContainer.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = fileUrl;
            video.controls = true;
            video.autoplay = true;
            video.loop = true;
            video.muted = true; // Best practice for auto-playing previews
            mediaContainer.appendChild(video);
        }

        // Transition UI
        uploadPhase.style.display = 'none';
        previewPhase.classList.add('active');
    }

    // Cancel and go back to upload phase
    btnCancel.addEventListener('click', () => {
        // Clean up object URL from memory to prevent memory leaks
        const mediaElement = mediaContainer.querySelector('img, video');
        if (mediaElement && mediaElement.src) {
            URL.revokeObjectURL(mediaElement.src);
        }
        
        fileInput.value = ''; // Reset input
        previewPhase.classList.remove('active');
        uploadPhase.style.display = 'block';
    });

    // Apply button logic
    btnApply.addEventListener('click', () => {
        showToast('Media applied successfully!');
        // In a real application, you would persist this via localStorage/Backend 
        // and redirect the user back to the room view.
        // setTimeout(() => window.location.href = 'room.html', 1500);
    });
});

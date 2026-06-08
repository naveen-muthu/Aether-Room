document.addEventListener('DOMContentLoaded', () => {
    const sceneCards = document.querySelectorAll('.scene-card');
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

    sceneCards.forEach(card => {
        const selectBtn = card.querySelector('.btn-select');
        
        selectBtn.addEventListener('click', (e) => {
            // Prevent event from bubbling
            e.stopPropagation();

            // Reset all cards
            sceneCards.forEach(c => {
                c.classList.remove('selected');
                c.querySelector('.btn-select').innerText = 'Select Scene';
            });

            // Highlight the selected card
            card.classList.add('selected');
            selectBtn.innerText = 'Selected';

            // Provide feedback
            const sceneName = card.querySelector('h3').innerText;
            showToast(`Environment set to: ${sceneName}`);

            // In a fully integrated app, this might redirect:
            // setTimeout(() => { window.location.href = `room.html?scene=${card.dataset.scene}`; }, 1000);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Subtle parallax effect on hero content
    const heroContent = document.getElementById('hero-content');
    
    document.addEventListener('mousemove', (e) => {
        // Calculate mouse position relative to center of screen
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        
        // Move the content slightly opposite to mouse
        if(heroContent) {
            heroContent.style.transform = `translate(${-x}px, ${-y}px)`;
        }
    });

    // Intersection Observer for feature cards fade-in animation
    const cards = document.querySelectorAll('.feature-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the card is visible
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay for a nicer cascade effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        cardObserver.observe(card);
    });
});
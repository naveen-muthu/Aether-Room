// Elements
const hero = document.querySelector(".hero");
const title = document.querySelector(".title");
const enterBtn = document.querySelector(".enter-btn");

// Mouse Parallax Effect
document.addEventListener("mousemove", (e) => {

    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    hero.style.transform =
        `translate(${x}px, ${y}px)`;

});

// Fade Out Transition
enterBtn.addEventListener("click", (e) => {

    e.preventDefault();

    document.body.style.transition = "opacity 1s ease";
    document.body.style.opacity = "0";

    setTimeout(() => {
        window.location.href = "room.html";
    }, 1000);

});

// Ambient Glow Pulse
let glow = 0;

setInterval(() => {

    glow += 0.05;

    title.style.textShadow = `
        0 0 ${20 + Math.sin(glow) * 10}px rgba(255,179,0,0.8),
        0 0 ${40 + Math.sin(glow) * 15}px rgba(255,122,0,0.7),
        0 0 ${60 + Math.sin(glow) * 20}px rgba(255,122,0,0.5)
    `;

}, 50);

// Page Fade In
window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    setTimeout(() => {
        document.body.style.transition = "opacity 2s ease";
        document.body.style.opacity = "1";
    }, 100);

});
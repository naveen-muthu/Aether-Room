// Live Clock

function updateClock() {

    const now = new Date();

    const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const clock = document.getElementById("clock");

    if(clock){
        clock.textContent = time;
    }
}

setInterval(updateClock, 1000);

updateClock();


// Day / Night Toggle

const toggleBtn = document.querySelector(".toggle-btn");

let darkMode = true;

if(toggleBtn){

    toggleBtn.addEventListener("click", () => {

        if(darkMode){

            document.body.style.filter =
            "brightness(1.2)";

            toggleBtn.innerHTML =
            "☀ Day Mode";

        }
        else{

            document.body.style.filter =
            "brightness(1)";

            toggleBtn.innerHTML =
            "🌙 Night Mode";
        }

        darkMode = !darkMode;

    });

}


// Ambient Sound Cards

const soundItems =
document.querySelectorAll(".sound-item");

soundItems.forEach(item => {

    item.addEventListener("click", () => {

        soundItems.forEach(card => {
            card.style.border =
            "none";
        });

        item.style.border =
        "2px solid #ffb300";

    });

});


// Welcome Message

console.log("Infinity Room Loaded");
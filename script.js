// ===============================
// FINAL HORROR SCRIPT WITH FONT ADJUST + TOO SCARED BUTTON
// ===============================

// ELEMENTS
const jumpscare = document.getElementById("jumpscare");
const scaryImg = document.getElementById("scaryImg");
const exitBtn = document.getElementById("exitBtn");
const overlay = document.getElementById("overlay");

// RED OVERLAY (for jumpscare flash)
let redOverlay = document.createElement("div");
redOverlay.id = "redOverlay";
redOverlay.style.position = "fixed";
redOverlay.style.top = "0";
redOverlay.style.left = "0";
redOverlay.style.width = "100%";
redOverlay.style.height = "100%";
redOverlay.style.zIndex = "999";
redOverlay.style.pointerEvents = "none";
redOverlay.style.backgroundColor = "rgba(255,0,0,0.4)";
redOverlay.style.opacity = 0;
redOverlay.style.transition = "opacity 0.2s ease";
document.body.appendChild(redOverlay);

// SHADOW CREEP
let shadow = document.createElement("div");
shadow.id = "shadowCreep";
shadow.style.position = "fixed";
shadow.style.top = "0";
shadow.style.left = "0";
shadow.style.width = "100%";
shadow.style.height = "100%";
shadow.style.pointerEvents = "none";
shadow.style.background = "rgba(0,0,0,0)";
shadow.style.zIndex = "998";
shadow.style.transition = "background 3s linear";
document.body.appendChild(shadow);

// SCREAM AUDIO ELEMENTS
const sounds = [
    new Audio("sounds/scream1.mp3"),
    new Audio("sounds/scream2.mp3"),
    new Audio("sounds/scream3.mp3")
];
sounds.forEach(s => { s.volume = 1; s.muted = false; });

// SCARE IMAGES
let images = [
    "images/scare1.jpg",
    "images/scare2.jpg",
    "images/scare3.jpg"
];
let usedImages = [];

const isMobile = window.innerWidth < 600;

// ===============================
// DARK SCARY BACKGROUND + FONT ADJUST
// ===============================
const darkBg = "#111"; // main dark background
const dimRed = "rgba(120,0,0,0.3)"; // dim red flicker

setInterval(() => {
    let flickerChance = Math.random();
    if (flickerChance < 0.15) {
        document.body.style.backgroundColor = dimRed; // dim red flicker
        document.body.style.color = "#fff"; // white text
    } else {
        document.body.style.backgroundColor = darkBg; // dark gray
        document.body.style.color = "#ccc"; // light gray text
    }

    // Make all story paragraphs match body color
    document.querySelectorAll("#story p").forEach(p => {
        p.style.color = document.body.style.color;
    });

    // Glitch text always white for contrast
    const glitch = document.getElementById("glitchText");
    glitch.style.color = "#fff";
}, isMobile ? 200 : 250);

// ===============================
// RANDOM ENCOUNTERS
// ===============================
setInterval(() => {
    let chance = Math.random();
    let triggerChance = isMobile ? 0.20 : 0.15;
    if (chance < triggerChance) randomEncounter();
}, 2500);

function randomEncounter() {
    let type = Math.random();
    if (type < 0.5) triggerJumpscare();
    else if (type < 0.8) fakeOut();
    else triggerJumpscare(true);
}

function fakeOut() {
    const glitch = document.getElementById("glitchText");
    glitch.innerText = "…nakita mo yun?";
    setTimeout(() => { glitch.innerText = "wala lang."; }, 1000);
    setTimeout(() => { triggerJumpscare(); }, isMobile ? 1500 : 2000);
}

// ===============================
// JUMPSCARE FUNCTION
// ===============================
function triggerJumpscare(silent=false) {
    jumpscare.style.display = "block";
    jumpscare.classList.add("jumpscare-animate");

    if (images.length === 0) { images = usedImages; usedImages = []; }
    let index = Math.floor(Math.random() * images.length);
    let chosen = images[index];
    usedImages.push(chosen);
    images.splice(index, 1);
    scaryImg.src = chosen;

    // RANDOM POSITION
    let posX = 50 + (Math.random()*20 -10);
    let posY = 50 + (Math.random()*20 -10);
    scaryImg.style.objectPosition = `${posX}% ${posY}%`;

    if (!silent){
        // SCREAM SPAM: 1-3 screams
        let screamCount = 1 + Math.floor(Math.random()*3);
        for (let i=0; i<screamCount; i++){
            let soundIndex = Math.floor(Math.random()*sounds.length);
            setTimeout(()=>sounds[soundIndex].play().catch(()=>{}), i*100 + Math.random()*200);
        }
    }

    // RED FLASH
    flashRed();

    // SHADOW CREEP
    shadow.style.background = "rgba(0,0,0,0.7)";
    setTimeout(()=>{ shadow.style.background="rgba(0,0,0,0)"; }, 3000);

    setTimeout(()=>{
        jumpscare.style.display="none";
        jumpscare.classList.remove("jumpscare-animate");
    }, 800);
}

// RED FLASH FUNCTION
function flashRed(){
    redOverlay.style.opacity = 0.4;
    setTimeout(()=>{ redOverlay.style.opacity = 0; }, 300);
}

// ===============================
// DARKNESS OVERLAY (ambient)
// ===============================
let darkness=0;
setInterval(()=>{
    darkness += isMobile?0.04:0.03;
    if(darkness>0.7) darkness=0.7;
    overlay.style.opacity=darkness;
},3000);

// ===============================
// GLITCH TEXT (Tagalog)
// ===============================
setInterval(()=>{
    const glitch = document.getElementById("glitchText");
    const messages = [
        "Nandiyan siya.","Huwag kang lumingon.","Nakikita ka niya.",
        "Tumatagal ka masyado.","TUMAKBO.","…gumalaw siya.",
        "Bakit nandito ka pa?","Alam niya kung sino ka."
    ];
    glitch.innerText = messages[Math.floor(Math.random()*messages.length)];
}, isMobile?1500:1800);

// ===============================
// MOBILE TOUCH BONUS
// ===============================
if(isMobile){
    document.addEventListener("touchstart", ()=>{
        if(Math.random()<0.25) triggerJumpscare();
    });
}

// ===============================
// CURSOR PULL TOWARD EXIT
// ===============================
document.addEventListener("mousemove", e=>{
    let rect=exitBtn.getBoundingClientRect();
    let dx=rect.left + rect.width/2 - e.clientX;
    let dy=rect.top + rect.height/2 - e.clientY;
    let distance=Math.sqrt(dx*dx+dy*dy);
    if(distance<200){
        window.scrollBy(dx*0.002, dy*0.002);
    }
});

// ===============================
// FINAL EXIT BETRAYAL
// ===============================
exitBtn.addEventListener("click", ()=>{
    jumpscare.style.display="block";
    scaryImg.src="images/final.jpg";
    sounds[0].play().catch(()=>{});
    jumpscare.classList.add("jumpscare-animate");
});

// ===============================
// GHOST TOUCH OVERLAY
// ===============================
let ghostTouch = document.createElement("div");
ghostTouch.style.position="fixed";
ghostTouch.style.top="0";
ghostTouch.style.left="0";
ghostTouch.style.width="100%";
ghostTouch.style.height="100%";
ghostTouch.style.zIndex="995";
ghostTouch.style.pointerEvents="auto";
ghostTouch.style.background="transparent";
document.body.appendChild(ghostTouch);

ghostTouch.addEventListener("click", ()=>{
    if(Math.random()<0.15) triggerJumpscare();
});

// ===============================
// INTERACTIVE STORY TEXT TRAPS
// ===============================
document.querySelectorAll("#story p").forEach(p=>{
    if(Math.random()<0.4){ // 40% trap chance
        p.style.cursor="pointer";
        p.addEventListener("click", ()=>{
            triggerJumpscare();
        });
    }
});

// ===============================
// "TOO SCARED" BUTTON TRAP
// ===============================
let scaredBtn = document.createElement("button");
scaredBtn.innerText = "Click this button if you are too scared";
scaredBtn.id = "scaredBtn";
scaredBtn.style.position = "fixed";
scaredBtn.style.bottom = "20px";
scaredBtn.style.right = "20px";
scaredBtn.style.zIndex = "1000";
scaredBtn.style.padding = "12px 20px";
scaredBtn.style.fontSize = "16px";
scaredBtn.style.cursor = "pointer";
document.body.appendChild(scaredBtn);

scaredBtn.addEventListener("click", ()=>{
    // Force jumpscare
    triggerJumpscare();

    // Redirect after short delay
    setTimeout(()=>{
        window.location.href = "index.html"; // Change to your main site URL
    }, 1000);
});
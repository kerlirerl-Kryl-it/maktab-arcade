const playButton = document.getElementById("playButton");
const gameWindow = document.getElementById("gameWindow");

const instruction = document.getElementById("instruction");
const scoreText = document.getElementById("score");
const title = document.getElementById("title");

const cheese = document.getElementById("cheese");

const redApple = document.getElementById("redApple");
const greenApple = document.getElementById("greenApple");

const redObject = document.getElementById("redObject");
const greenObject = document.getElementById("greenObject");
const blueObject = document.getElementById("blueObject");

const redBag = document.getElementById("redBag");
const greenBag = document.getElementById("greenBag");
const blueBag = document.getElementById("blueBag");
const yellowBag = document.getElementById("yellowBag");

const textInput = document.getElementById("textInput");
const validateBtn = document.getElementById("validateBtn");

const keyboard = document.getElementById("keyboard");
const objectCounter = document.getElementById("objectCounter");

const arrowHint = document.getElementById("arrowHint");
const retroCursor = document.getElementById("retroCursor");
const particles = document.getElementById("particles");
const nextBtn = document.getElementById("nextBtn");
const nextSound = new Audio("./sounds/nextbtn.mp3");

const levelCompleteSound = new Audio("./sounds/level-complete.mp3");
const levelUpSound = new Audio("./sounds/levelup.mp3");
const dropSound = new Audio("./sounds/drop.mp3");
const playSound = new Audio("./sounds/play.mp3");
playSound.volume = 0.4;
const loadingSound = new Audio("./sounds/loading.mp3");
loadingSound.volume = 0.2;
const nextBtnSound = new Audio("./sounds/nextbtn.mp3");
nextBtnSound.volume = 0.35;
const nextLevelVoice = new Audio("./sounds/nextlevel-voice.mp3");

// Sons de passage de niveau
const levelSound1 = new Audio("./sounds/level-1.mp3");
const levelSound2 = new Audio("./sounds/level-2.mp3");
const levelSound3 = new Audio("./sounds/level-3.mp3");
const levelSound4 = new Audio("./sounds/level-4.mp3");
const levelSound5 = new Audio("./sounds/level-5.mp3");

// Sons de changement de rang
const rankSound1 = new Audio("./sounds/rank1.mp3");
const rankSound2 = new Audio("./sounds/rank2.mp3");
const rankSound3 = new Audio("./sounds/rank3.mp3");
const rankSound4 = new Audio("./sounds/rank4.mp3");
const rankSound5 = new Audio("./sounds/rank5.mp3");

//Sons des dizaines (voix)
const decadeVoice1 = new Audio("./sounds/nextlevelvoice.mp3");
const decadeVoice2 = new Audio("./sounds/nextlevelvoice.mp3");
const decadeVoice3 = new Audio("./sounds/nextlevelvoice.mp3");
const decadeVoice4 = new Audio("./sounds/nextlevelvoice.mp3");
const decadeVoice5 = new Audio("./sounds/nextlevelvoice.mp3");

// Victoire
const victorySound = new Audio("./sounds/victory.mp3");

let victoryLoop = null;

function playDropSound(){
    dropSound.currentTime = 0;
    dropSound.play();
}

/* Sons par niveaux */

function playLevelSound(level){

    let sound;

    if(level <= 10){
        sound = levelSound1;
    }
    else if(level <= 20){
        sound = levelSound2;
    }
    else if(level <= 30){
        sound = levelSound3;
    }
    else if(level <= 40){
        sound = levelSound4;
    }
    else{
        sound = levelSound5;
    }

    sound.currentTime = 0;
    sound.play();
}

function playDecadeVoice(level){

    let sound = null;

    switch(level){
        case 10: sound = decadeVoice1; break;
        case 20: sound = decadeVoice2; break;
        case 30: sound = decadeVoice3; break;
        case 40: sound = decadeVoice4; break;
        case 50: sound = decadeVoice5; break;
    }

    if(sound){
        sound.currentTime = 0;
        sound.play();
    }
}

function playRankSound(rank){
    switch(rank){
        case "Intermédiaire": rankSound2.play(); break;
        case "Clavier":       rankSound3.play(); break;
        case "Expert":        rankSound4.play(); break;
        case "Champion":      rankSound5.play(); break;
    }
}

/* =========================
   VARIABLES
========================= */

let level = 1;
let score = 0;
let mouseMoved = false;
let leftClicked = false;
let rightClicked = false;
let sequence = 0;
let canValidate = true;
let lastRightClick = 0;
let objectsPlaced = 0;
let objectsTotal = 0;
let dragging = null;
let offsetX = 0;
let offsetY = 0;
let currentRank = "Débutant";
let level11Done = false;
let clickCount = 0;
let level7CheeseClicked = false;

let keyPressed = false;
let wordValidated = false;
let cheeseDropped = false;
let dragOrderIndex = 0;

let timerInterval = null;
let timerSeconds = 0;

let wasDragging = false;
let dragStartX = 0;
let dragStartY = 0;

let levelTimeouts = [];

let wordIndex = 0;

let level21Handler = null;
// Stocke le listener du niveau 46 pour pouvoir le supprimer
let level46ClickHandler = null;

/* =========================
   BOUTON PLAY
========================= */

playButton.addEventListener("click", () => {

    if(playButton.disabled) return;

    playSound.currentTime = 0;
    playSound.play();

    playButton.disabled = true;
    playButton.classList.add("playFlash");

    setTimeout(() => {

        playButton.classList.remove("playFlash");
        gameWindow.style.display = "block";
        document.body.classList.add("mouseCursor");
        document.getElementById("menu").style.pointerEvents = "none";

        let dots = 0;
        playButton.innerText = "LOADING";

        loadingSound.loop = true;
        loadingSound.currentTime = 0;
        loadingSound.play();

        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            playButton.innerText = "LOADING" + ".".repeat(dots);
        }, 300);

        setTimeout(() => {
            clearInterval(loadingInterval);
            loadingSound.pause();
            loadingSound.currentTime = 0;

            document.getElementById("menu").style.display = "none";
            loadLevel();
        }, 2000);

    }, 200);
});

/* =========================
   NEXT LEVEL
========================= */

function nextLevel(){

    if(!canValidate) return;
    canValidate = false;

    levelCompleteSound.currentTime = 0;
    levelCompleteSound.play();

    arcadeSuccessEffect();
    stopTimer();

    if(level > 1){
        score += 10;
        showScorePopup(10);
    }

    if(level === 50){
        setTimeout(() => {
            showVictoryScreen();
        }, 400);
        return;
    }

    setTimeout(() => {

        const previousLevel = level; // 🔥 IMPORTANT

        level++;

        // 🔊 son de transition de groupe (1-10, 11-20 etc)
        playLevelSound(level);

        // 🔊 VOIX AU PASSAGE 10 → 11, 20 → 21 etc
        if(previousLevel % 10 === 0){
        setTimeout(() => {
            playDecadeVoice(previousLevel);
        }, 200);
    }

        // optionnel : animation UI tous les 10 niveaux
        if(level % 10 === 1){
            const lvlTxt = document.getElementById("levelUpText");
            lvlTxt.classList.add("showLevelUp");
            setTimeout(() => lvlTxt.classList.remove("showLevelUp"), 1500);
        }

        updateUI();
        loadLevel();

        setTimeout(() => {
            canValidate = true;
        }, 500);

    }, 250);
}

/* =========================
   RESET
========================= */

function resetAll(){

    cheese.style.display = "none";
    redApple.style.display = "none";
    greenApple.style.display = "none";
    redObject.style.display = "none";
    greenObject.style.display = "none";
    blueObject.style.display = "none";
    redBag.style.display = "none";
    greenBag.style.display = "none";
    blueBag.style.display = "none";
    yellowBag.style.display = "none";
    textInput.style.display = "none";
    validateBtn.style.display = "none";
    keyboard.style.display = "none";
    nextBtn.style.display = "none";
    objectCounter.style.display = "none";
    textInput.value = "";

    mouseMoved = false;
    leftClicked = false;
    rightClicked = false;
    sequence = 0;
    objectsPlaced = 0;
    objectsTotal = 0;
    dragOrderIndex = 0;
    keyPressed = false;
    wordValidated = false;
    cheeseDropped = false;
    clickCount = 0;
    level7CheeseClicked = false;
    wasDragging = false;
    wordIndex = 0;

    cheese.style.left = "";
    cheese.style.top = "";
    cheese.style.opacity = "1";
    cheese.style.boxShadow = "";
    cheese.style.transform = "";

    redApple.style.left = "";
    redApple.style.top = "";
    redApple.style.boxShadow = "";
    redApple.style.transform = "";

    greenApple.style.left = "";
    greenApple.style.top = "";
    greenApple.style.boxShadow = "";
    greenApple.style.transform = "";

    redObject.style.left = "";
    redObject.style.top = "";
    redObject.style.boxShadow = "";
    redObject.style.transform = "";

    greenObject.style.left = "";
    greenObject.style.top = "";
    blueObject.style.left = "";
    blueObject.style.top = "";

    redApple.style.position = "absolute";
    greenApple.style.position = "absolute";
    redApple.style.zIndex = 10;
    greenApple.style.zIndex = 10;
    redApple.style.display = "none";
    greenApple.style.display = "none";
    redApple.style.left = "50%";
    redApple.style.top = "50%";
    greenApple.style.left = "50%";
    greenApple.style.top = "50%";

    // Nettoyage listener niveau 43/48
    if(cheese._level43Handler){
        cheese.removeEventListener("click", cheese._level43Handler);
        cheese._level43Handler = null;
    }

    // Nettoyage listener niveau 46 — CRUCIAL
    if(level46ClickHandler){
        document.removeEventListener("click", level46ClickHandler);
        level46ClickHandler = null;
    }

    levelTimeouts.forEach(clearTimeout);
    levelTimeouts = [];

    stopTimer();
    resetPenalty();
}

/* =========================
   COMPTEUR
========================= */

function updateCounter(){
    if(objectsTotal > 0){
        objectCounter.style.display = "block";
        objectCounter.innerText = objectsPlaced + " / " + objectsTotal;
    }
}

/* =========================
   TIMER
========================= */

function startTimer(seconds){

    stopTimer();
    timerSeconds = seconds;

    const timerDisplay = document.getElementById("objectCounter");
    timerDisplay.style.display = "block";
    timerDisplay.style.color = "#00ffff";
    timerDisplay.innerText = "⏱️ " + timerSeconds + "s";

    timerInterval = setInterval(() => {

        timerSeconds--;
        timerDisplay.innerText = "⏱️ " + timerSeconds + "s";

        if(timerSeconds <= 10){
            timerDisplay.style.color = "#ff3333";
        }

        if(timerSeconds <= 0){
            stopTimer();
            timerFailed();
        }

    }, 1000);
}

function stopTimer(){
    if(timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function timerFailed(){
    takePenalty();
    takePenalty();
    instruction.innerText = "⏱️ Temps écoulé ! Réessaie...";
    setTimeout(() => {
        loadLevel();
    }, 1500);
}

/* =========================
   LOAD LEVEL
========================= */

function loadLevel(){

    resetAll();
    updateUI();
    updateBackground();

    const data = LEVELS[level - 1];
    instruction.innerText = data.instruction;
    instruction.setAttribute("data-level", level);

    const allElements = {
        cheese, redApple, greenApple,
        redObject, greenObject, blueObject,
        redBag, greenBag, blueBag, yellowBag,
        textInput, validateBtn, keyboard, nextBtn
    };

    for(const id in allElements){
        const el = allElements[id];
        if(data.show.includes(id)){
            el.style.display = "block";
        }
    }
    // Cacher le bouton valider pour les niveaux à validation automatique
    const autoValidateLevels = [
        "write-then-drag",
        "write-object-name",
        "write-then-doubleclick",
        "mini-challenge",
        "timer-write-2-words",
        "timer-drag-and-write",
        "timer-sort-and-write",
        "timer-grand-final"
    ];

if(autoValidateLevels.includes(data.action)){
    validateBtn.style.display = "none";
}

    if(data.total){
        objectsTotal = data.total;
        updateCounter();
    }

    if(data.action === "hover-cheese"){
        placeCheeseRandom();
    }

    if(data.action === "hover-keyboard" || data.action === "click-key"){
        createKeyboard();
    }

    if(data.action === "hover-keyboard"){
        setTimeout(() => { handleLevel21(); }, 100);
    }

    if(data.action === "reveal-then-drag-red"){
        redApple.style.position = "absolute";
        greenApple.style.position = "absolute";
        redApple.style.zIndex = 10;
        greenApple.style.zIndex = 10;
        redApple.style.left = "200px";
        redApple.style.top = "180px";
        greenApple.style.left = "220px";
        greenApple.style.top = "200px";
    }

    if(data.action === "sequence-apple-cheese-apple"){
        sequence = 0;
        setTimeout(() => {
            positionNoOverlap(redApple, []);
            positionNoOverlap(cheese, [redApple]);
        }, 50);
    }

    if(data.action === "drag-2-apples"){
        setTimeout(() => {
            randomPosition(redApple);
            randomPosition(greenApple);
        }, 50);
    }

    if(
        data.action === "drag-3-objects" ||
        data.action === "drag-3-objects-fast" ||
        data.action === "drag-ordered"
    ){
        setTimeout(() => {
            randomPosition(redObject);
            randomPosition(greenObject);
            randomPosition(blueObject);
        }, 50);
    }

    if(data.action === "timer-click-cheese-appear" || data.action === "timer-click-5-random"){
        setTimeout(() => { startLevel43(); }, 600);
    }

    if(data.action === "timer-sequence-4"){
        setTimeout(() => { startLevel46(); }, 600);
    }

    if(data.timer){
        setTimeout(() => {
            startTimer(data.timer);
        }, 500);
    }

} // ← FIN DE loadLevel

/* =========================
   POSITION RANDOM
========================= */

function randomPosition(el){

    const gameArea = document.getElementById("gameArea");
    const maxX = gameArea.clientWidth - 100;
    const maxY = (gameArea.clientHeight / 2) - 100;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    el.style.position = "absolute";
    el.style.left = x + "px";
    el.style.top = y + "px";
}

/* =========================
   FROMAGE POSITION RANDOM
========================= */

function placeCheeseRandom(){

    const gameArea = document.getElementById("gameArea");
    const padding = 20;
    const cheeseSize = 90; // taille fixe au lieu de offsetWidth qui peut être 0

    const maxX = gameArea.clientWidth - cheeseSize - padding;
    const maxY = gameArea.clientHeight - cheeseSize - padding - 130; // évite les sacs en bas

    const x = Math.random() * maxX + padding;
    const y = Math.random() * maxY + padding;

    cheese.style.position = "absolute";
    cheese.style.left = x + "px";
    cheese.style.top = y + "px";
}

/* =========================
   POSITION SANS CHEVAUCHEMENT
========================= */

function positionNoOverlap(el, others){

    const gameArea = document.getElementById("gameArea");
    const margin = 20;
    const maxX = gameArea.clientWidth - 100 - margin;
    const maxY = (gameArea.clientHeight / 2) - 100 - margin;

    let x, y, tries = 0;

    do {
        x = Math.random() * maxX + margin;
        y = Math.random() * maxY + margin;
        tries++;
    } while(
        tries < 50 &&
        others.some(other => {
            const ox = parseInt(other.style.left) || 0;
            const oy = parseInt(other.style.top) || 0;
            return Math.abs(x - ox) < 120 && Math.abs(y - oy) < 120;
        })
    );

    el.style.position = "absolute";
    el.style.left = x + "px";
    el.style.top = y + "px";
}

/* =========================
   CLAVIER
========================= */

function createKeyboard(){

    keyboard.innerHTML = "";

    for(let i = 65; i <= 90; i++){
        let key = document.createElement("div");
        key.className = "key";
        key.innerText = String.fromCharCode(i);
        key.addEventListener("click", () => {
            if(level === 22){
                nextLevel();
            }
        });
        keyboard.appendChild(key);
    }
}

function handleLevel21(){

    if(level !== 21) return;

    if(level21Handler){
        document.removeEventListener("mousemove", level21Handler);
    }

    let progress = 0;

    level21Handler = function(e){

        const keyboardRect = keyboard.getBoundingClientRect();
        const inside =
            e.clientX >= keyboardRect.left &&
            e.clientX <= keyboardRect.right &&
            e.clientY >= keyboardRect.top &&
            e.clientY <= keyboardRect.bottom;

        if(inside){
            progress++;
            keyboard.style.filter = "brightness(1.2)";
            if(progress >= 20){
                document.removeEventListener("mousemove", level21Handler);
                level21Handler = null;
                keyboard.style.filter = "none";
                nextLevel();
            }
        } else {
            progress = 0;
            keyboard.style.filter = "none";
        }
    };

    document.addEventListener("mousemove", level21Handler);
}

/* =========================
   AUTRES
========================= */

gameWindow.style.display = "none";

function checkObjectsPlaced(){
    updateCounter();
    if(objectsPlaced >= objectsTotal){
        nextLevel();
    }
}

/* =========================
   ÉCRAN VICTOIRE
========================= */

let bestScore = 0;
let replayBtnReady = false;

function showVictoryScreen(){

    victorySound.currentTime = 0;
    victorySound.play();

    victoryLoop = setInterval(() => {

    victorySound.currentTime = 0;
    victorySound.play();

}, 10000);
    stopTimer();

    if(score > bestScore){
        bestScore = score;
    }

    document.getElementById("finalScore").innerText = score;
    document.getElementById("bestScoreValue").innerText = bestScore;
    document.getElementById("victoryScreen").style.display = "flex";

    if(!replayBtnReady){
        setupReplayBtn();
        replayBtnReady = true;
    }

    launchConfetti();
}

function launchConfetti(){

    const container = document.getElementById("confetti");
    container.innerHTML = "";

    const colors = ["#ffea00","#ff3cac","#00ffff","#00ff99","#ff6600","#ff00ff"];

    for(let i = 0; i < 60; i++){
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (6 + Math.random() * 8) + "px";
        piece.style.height = (6 + Math.random() * 8) + "px";
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
        piece.style.animationDuration = (1.5 + Math.random() * 2) + "s";
        piece.style.animationDelay = (Math.random() * 1.5) + "s";
        container.appendChild(piece);
    }
}

function setupReplayBtn(){

    const replayBtn = document.getElementById("replayBtn");
    if(!replayBtn) return;

    replayBtn.addEventListener("click", () => {
        if(victoryLoop){
        clearInterval(victoryLoop);
        victoryLoop = null;
    }

        victorySound.pause();
        victorySound.currentTime = 0;
        score = 0;
        level = 2;
        currentRank = "Débutant";
        document.getElementById("victoryScreen").style.display = "none";
        updateUI();
        loadLevel();
        canValidate = true;
    });
}

/* =========================
   NIVEAU 43/48 : FROMAGES SUCCESSIFS
========================= */

function startLevel43(){

    const data = LEVELS[level - 1];
    const total = data.total || 3;
    let count = 0;
    const currentLevel = level;

    objectsTotal = total;
    objectsPlaced = 0;
    updateCounter();

    function showCheese(){
        if(level !== currentLevel) return;
        placeCheeseRandom();
        cheese.style.display = "block";
    }

    // Nettoyer tout handler existant
    if(cheese._level43Handler){
        cheese.removeEventListener("click", cheese._level43Handler);
    }

    cheese._level43Handler = function(e){
        e.stopPropagation();
        if(level !== currentLevel) return;
        count++;
        objectsPlaced = count;
        updateCounter();
        cheese.style.display = "none";

        if(count >= total){
            cheese.removeEventListener("click", cheese._level43Handler);
            cheese._level43Handler = null;
            // Délai pour que le joueur voie le compteur atteindre le max
            setTimeout(() => {
                nextLevel();
            }, 400);
        } else {
            setTimeout(showCheese, 600);
        }
    };

    cheese.addEventListener("click", cheese._level43Handler);
    showCheese();
}

/* =========================
   NIVEAU 46 : SÉQUENCE 4 OBJETS
========================= */

function startLevel46(){

    const currentLevel = level;
    const sequence46 = [cheese, redApple, greenApple, redObject];
    let currentIndex = 0;

    objectsTotal = sequence46.length;
    objectsPlaced = 0;
    updateCounter();

    // Positions fixes sans superposition
    cheese.style.position = "absolute";
    cheese.style.left = "80px";
    cheese.style.top = "80px";

    redApple.style.position = "absolute";
    redApple.style.left = "280px";
    redApple.style.top = "80px";

    greenApple.style.position = "absolute";
    greenApple.style.left = "480px";
    greenApple.style.top = "80px";

    redObject.style.position = "absolute";
    redObject.style.left = "280px";
    redObject.style.top = "250px";

    function highlightNext(){

        if(level !== currentLevel) return;

        // Éteindre tous les objets
        sequence46.forEach(el => {
            el.style.boxShadow = "0 0 20px rgba(255,255,255,0.5)";
            el.style.transform = "scale(1)";
        });

        if(currentIndex >= sequence46.length){
            nextLevel();
            return;
        }

        const current = sequence46[currentIndex];
        current.style.boxShadow = "0 0 30px #ffff00, 0 0 60px #ffff00";
        current.style.transform = "scale(1.2)";

        // On crée un handler unique qu'on peut supprimer
        level46ClickHandler = function(e){

            if(level !== currentLevel){
                document.removeEventListener("click", level46ClickHandler);
                level46ClickHandler = null;
                return;
            }

            const clickedCorrect =
                e.target === current ||
                current.contains(e.target);

            if(clickedCorrect){
                document.removeEventListener("click", level46ClickHandler);
                level46ClickHandler = null;

                current.style.boxShadow = "0 0 20px rgba(255,255,255,0.5)";
                current.style.transform = "scale(1)";
                objectsPlaced++;
                currentIndex++;
                updateCounter();

                setTimeout(highlightNext, 400);
            } else {
                takePenalty();
            }
        };

        document.addEventListener("click", level46ClickHandler);
    }

    setTimeout(highlightNext, 500);
}

/* =========================
   INIT
========================= */
instruction.setAttribute("data-level", level);
updateUI();
updateBackground();
updateXP();

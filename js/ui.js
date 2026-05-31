/* =========================
   UPDATE UI
========================= */

function updateUI(){
    title.innerText = "Niveau " + level;
    scoreText.innerText = "Score : " + score;
    document.getElementById("floatingScore").innerText = score;
    document.getElementById("instruction").setAttribute("data-level", level);
    updateXP();
    // Gradient dynamique selon le niveau
    gameWindow.style.background = getLevelGradient(level);
}

/* =========================
   FONCTION + POINTS
========================= */

function showScorePopup(points){

    const popup = document.createElement("div");
    popup.className = "scorePopup";
    popup.innerText = "+ " + points + " pts";
    popup.style.top = "120px";
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}

/* =========================
   FONCTION - POINTS
========================= */

function showPenaltyPopup(points){

    const popup = document.createElement("div");
    popup.className = "penaltyPopup";
    popup.innerText = "- " + points + " pts";
    popup.style.top = "120px";
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 2000);
}

/* =========================
   SONS D'ERREUR
========================= */

const errorSound1 = new Audio("./sounds/error1.mp3");
const errorSound2 = new Audio("./sounds/error2.mp3");

/* =========================
   SYSTÈME DE PÉNALITÉ
========================= */

let penaltyCount = 0;
let penaltyCooldown = false;

function resetPenalty(){
    penaltyCount = 0;
    penaltyCooldown = false;
}

function takePenalty(){

    if(penaltyCooldown) return;

    penaltyCooldown = true;
    setTimeout(() => {
        penaltyCooldown = false;
    }, 1000);

    let pointsLost = 0;

    if(penaltyCount === 0){
        pointsLost = 5;
        errorSound1.currentTime = 0;
        errorSound1.play();
    } else if(penaltyCount === 1){
        pointsLost = 2;
        errorSound2.currentTime = 0;
        errorSound2.play();
    } else {
        pointsLost = 0;
        errorSound2.currentTime = 0;
        errorSound2.play();
    }

    penaltyCount++;

    const scorePanel = document.getElementById("scorePanel");
    scorePanel.classList.remove("scoreShake");
    void scorePanel.offsetWidth;
    scorePanel.classList.add("scoreShake");
    setTimeout(() => {
        scorePanel.classList.remove("scoreShake");
    }, 500);

    if(pointsLost > 0){
        score = Math.max(0, score - pointsLost);
        updateUI();
        showPenaltyPopup(pointsLost);
    }
}

/* =========================
   BARRE XP
========================= */

function updateXP(){

    const xpBar = document.getElementById("xpBar");
    const rankText = document.getElementById("rankText");
    let progress = 0;

    if(level >= 1 && level <= 10){
    rankText.innerText = "Débutant";
    xpBar.style.background = "#3251ff";
    progress = (level / 10) * 100;
    currentRank = "Débutant";
}
    else if(level >= 11 && level <= 20){
        rankText.innerText = "Intermédiaire";
        xpBar.style.background = "#00fff7";
        progress = ((level - 10) / 10) * 100;
        if(currentRank !== "Intermédiaire"){
            currentRank = "Intermédiaire";
            rankUpEffect();
            playRankSound("Intermédiaire");
        }
    }
    else if(level >= 21 && level <= 30){
        rankText.innerText = "Clavier";
        xpBar.style.background = "#2cdd4f";
        progress = ((level - 20) / 10) * 100;
        if(currentRank !== "Clavier"){
            currentRank = "Clavier";
            rankUpEffect();
            playRankSound("Clavier");
        }
    }
    else if(level >= 31 && level <= 40){
        rankText.innerText = "Expert";
        xpBar.style.background = "#ff0000";
        progress = ((level - 30) / 10) * 100;
        if(currentRank !== "Expert"){
            currentRank = "Expert";
            rankUpEffect();
            playRankSound("Expert");
        }
    }
    else if(level >= 41 && level <= 50){
        rankText.innerText = "Champion";
        xpBar.style.background = "#ff3cac";
        progress = ((level - 40) / 10) * 100;
        if(currentRank !== "Champion"){
            currentRank = "Champion";
            rankUpEffect();
            playRankSound("Champion");
        }
    }

    xpBar.style.width = progress + "%";
}
function getLevelGradient(level){

    // 1 → 10
    if(level <= 10){
        return "linear-gradient(135deg, #0f172a, #2563eb)";
    }

    // 11 → 20
    if(level <= 20){
        return "linear-gradient(135deg, #2563eb, #06b6d4)";
    }

    // 21 → 30
    if(level <= 30){
        return "linear-gradient(135deg, #06b6d4, #22c55e)";
    }

    // 31 → 40
    if(level <= 40){
        return "linear-gradient(135deg, #22c55e, #facc15)";
    }

    // 41 → 45
    if(level <= 45){
        return "linear-gradient(135deg, #facc15, #f97316)";
    }

    // 46 → 50
    return "linear-gradient(135deg, #f97316, #dc2626)";
}

/* =========================
   BACKGROUND PAR NIVEAU
========================= */

function updateBackground(){

    if(gameWindow.style.display !== "block"){
        document.body.style.backgroundImage = 'url("./images/menu-bg.jpg")';
        return;
    }

    if(level >= 1 && level <= 10){
        document.body.style.backgroundImage = 'url("./images/lvl0-10.jpg")';
    }
    else if(level >= 11 && level <= 20){
        document.body.style.backgroundImage = 'url("./images/lvl10-20.jpg")';
    }
    else if(level >= 21 && level <= 30){
        document.body.style.backgroundImage = 'url("./images/lvl20-30.jpg")';
    }
    else if(level >= 31 && level <= 40){
        document.body.style.backgroundImage = 'url("./images/lvl30-40.jpg")';
    }
    else if(level >= 41 && level <= 50){
        document.body.style.backgroundImage = 'url("./images/lvl40-50.jpg")';
    }

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
}

/* =========================
   EFFET SUCCES
========================= */

function arcadeSuccessEffect(){
    gameWindow.classList.add("winEffect");
    setTimeout(() => {
        gameWindow.classList.remove("winEffect");
    }, 600);
}

/* =========================
   EFFET RANK UP
========================= */

function rankUpEffect(){

    const xpContainer = document.getElementById("xpPanel");
    const levelUpText = document.getElementById("levelUpText");

    levelUpText.classList.add("showLevelUp");
    setTimeout(() => {
        levelUpText.classList.remove("showLevelUp");
    }, 1500);

    if(xpContainer){
        xpContainer.classList.add("levelUpEffect");
        setTimeout(() => {
            xpContainer.classList.remove("levelUpEffect");
        }, 800);
    }
}

// ============================================================
//  ui.js
//  Tout ce qui concerne l'affichage :
//  score, XP, rang, backgrounds, effets visuels, tutoriels.
// ============================================================

// ============================================================
//  RÉFÉRENCES AUX ÉLÉMENTS HTML
//  On les récupère une seule fois ici pour tout le projet.
// ============================================================

const playButton   = document.getElementById("playButton");
const gameWindow   = document.getElementById("gameWindow");
const instruction  = document.getElementById("instruction");
const scoreText    = document.getElementById("score");
const title        = document.getElementById("title");

const cheese       = document.getElementById("cheese");
const redApple     = document.getElementById("redApple");
const greenApple   = document.getElementById("greenApple");
const redObject    = document.getElementById("redObject");
const greenObject  = document.getElementById("greenObject");
const blueObject   = document.getElementById("blueObject");
const redBag       = document.getElementById("redBag");
const greenBag     = document.getElementById("greenBag");
const blueBag      = document.getElementById("blueBag");
const yellowBag    = document.getElementById("yellowBag");
const textInput    = document.getElementById("textInput");
const validateBtn  = document.getElementById("validateBtn");
const inputZone    = document.getElementById("inputZone");
const keyboard     = document.getElementById("keyboard");
const objectCounter= document.getElementById("objectCounter");
const nextBtn      = document.getElementById("nextBtn");
const particles    = document.getElementById("particles");

// ============================================================
//  MISE À JOUR GÉNÉRALE DE L'INTERFACE
// ============================================================

function updateUI() {
    title.innerText = "Niveau " + level;
    scoreText.innerText = "Score : " + score;
    document.getElementById("floatingScore").innerText = score;
    document.getElementById("instruction").setAttribute("data-level", level);
    updateXP();
    gameWindow.style.background = getLevelGradient(level);
}

// ============================================================
//  POPUP + POINTS (vert)
// ============================================================

function showScorePopup(points) {
    const popup = document.createElement("div");
    popup.className = "scorePopup";
    popup.innerText = "+ " + points + " pts";
    popup.style.top = "120px";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

// ============================================================
//  POPUP BONUS TIMER (affiché quand on termine un niveau chrono)
//  Montre les points gagnés + un message selon la rapidité
// ============================================================

function showTimerBonusPopup(points) {
    // Popup flottant classique près du panneau score
    const floatPopup = document.createElement("div");
    floatPopup.className = "scorePopup";
    floatPopup.innerText = "+ " + points + " pts";
    floatPopup.style.top = "120px";
    document.body.appendChild(floatPopup);
    setTimeout(() => floatPopup.remove(), 2000);

    // Message selon le bonus obtenu
    let label, color, glow;
    if (points >= 45) {
        label = "⚡ ÉCLAIR !";   color = "#00ffff"; glow = "0 0 20px cyan, 0 0 40px cyan";
    } else if (points >= 35) {
        label = "🔥 RAPIDE !";   color = "#ffea00"; glow = "0 0 20px #ffea00, 0 0 40px orange";
    } else if (points >= 20) {
        label = "👍 BIEN !";     color = "#00ff99"; glow = "0 0 15px #00ff99";
    } else {
        label = "⏳ JUSTE !";    color = "#ff9900"; glow = "0 0 10px #ff9900";
    }

    // Grande popup centrale style arcade
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:28px;margin-bottom:4px">${label}</div>
        <div style="font-size:36px;font-weight:900;font-family:monospace;
                    color:${color};text-shadow:${glow};letter-spacing:2px">
            +${points} pts
        </div>
        <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;letter-spacing:2px">
            BONUS VITESSE
        </div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "50%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.6)",
        background    : "rgba(10,10,20,0.92)",
        border        : `2px solid ${color}`,
        borderRadius  : "16px",
        padding       : "20px 36px",
        textAlign     : "center",
        boxShadow     : glow,
        zIndex        : "99989",
        pointerEvents : "none",
        opacity       : "0",
        transition    : "opacity 0.2s ease, transform 0.3s cubic-bezier(0.22,1.5,0.36,1)"
    });
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.opacity   = "1";
        popup.style.transform = "translate(-50%,-50%) scale(1)";
    });

    setTimeout(() => {
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%,-50%) scale(0.7)";
        setTimeout(() => popup.remove(), 300);
    }, 1400);
}

// ============================================================
//  POPUP - POINTS (rouge)
// ============================================================

function showPenaltyPopup(points) {
    const popup = document.createElement("div");
    popup.className = "penaltyPopup";
    popup.innerText = "- " + points + " pts";
    popup.style.top = "120px";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

// ============================================================
//  POPUP "RECOMMENCE !"
//  Affiché quand une séquence à étapes (ex: niveau 38) est
//  cassée par un mauvais clic / mauvaise action.
// ============================================================

function showRestartPopup() {
    const popup = document.createElement("div");
    popup.innerText = "🔄 Recommence !";

    // Style en ligne : pas besoin de toucher au fichier CSS
    popup.style.position      = "absolute";
    popup.style.top           = "50%";
    popup.style.left          = "50%";
    popup.style.transform     = "translate(-50%, -50%) scale(0.7)";
    popup.style.background    = "rgba(20,20,30,0.9)";
    popup.style.color         = "#ff3333";
    popup.style.fontWeight    = "bold";
    popup.style.fontSize      = "26px";
    popup.style.padding       = "14px 28px";
    popup.style.borderRadius  = "14px";
    popup.style.border        = "2px solid #ff3333";
    popup.style.boxShadow     = "0 0 20px rgba(255,0,0,0.6)";
    popup.style.zIndex        = "10001";
    popup.style.pointerEvents = "none";
    popup.style.opacity       = "0";
    popup.style.transition    = "opacity 0.15s ease, transform 0.15s ease";

    document.getElementById("gameArea").appendChild(popup);

    // Petite animation d'apparition / disparition
    requestAnimationFrame(() => {
        popup.style.opacity   = "1";
        popup.style.transform = "translate(-50%, -50%) scale(1)";
    });

    setTimeout(() => {
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%, -50%) scale(0.7)";
        setTimeout(() => popup.remove(), 200);
    }, 900);
}

// ============================================================
//  BARRE XP ET RANG
// ============================================================

function updateXP() {

    const xpBar   = document.getElementById("xpBar");
    const rankText = document.getElementById("rankText");
    let progress   = 0;

    if (level >= 1 && level <= 10) {
        rankText.innerText = "Débutant";
        xpBar.style.background = "#3251ff";
        progress = ((level - 1) / 10) * 100;
        currentRank = "Débutant";
    }
    else if (level >= 11 && level <= 20) {
        rankText.innerText = "Intermédiaire";
        xpBar.style.background = "#00fff7";
        progress = ((level - 11) / 10) * 100;
        if (currentRank !== "Intermédiaire") {
            currentRank = "Intermédiaire";
            rankUpEffect();
            Sounds.jouerRang("Intermédiaire");
        }
    }
    else if (level >= 21 && level <= 30) {
        rankText.innerText = "Clavier";
        xpBar.style.background = "#2cdd4f";
        progress = ((level - 21) / 10) * 100;
        if (currentRank !== "Clavier") {
            currentRank = "Clavier";
            rankUpEffect();
            Sounds.jouerRang("Clavier");
        }
    }
    else if (level >= 31 && level <= 40) {
        rankText.innerText = "Expert";
        xpBar.style.background = "#ff0000";
        progress = ((level - 31) / 10) * 100;
        if (currentRank !== "Expert") {
            currentRank = "Expert";
            rankUpEffect();
            Sounds.jouerRang("Expert");
        }
    }
    else if (level >= 41 && level <= 50) {
        rankText.innerText = "Champion";
        xpBar.style.background = "#ff3cac";
        progress = ((level - 41) / 10) * 100;
        if (currentRank !== "Champion") {
            currentRank = "Champion";
            rankUpEffect();
            Sounds.jouerRang("Champion");
        }
    }

    xpBar.style.width = progress + "%";
}

// ============================================================
//  GRADIENT DE FOND SELON LE NIVEAU
// ============================================================

function getLevelGradient(lvl) {
    if (lvl <= 10) return "linear-gradient(135deg, #0f172a, #2563eb)";
    if (lvl <= 20) return "linear-gradient(135deg, #2563eb, #06b6d4)";
    if (lvl <= 30) return "linear-gradient(135deg, #06b6d4, #22c55e)";
    if (lvl <= 40) return "linear-gradient(135deg, #22c55e, #facc15)";
    if (lvl <= 45) return "linear-gradient(135deg, #facc15, #f97316)";
    return             "linear-gradient(135deg, #f97316, #dc2626)";
}

// ============================================================
//  BACKGROUND DE PAGE SELON LE NIVEAU
// ============================================================

function updateBackground() {

    if (gameWindow.style.display !== "block") {
        document.body.style.backgroundImage = 'url("./images/menu-bg.jpg")';
        return;
    }

    if (level === 1)                          document.body.style.backgroundImage = 'url("./images/lvl1.jpg")';
    else if (level >= 2  && level <= 10)      document.body.style.backgroundImage = 'url("./images/lvl0-10.jpg")';
    else if (level >= 11 && level <= 20)      document.body.style.backgroundImage = 'url("./images/lvl10-20.jpg")';
    else if (level >= 21 && level <= 30)      document.body.style.backgroundImage = 'url("./images/lvl20-30.jpg")';
    else if (level >= 31 && level <= 40)      document.body.style.backgroundImage = 'url("./images/lvl30-40.jpg")';
    else if (level >= 41 && level <= 50)      document.body.style.backgroundImage = 'url("./images/lvl40-50.jpg")';

    document.body.style.backgroundSize       = "cover";
    document.body.style.backgroundPosition   = "center";
    document.body.style.backgroundRepeat     = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
}

// ============================================================
//  EFFET VISUEL : VICTOIRE SUR LA FENÊTRE DE JEU
// ============================================================

function arcadeSuccessEffect() {
    gameWindow.classList.add("winEffect");
    setTimeout(() => gameWindow.classList.remove("winEffect"), 600);
}

// ============================================================
//  EFFET VISUEL : MONTÉE DE RANG
// ============================================================

function rankUpEffect() {
    const xpContainer = document.getElementById("xpPanel");
    const levelUpText = document.getElementById("levelUpText");

    levelUpText.classList.add("showLevelUp");
    setTimeout(() => levelUpText.classList.remove("showLevelUp"), 1500);

    if (xpContainer) {
        xpContainer.classList.add("levelUpEffect");
        setTimeout(() => xpContainer.classList.remove("levelUpEffect"), 800);
    }
}

// ============================================================
//  ANNONCE PÉNALITÉS (niveau 21)
// ============================================================

function showPenaltyAnnounce() {
    const el = document.getElementById("penaltyAnnounce");
    el.classList.remove("hide");
    el.classList.add("show");
    el.style.pointerEvents = "auto";

    // Bloque la validation du niveau tant que le popup est affiché
    penaltyAnnounceActive = true;

    function dismiss() {
        el.classList.remove("show");
        el.classList.add("hide");
        el.style.pointerEvents = "none";

        penaltyAnnounceActive = false;

        document.removeEventListener("click", dismiss);
        document.removeEventListener("keydown", dismiss);
        clearTimeout(autoHide);

        setTimeout(() => el.classList.remove("hide"), 300);
    }

    // Fermer au clic n'importe où, ou en appuyant sur une touche
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", dismiss);

    const autoHide = setTimeout(dismiss, 15000);
}

// ============================================================
//  ÉCRAN VICTOIRE
// ============================================================

function showVictoryScreen() {

    Sounds.arreter("victory");
    Sounds.jouer("victory");

    // Voix "victory" jouée une seule fois au moment où l'écran apparaît
    Sounds.jouer("victoryVoice", 0.9);

    victoryLoop = setInterval(() => {
        Sounds.arreter("victory");
        Sounds.jouer("victory");
    }, 10000);

    stopTimer();

    // --- Bonus PERFECT : aucune faute du niveau 1 au niveau final ---
    const isPerfectGame = !gameHasHadPenalty;
    if (isPerfectGame) {
        score += 50;
        showPerfectPopup();
    }

    if (score > bestScore) bestScore = score;

    // Enregistrer cette partie dans l'historique du profil joueur
    recordGameInHistory();

    document.getElementById("finalScore").innerText    = score;
    document.getElementById("bestScoreValue").innerText = bestScore;
    document.getElementById("victoryScreen").style.display = "flex";

    if (!replayBtnReady) {
        setupReplayBtn();
        replayBtnReady = true;
    }

    launchConfetti();
}

// ============================================================
//  POPUP "PERFECT" — style arcade, déclenché quand toute la
//  partie a été terminée sans aucune faute. +50 points bonus.
// ============================================================

function showPerfectPopup() {

    Sounds.jouer("combo20"); // réutilise le son combo le plus impactant

    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:46px;margin-bottom:6px">⭐</div>
        <div style="font-size:42px;font-weight:900;letter-spacing:6px;
                    font-family:'Orbitron',monospace;color:#ffea00;
                    text-shadow:0 0 12px #ffea00,0 0 24px #ff00ff,0 0 40px #ff00ff">
            PERFECT
        </div>
        <div style="font-size:16px;color:#00ff99;margin-top:8px;letter-spacing:2px;
                    font-family:monospace;font-weight:bold">
            AUCUNE FAUTE — + 50 POINTS BONUS !
        </div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "38%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.4) rotate(-6deg)",
        background    : "linear-gradient(135deg,#1a0030,#2b0050,#1a0030)",
        border        : "3px solid #ffea00",
        borderRadius  : "20px",
        padding       : "30px 50px",
        textAlign     : "center",
        boxShadow     : "0 0 40px #ffea00, 0 0 80px rgba(255,0,255,0.5)",
        zIndex        : "999999",
        pointerEvents : "none",
        opacity       : "0",
        transition    : "opacity 0.25s ease, transform 0.4s cubic-bezier(0.22,1.8,0.36,1)"
    });
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.opacity   = "1";
        popup.style.transform = "translate(-50%,-50%) scale(1) rotate(0deg)";
    });

    setTimeout(() => {
        popup.style.transform = "translate(-50%,-50%) scale(1.06) rotate(0deg)";
    }, 400);

    setTimeout(() => {
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%,-50%) scale(0.8) rotate(3deg)";
        setTimeout(() => popup.remove(), 350);
    }, 2400);
}

function launchConfetti() {
    const container = document.getElementById("confetti");
    container.innerHTML = "";
    const colors = ["#ffea00","#ff3cac","#00ffff","#00ff99","#ff6600","#ff00ff"];

    for (let i = 0; i < 60; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left             = Math.random() * 100 + "%";
        piece.style.background       = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width            = (6 + Math.random() * 8) + "px";
        piece.style.height           = (6 + Math.random() * 8) + "px";
        piece.style.borderRadius     = Math.random() > 0.5 ? "50%" : "0";
        piece.style.animationDuration = (1.5 + Math.random() * 2) + "s";
        piece.style.animationDelay   = (Math.random() * 1.5) + "s";
        container.appendChild(piece);
    }
}

function setupReplayBtn() {
    const btn = document.getElementById("replayBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
        if (victoryLoop) { clearInterval(victoryLoop); victoryLoop = null; }
        Sounds.arreter("victory");

        score               = 0;
        level               = 2;
        currentRank         = "Débutant";
        comboCount          = 0;
        hadPenaltyThisLevel = false;
        gameHasHadPenalty   = false; // nouvelle partie = chance de PERFECT remise à zéro
        lives               = 0;

        deleteSave(); // on repart de zéro → effacer la sauvegarde

        document.getElementById("victoryScreen").style.display = "none";
        updateLivesDisplay();
        updateComboDisplay();
        updateUI();
        loadLevel();
        canValidate = true;
    });
}

// ============================================================
//  COMPTEUR D'OBJETS
// ============================================================

function updateCounter() {
    if (objectsTotal > 0) {
        // Sur les niveaux avec timer, le compteur d'objets s'affiche
        // dans le panneau chrono (via le label TEMPS), pas dans objectCounter
        if (!currentLevelHasTimer) {
            objectCounter.style.display = "block";
            objectCounter.innerText = objectsPlaced + " / " + objectsTotal;
        } else {
            // On met à jour quand même le texte mais dans le label du timer
            const timerLabel = document.getElementById("timerLabel");
            if (timerLabel && objectsTotal > 0) {
                timerLabel.innerText = objectsPlaced + "/" + objectsTotal + " — TEMPS";
            }
        }
    }
}

function checkObjectsPlaced() {
    updateCounter();
    if (objectsPlaced >= objectsTotal) nextLevel();
}

// ============================================================
//  TIMER ARCADE
//  - Anneau SVG qui se vide avec le temps
//  - Barre de bonus dégressif (50 → 5 pts, -1 toutes les 2s)
//  - Couleurs qui changent à l'approche de 0
// ============================================================

let _timerTotalSeconds = 0;    // durée totale du niveau (pour l'anneau)
let _bonusDecayTick    = 0;    // compteur interne pour le rythme du decay

function startTimer(seconds) {
    stopTimer();

    _timerTotalSeconds  = seconds;
    timerSeconds        = seconds;
    timerBonusPoints    = TIMER_BONUS_MAX;
    _bonusDecayTick     = 0;

    const panel      = document.getElementById("timerPanel");
    const ring       = document.getElementById("timerRing");
    const number     = document.getElementById("timerNumber");
    const bonusFill  = document.getElementById("timerBonusFill");
    const bonusNum   = document.getElementById("timerBonusNum");

    // Cacher l'ancien objectCounter (on utilise le panneau dédié maintenant)
    objectCounter.style.display = "none";

    // Montrer le panneau chrono avec une animation de déclenchement
    panel.style.display = "flex";
    panel.classList.remove("urgent");
    panel.classList.remove("timerStart");
    void panel.offsetWidth; // forcer le reflow pour relancer l'animation
    panel.classList.add("timerStart");
    setTimeout(() => panel.classList.remove("timerStart"), 600);

    // Son de démarrage du chrono (optionnel, si le fichier existe)
    Sounds.jouer("timerStart");

    // Init visuel
    _updateTimerVisuals(ring, number, bonusFill, bonusNum);

    timerInterval = setInterval(() => {
        timerSeconds--;
        _bonusDecayTick++;

        // Décrémenter le bonus toutes les TIMER_BONUS_DECAY secondes
        if (_bonusDecayTick >= TIMER_BONUS_DECAY) {
            _bonusDecayTick = 0;
            if (timerBonusPoints > TIMER_BONUS_MIN) {
                timerBonusPoints--;
            }
        }

        _updateTimerVisuals(ring, number, bonusFill, bonusNum);

        if (timerSeconds <= 0) {
            stopTimer();
            timerFailed();
        }
    }, 1000);
}

function _updateTimerVisuals(ring, number, bonusFill, bonusNum) {

    const panel     = document.getElementById("timerPanel");
    const CIRCUMF   = 314; // 2 * π * 50 (rayon du cercle SVG)
    const ratio     = Math.max(0, timerSeconds / _timerTotalSeconds);
    const offset    = CIRCUMF * (1 - ratio);

    // Couleur de l'anneau : cyan → jaune → rouge
    let ringColor, textColor;
    if (ratio > 0.5) {
        ringColor = "#00ffff";
        textColor = "white";
    } else if (ratio > 0.25) {
        ringColor = "#ffcc00";
        textColor = "#ffcc00";
    } else {
        ringColor = "#ff3333";
        textColor = "#ff3333";
        if (!panel.classList.contains("urgent")) panel.classList.add("urgent");
    }

    ring.style.stroke          = ringColor;
    ring.style.strokeDashoffset = offset;
    number.style.fill          = textColor;
    number.textContent         = timerSeconds;

    // Barre de bonus
    const bonusRatio  = (timerBonusPoints - TIMER_BONUS_MIN) / (TIMER_BONUS_MAX - TIMER_BONUS_MIN);
    bonusFill.style.width = Math.max(0, bonusRatio * 100) + "%";

    if (bonusRatio < 0.3) {
        bonusFill.style.background = "linear-gradient(90deg,#ff3333,#ff6600)";
    } else if (bonusRatio < 0.6) {
        bonusFill.style.background = "linear-gradient(90deg,#ff6600,#ffcc00)";
    } else {
        bonusFill.style.background = "linear-gradient(90deg,#ff6600,#ffcc00,#ffea00)";
    }

    bonusNum.textContent = timerBonusPoints;
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (timerBonusInterval) {
        clearInterval(timerBonusInterval);
        timerBonusInterval = null;
    }
    // Cacher le panneau chrono
    const panel = document.getElementById("timerPanel");
    if (panel) {
        panel.style.display = "none";
        panel.classList.remove("urgent");
    }
}

function timerFailed() {
    takePenalty();
    takePenalty();
    instruction.innerText = "⏱️ Temps écoulé ! Réessaie...";
    setTimeout(() => loadLevel(), 1500);
}

// ============================================================
//  CHECKLIST MULTI-ÉTAPES
// ============================================================

let checklistSteps = [];
let checklistIndex = 0;

function initChecklist(steps) {
    checklistSteps = steps;
    checklistIndex = 0;

    const container = document.getElementById("stepChecklist");
    container.innerHTML = "";

    steps.forEach((step, i) => {
        const item = document.createElement("div");
        item.className = "stepItem" + (i === 0 ? " active" : "");
        item.id = "step-" + i;
        item.innerHTML = `
            <span class="stepIcon">${step.icon}</span>
            <span class="stepText">${step.label}</span>
        `;
        container.appendChild(item);
    });
}

// --------------------------------------------------------
//  Valide une étape de la checklist.
//
//  - validateStep()        → mode "séquentiel" (comme avant) :
//                             valide l'étape courante et passe
//                             à la suivante automatiquement.
//
//  - validateStep(2)       → mode "libre" : valide directement
//                             l'étape n°2 (index), peu importe
//                             l'ordre dans lequel les étapes
//                             sont faites. Utile quand l'ordre
//                             n'est pas imposé (ex: niveau 50).
// --------------------------------------------------------
function validateStep(index) {

    let idx = index;

    // Mode séquentiel : pas d'index fourni
    if (idx === undefined) {
        idx = checklistIndex;
        checklistIndex++;
    }

    const current = document.getElementById("step-" + idx);
    if (current) {
        current.classList.remove("active");
        current.classList.add("done");
        const icon = current.querySelector(".stepIcon");
        if (icon) icon.innerHTML = "";
    }

    // En mode séquentiel uniquement : activer l'étape suivante
    if (index === undefined) {
        const next = document.getElementById("step-" + checklistIndex);
        if (next) next.classList.add("active");
    }
}

// --------------------------------------------------------
//  Remet la checklist dans l'état correspondant à l'étape
//  "targetIndex" (utilisé quand le joueur se trompe et doit
//  recommencer une séquence depuis le début).
//
//  Exemple : resetChecklistTo(0) → toutes les étapes
//  redeviennent "à faire", la première devient "active".
// --------------------------------------------------------
function resetChecklistTo(targetIndex) {

    checklistIndex = targetIndex;

    checklistSteps.forEach((step, i) => {
        const item = document.getElementById("step-" + i);
        if (!item) return;

        item.classList.remove("done", "active");

        const icon = item.querySelector(".stepIcon");

        if (i < targetIndex) {
            // Étapes déjà validées avant le point de reprise
            item.classList.add("done");
            if (icon) icon.innerHTML = "";
        } else if (i === targetIndex) {
            // Étape courante à refaire
            item.classList.add("active");
            if (icon) icon.innerHTML = step.icon;
        } else {
            // Étapes pas encore commencées
            if (icon) icon.innerHTML = step.icon;
        }
    });
}

function clearChecklist() {
    document.getElementById("stepChecklist").innerHTML = "";
    checklistSteps = [];
    checklistIndex = 0;
}

// ============================================================
//  SYSTÈME DE PÉNALITÉ
// ============================================================

function resetPenalty() {
    penaltyCount    = 0;
    penaltyCooldown = false;
}

function takePenalty() {
    if (penaltyCooldown) return;
    if (level < 21) return; // pas de pénalité avant le niveau 21

    penaltyCooldown = true;
    setTimeout(() => { penaltyCooldown = false; }, 1000);

    // Cette partie n'est plus "parfaite" — utilisé pour le bonus PERFECT
    gameHasHadPenalty = true;

    // Casse le combo dès la première faute
    breakCombo();

    let pointsLost = 0;

    if (penaltyCount === 0) {
        pointsLost = 5;
        Sounds.jouer("error1");
    } else if (penaltyCount === 1) {
        pointsLost = 2;
        Sounds.jouer("error2");
    } else {
        pointsLost = 0;
        Sounds.jouer("error2");
    }

    penaltyCount++;

    // Animation tremblement sur le panneau score
    const scorePanel = document.getElementById("scorePanel");
    scorePanel.classList.remove("scoreShake");
    void scorePanel.offsetWidth;
    scorePanel.classList.add("scoreShake");
    setTimeout(() => scorePanel.classList.remove("scoreShake"), 500);

    if (pointsLost > 0) {
        score = Math.max(0, score - pointsLost);
        updateUI();
        showPenaltyPopup(pointsLost);
    }
}

// ============================================================
//  TUTORIELS ANIMÉS
// ============================================================

const TUTORIAL_DATA = {

    2: {
        label: "Déplace ta souris jusqu'au fromage",
        color: "#00ff99",
        buildSVG: () => buildMouseMoveSVG()
    },
    3: {
        label: "Clique sur le bouton GAUCHE de la souris",
        color: "#ff00ff",
        buildSVG: () => buildMouseSVG("left")
    },
    5: {
        label: "Clique sur le bouton DROIT de la souris",
        color: "#00ffff",
        buildSVG: () => buildMouseSVG("right")
    },
    8: {
        label: "Clique DEUX FOIS très vite sur le bouton gauche",
        color: "#ffe600",
        buildSVG: () => buildMouseSVG("double")
    },
    10: {
        label: "Maintiens le clic gauche ET déplace la souris",
        color: "#00ff99",
        buildSVG: () => buildDragSVG()
    },
    21: {
        label: "Passe ta souris sur le clavier affiché à l'écran",
        color: "#bb66ff",
        buildSVG: () => buildMouseMoveSVG()
    },
    23: {
        label: "Appuie sur n'importe quelle touche de TON clavier",
        color: "#00ffff",
        buildSVG: () => buildKeyboardSVG("any")
    },
    26: {
        label: "Trouve la lettre A et appuie dessus",
        color: "#00ffff",
        buildSVG: () => buildKeyboardSVG("A")
    },
    27: {
        label: "Trouve le chiffre 0 et appuie dessus",
        color: "#ffe600",
        buildSVG: () => buildKeyboardSVG("0")
    }
};

function buildMouseSVG(type) {
    const fingerX    = type === "right" ? 115 : 75;
    const anim       = type === "double"
        ? "dblFinger 1.8s ease-in-out infinite"
        : "singleFinger 1.4s ease-in-out infinite";
    const clickColor = type === "right" ? "#00ffff" : (type === "double" ? "#ffe600" : "#ff00ff");

    const leftAnim  = (type === "left" || type === "double")
        ? `animation:${type === "double" ? "dblFlash" : "flashLeft"} ${type === "double" ? "1.8" : "1.4"}s ease-in-out infinite`
        : "animation:none";

    const rightAnim = type === "right"
        ? "animation:flashRight 1.4s ease-in-out infinite"
        : "animation:none";

    return `<style>
      @keyframes singleFinger { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(18px)} }
      @keyframes dblFinger { 0%,20%,40%,60%,100%{transform:translateY(0)} 10%{transform:translateY(16px)} 50%{transform:translateY(16px)} }
      @keyframes flashLeft  { 0%,60%,100%{fill:#3a3a4a} 30%{fill:${clickColor}} }
      @keyframes flashRight { 0%,60%,100%{fill:#3a3a4a} 30%{fill:${clickColor}} }
      @keyframes dblFlash   { 0%,20%,40%,60%,100%{fill:#3a3a4a} 10%{fill:${clickColor}} 50%{fill:${clickColor}} }
    </style>
    <svg width="160" height="180" viewBox="0 0 160 180">
      <rect x="35" y="20" width="70" height="120" rx="35" fill="#2a2a3a" stroke="#888" stroke-width="2"/>
      <rect x="35" y="20" width="34" height="55" rx="17" style="${leftAnim}" fill="#3a3a4a" stroke="#888" stroke-width="1"/>
      <rect x="71" y="20" width="34" height="55" rx="17" style="${rightAnim}" fill="#3a3a4a" stroke="#888" stroke-width="1"/>
      <line x1="69" y1="20" x2="69" y2="75" stroke="#555" stroke-width="1.5"/>
      <rect x="63" y="38" width="14" height="20" rx="7" fill="#666"/>
      <g style="animation:${anim}; transform-origin:${fingerX}px 10px">
        <ellipse cx="${fingerX}" cy="22" rx="13" ry="18" fill="#f5c5a0" stroke="#c8956b" stroke-width="1.5"/>
        <ellipse cx="${fingerX}" cy="13" rx="9" ry="8" fill="#ffd6b8"/>
      </g>
    </svg>`;
}

function buildMouseMoveSVG() {
    return `<style>
      @keyframes mMove  { 0%{transform:translate(0,0)} 100%{transform:translate(100px,-10px)} }
      @keyframes arrowP { 0%,100%{opacity:0.3;transform:translateX(0)} 50%{opacity:1;transform:translateX(10px)} }
    </style>
    <svg width="260" height="160" viewBox="0 0 260 160">
      <text x="20" y="55" font-size="38">🧀</text>
      <g style="animation:arrowP 0.8s ease-in-out infinite">
        <line x1="70" y1="45" x2="130" y2="45" stroke="#00ff99" stroke-width="2.5" stroke-dasharray="6,3"/>
        <polygon points="128,38 142,45 128,52" fill="#00ff99"/>
      </g>
      <g style="animation:mMove 1.6s ease-in-out infinite alternate">
        <rect x="14" y="80" width="44" height="68" rx="22" fill="#2a2a3a" stroke="#888" stroke-width="1.5"/>
        <rect x="14" y="80" width="21" height="32" rx="11" fill="#3a3a4a" stroke="#888" stroke-width="1"/>
        <line x1="35" y1="80" x2="35" y2="112" stroke="#555" stroke-width="1"/>
        <rect x="29" y="93" width="12" height="16" rx="6" fill="#666"/>
        <ellipse cx="25" cy="94" rx="10" ry="14" fill="#f5c5a0" stroke="#c8956b" stroke-width="1.5"/>
        <ellipse cx="25" cy="86" rx="7" ry="6.5" fill="#ffd6b8"/>
      </g>
    </svg>`;
}

function buildDragSVG() {
    return `<style>
      @keyframes dragM     { 0%{transform:translate(0,0)} 100%{transform:translate(110px,-5px)} }
      @keyframes trailDash { 0%{stroke-dashoffset:160} 100%{stroke-dashoffset:0} }
    </style>
    <svg width="280" height="160" viewBox="0 0 280 160">
      <text x="22" y="52" font-size="34">🧀</text>
      <path d="M58,40 Q140,20 210,42" stroke="#ff00ff" stroke-width="2" stroke-dasharray="8,4" fill="none"
            style="stroke-dashoffset:160; animation:trailDash 1.6s linear infinite"/>
      <rect x="218" y="22" width="42" height="42" rx="8" fill="#1a1a2a" stroke="#00ff99" stroke-width="2"/>
      <text x="239" y="50" text-anchor="middle" font-size="20">🎒</text>
      <g style="animation:dragM 1.6s ease-in-out infinite alternate">
        <rect x="10" y="82" width="42" height="65" rx="21" fill="#2a2a3a" stroke="#888" stroke-width="1.5"/>
        <rect x="10" y="82" width="20" height="30" rx="10" fill="#ff00ff" stroke="#888" stroke-width="1"/>
        <line x1="30" y1="82" x2="30" y2="112" stroke="#555" stroke-width="1"/>
        <ellipse cx="21" cy="93" rx="9" ry="13" fill="#f5c5a0" stroke="#c8956b" stroke-width="1.5"/>
        <ellipse cx="21" cy="85" rx="6.5" ry="6" fill="#ffd6b8"/>
      </g>
      <text x="140" y="155" text-anchor="middle" fill="#ff00ff" font-family="monospace" font-size="12">clic gauche maintenu !</text>
    </svg>`;
}

function buildKeyboardSVG(key) {
    const keys = [
        {l:"A",x:35,y:30},{l:"Z",x:70,y:30},{l:"E",x:105,y:30},{l:"R",x:140,y:30},{l:"T",x:175,y:30},
        {l:"Q",x:53,y:65},{l:"S",x:88,y:65},{l:"D",x:123,y:65},{l:"F",x:158,y:65},
        {l:"0",x:88,y:100},{l:"1",x:123,y:100},{l:"2",x:158,y:100}
    ];
    let rects = "";
    let texts = "";

    keys.forEach(k => {
        const isTarget = key === "any" || k.l === key;
        const kColor   = isTarget ? "#00ffff" : "#1d1d1d";
        const sColor   = isTarget ? "#00ffff" : "#555";
        const anim     = isTarget ? `style="animation:kPress 1.4s ease-in-out infinite"` : "";
        rects += `<rect x="${k.x}" y="${k.y}" width="26" height="22" rx="4" fill="${kColor}22" stroke="${sColor}" stroke-width="${isTarget?2:1}" ${anim}/>`;
        texts += `<text x="${k.x+13}" y="${k.y+15}" text-anchor="middle" fill="${isTarget?'#00ffff':'#555'}" font-size="11" font-family="monospace">${k.l}</text>`;
    });

    const targetKey = keys.find(k => k.l === key) || keys[0];
    const fx = targetKey.x + 13;
    const fy = targetKey.y - 12;

    return `<style>
      @keyframes kPress { 0%,60%,100%{transform:translateY(0);fill:#00ffff22} 30%{transform:translateY(5px);fill:#00ffffaa} }
      @keyframes fKey   { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(14px)} }
    </style>
    <svg width="240" height="155" viewBox="0 0 240 155">
      <rect x="18" y="18" width="204" height="118" rx="8" fill="#111" stroke="#333" stroke-width="1.5"/>
      ${rects}${texts}
      <g style="animation:fKey 1.4s ease-in-out infinite; transform-origin:${fx}px ${fy}px">
        <ellipse cx="${fx}" cy="${fy}" rx="10" ry="14" fill="#f5c5a0" stroke="#c8956b" stroke-width="1.5"/>
        <ellipse cx="${fx}" cy="${fy-7}" rx="7" ry="6" fill="#ffd6b8"/>
      </g>
    </svg>`;
}

function showTutorialAnim(lvl, callback) {
    const data = TUTORIAL_DATA[lvl];
    if (!data) {
        if (callback) callback();
        return;
    }

    const overlay = document.getElementById("tutorialOverlay");
    const svgEl   = document.getElementById("tutorialSVG");
    const labelEl = document.getElementById("tutorialLabel");

    svgEl.innerHTML            = data.buildSVG();
    labelEl.innerText          = data.label;
    labelEl.style.borderColor  = data.color;
    labelEl.style.background   = data.color + "22";

    overlay.style.display = "flex";
    overlay.style.opacity = "1";
    overlay.classList.remove("tutFadeOut");

    function dismiss() {
        clearTimeout(timer);
        overlay.removeEventListener("click", dismiss);
        overlay.classList.add("tutFadeOut");
        setTimeout(() => {
            overlay.style.display = "none";
            overlay.classList.remove("tutFadeOut");
            if (callback) callback();
        }, 400);
    }

    overlay.addEventListener("click", dismiss);
    const timer = setTimeout(dismiss, 15000);
}

// ============================================================
//  ANIMATION FOCUS / BLUR SUR LE CHAMP DE SAISIE
//  Le style est désormais dans style.css (#inputZone, #textInput)
//  On gère ici seulement les classes active/idle et le curseur.
// ============================================================

function initTextInputListeners() {

    // Cliquer n'importe où dans la zone input donne le focus au champ
    inputZone.addEventListener("click", () => {
        textInput.focus();
    });

    textInput.addEventListener("focus", () => {
        textInput.classList.remove("idle");
        textInput.classList.add("typing");
        const cursor = document.getElementById("inputCursor");
        if (cursor) {
            cursor.style.animation = "none";
            cursor.style.opacity   = "1";
            cursor.textContent     = "▮ TAPE ICI ▮";
        }
    });

    textInput.addEventListener("blur", () => {
        textInput.classList.remove("typing");
        textInput.classList.add("idle");
        const cursor = document.getElementById("inputCursor");
        if (cursor) {
            cursor.style.animation = "cursorIdleBlink 2s ease-in-out infinite";
            cursor.textContent     = "▮";
        }
    });
}

// ============================================================
//  INIT AU DÉMARRAGE
// ============================================================

instruction.setAttribute("data-level", level);
initTextInputListeners();
updateUI();
updateBackground();
updateXP();

// ============================================================
//  VIES : AFFICHAGE
// ============================================================

function updateLivesDisplay() {
    const el = document.getElementById("livesCount");
    if (el) el.innerText = lives;

    // Griser le bouton vie si aucune vie disponible
    const btn = document.getElementById("useLifeBtn");
    if (btn) {
        btn.disabled      = lives <= 0;
        btn.style.opacity = lives <= 0 ? "0.4" : "1";
    }
}

// ============================================================
//  COMBO : incrémenter ou réinitialiser
// ============================================================

// Appelé par nextLevel() quand un niveau est validé
function incrementCombo() {
    if (hadPenaltyThisLevel) {
        // Faute commise ce niveau → on casse le combo
        comboCount = 0;
    } else {
        comboCount++;
    }

    // Bonus +7 pts tous les 5 niveaux parfaits
    if (!hadPenaltyThisLevel && comboCount > 0 && comboCount % 5 === 0) {
        score += 7;
        Sounds.jouerCombo(comboCount);
        showComboBonus(comboCount);
    }

    // Bonus vie tous les 20 niveaux parfaits
    if (!hadPenaltyThisLevel && comboCount > 0 && comboCount % 20 === 0) {
        gainLife();
    }

    hadPenaltyThisLevel = false;
    updateComboDisplay();
    updateUI();
}

// Appelé par takePenalty() pour casser le combo
function breakCombo() {
    hadPenaltyThisLevel = true;
    comboCount = 0;
    updateComboDisplay();
}

// ============================================================
//  COMBO : affichage du compteur en haut à gauche
// ============================================================

function updateComboDisplay() {
    const el = document.getElementById("comboDisplay");
    if (!el) return;

    if (comboCount >= 5) {
        el.style.display = "flex";
        el.innerHTML = `🔥 COMBO × ${comboCount} <span style="font-size:12px;color:#ffcc00;margin-left:8px">+7 pts/niveau</span>`;
    } else if (comboCount >= 2) {
        el.style.display = "flex";
        el.innerHTML = `⚡ ${comboCount} niveaux parfaits`;
    } else {
        el.style.display = "none";
    }
}

// ============================================================
//  EFFET VISUEL : BONUS +7 PTS (combo 5+)
// ============================================================

function showComboBonus(count) {
    updateComboDisplay();

    // Popup arcade au centre de l'écran
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:38px;margin-bottom:6px">🔥</div>
        <div style="font-size:22px;font-weight:900;letter-spacing:3px;color:#ffea00;
                    text-shadow:0 0 10px #ffea00,0 0 20px #ff00ff;font-family:monospace">
            COMBO × ${count}
        </div>
        <div style="font-size:16px;color:#00ff99;margin-top:4px;letter-spacing:2px">
            + 7 POINTS BONUS !
        </div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "50%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.5)",
        background    : "linear-gradient(135deg,#1a0030,#2b0050)",
        border        : "3px solid #ff00ff",
        borderRadius  : "18px",
        padding       : "22px 36px",
        textAlign     : "center",
        boxShadow     : "0 0 30px #ff00ff,0 0 60px rgba(255,0,255,0.4)",
        zIndex        : "99990",
        pointerEvents : "none",
        opacity       : "0",
        transition    : "opacity 0.2s ease, transform 0.3s cubic-bezier(0.22,1.8,0.36,1)"
    });
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.opacity   = "1";
        popup.style.transform = "translate(-50%,-50%) scale(1)";
    });

    setTimeout(() => {
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%,-50%) scale(0.7)";
        setTimeout(() => popup.remove(), 300);
    }, 1600);
}

// ============================================================
//  GAIN D'UNE VIE : effet "+1UP" style arcade
// ============================================================

function gainLife() {
    if (lives >= maxLives) return;
    lives++;
    updateLivesDisplay();
    Sounds.jouer("oneUp");
    show1UP();
}

function show1UP() {
    // Popup "1UP" qui monte et disparaît
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:50px">❤️</div>
        <div style="font-size:32px;font-weight:900;letter-spacing:4px;
                    color:#ff3cac;text-shadow:0 0 10px #ff3cac,0 0 20px #ff00ff,3px 3px 0 #000;
                    font-family:monospace">+1UP</div>
        <div style="font-size:13px;color:#fff;letter-spacing:2px;margin-top:4px">NOUVELLE VIE !</div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        bottom        : "140px",
        right         : "30px",
        background    : "linear-gradient(135deg,#2a0030,#500050)",
        border        : "3px solid #ff3cac",
        borderRadius  : "16px",
        padding       : "18px 28px",
        textAlign     : "center",
        boxShadow     : "0 0 20px #ff3cac, 0 0 40px rgba(255,60,172,0.5)",
        zIndex        : "99991",
        pointerEvents : "none",
        opacity       : "1",
        transition    : "opacity 0.4s ease, transform 0.4s ease",
        transform     : "translateY(0px) scale(1)",
        animation     : "none"
    });
    document.body.appendChild(popup);

    // Phase 1 : monte pendant ~1s (33 frames × 30ms)
    // Phase 2 : reste visible 2s supplémentaires
    // Phase 3 : disparaît
    let frame = 0;
    const RISE_FRAMES = 33;

    const anim = setInterval(() => {
        frame++;
        if (frame <= RISE_FRAMES) {
            const y = -frame * 1.8;
            popup.style.transform = `translateY(${y}px) scale(${frame < 10 ? 1 + frame * 0.01 : 1})`;
        }
        // Après la montée, on attend 2s supplémentaires (≈ 67 frames à 30ms)
        if (frame >= RISE_FRAMES + 67) {
            clearInterval(anim);
            popup.style.opacity = "0";
            setTimeout(() => popup.remove(), 400);
        }
    }, 30);
}

// ============================================================
//  RELANCE DU NIVEAU (bouton 🔄 -10pts)
// ============================================================

function restartCurrentLevel() {
    if (level <= 1) return;
    Sounds.jouer("restart");
    score = Math.max(0, score - restartCost);
    showPenaltyPopup(restartCost);
    gameHasHadPenalty = true; // une relance casse aussi le PERFECT
    breakCombo();
    updateUI();
    loadLevel();
}

// ============================================================
//  UTILISER UNE VIE (relance sans perdre de points)
// ============================================================

function useLife() {
    if (lives <= 0) return;
    lives--;
    updateLivesDisplay();
    showLifeUsedEffect();
    loadLevel();
}

function showLifeUsedEffect() {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:36px">🛡️</div>
        <div style="font-size:20px;font-weight:900;color:#00ffff;letter-spacing:3px;font-family:monospace">
            VIE UTILISÉE
        </div>
        <div style="font-size:13px;color:#aaa;margin-top:4px">Relance sans pénalité !</div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "50%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.8)",
        background    : "rgba(0,20,40,0.92)",
        border        : "2px solid #00ffff",
        borderRadius  : "16px",
        padding       : "20px 32px",
        textAlign     : "center",
        boxShadow     : "0 0 20px cyan",
        zIndex        : "99990",
        pointerEvents : "none",
        opacity       : "0",
        transition    : "all 0.25s ease"
    });
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.opacity   = "1";
        popup.style.transform = "translate(-50%,-50%) scale(1)";
    });

    setTimeout(() => {
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%,-50%) scale(0.8)";
        setTimeout(() => popup.remove(), 250);
    }, 1200);
}

// ============================================================
//  LISTENERS DES BOUTONS RELANCE / VIE
// ============================================================

document.getElementById("restartBtn").addEventListener("click", () => {
    restartCurrentLevel();
});

document.getElementById("useLifeBtn").addEventListener("click", () => {
    useLife();
});

// Init vies au démarrage
updateLivesDisplay();
updateComboDisplay();

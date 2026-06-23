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

// ============================================================
//  EFFET TYPEWRITER SUR LES INSTRUCTIONS
//  Affiche le texte lettre par lettre, style GameBoy/RPG.
//  - Vitesse : 28ms par caractère (rapide mais lisible)
//  - Pause sur les fins de phrase (. ! ?) : 280ms
//  - Clic ou touche Espace → skip (affiche le texte entier d'un coup)
//  - Curseur clignotant à la fin
// ============================================================

let _typewriterTimeout    = null;
let _typewriterSkipHandler = null; // référence pour pouvoir le retirer depuis l'extérieur

function typewriterInstruction(text) {

    // Annuler tout typewriter en cours ET retirer ses anciens listeners
    // (sinon le texte du niveau précédent continue de s'écrire en fond,
    // et ses listeners de clic/touche restent actifs et gênent le niveau suivant)
    cancelTypewriter();

    instruction.innerText = "";
    instruction.setAttribute("data-level", level);

    let i = 0;
    const CHAR_DELAY   = 28;   // ms entre chaque caractère
    const PAUSE_DELAY  = 280;  // ms après . ! ?

    function typeNext() {
        if (i >= text.length) {
            // Fin : curseur clignotant
            instruction.innerHTML = escapeHtml(text) + '<span class="typeCursor">▌</span>';
            cleanupListeners();
            return;
        }

        const char = text[i];
        instruction.innerHTML = escapeHtml(text.slice(0, i + 1)) + '<span class="typeCursor">▌</span>';
        i++;

        // Pause plus longue sur ponctuation de fin de phrase
        const delay = /[.!?]/.test(char) ? PAUSE_DELAY : CHAR_DELAY;
        _typewriterTimeout = setTimeout(typeNext, delay);
    }

    function cleanupListeners() {
        instruction.removeEventListener("click", skipHandler);
        document.removeEventListener("keydown", skipHandler);
        _typewriterSkipHandler = null;
    }

    // Skip : clic sur l'instruction ou touche Espace → affiche tout d'un coup
    function skipHandler(e) {
        if (e.type === "keydown" && e.key !== " ") return;
        clearTimeout(_typewriterTimeout);
        _typewriterTimeout = null;
        instruction.innerHTML = escapeHtml(text) + '<span class="typeCursor">▌</span>';
        cleanupListeners();
    }

    _typewriterSkipHandler = skipHandler;
    instruction.addEventListener("click", skipHandler);
    document.addEventListener("keydown", skipHandler);

    typeNext();
}

// Annule un typewriter en cours et retire proprement ses listeners.
// Appelée au début de chaque nouveau typewriterInstruction(), et aussi
// quand on quitte le niveau 1 sans attendre la fin de l'animation
// (ex: clic sur "Suivant" avant que le texte ait fini de s'écrire).
function cancelTypewriter() {
    if (_typewriterTimeout) {
        clearTimeout(_typewriterTimeout);
        _typewriterTimeout = null;
    }
    if (_typewriterSkipHandler) {
        instruction.removeEventListener("click", _typewriterSkipHandler);
        document.removeEventListener("keydown", _typewriterSkipHandler);
        _typewriterSkipHandler = null;
    }
}

// Échappe le HTML pour éviter toute injection via les textes de niveaux
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/\n/g, "<br>");
}

// Échappement adapté aux attributs HTML (title, alt...), sans transformer
// les retours à la ligne en balises <br> qui s'afficheraient comme du texte brut.
function escapeAttr(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

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


//  ANIMATION DOUBLE XP
//  Séquence :
//   1. Popup "+base pts" monte (comme score normal)
//   2. Flash "× N !" sur le panneau score
//   3. Compteur animé du score de base → score total
//   4. Flash doré final
// ============================================================

function showDoubleXpAnimation(base, total) {

    const multiplier = total / base;

    // --- ÉTAPE 1 : popup score de base (comme d'habitude) ---
    const popup1 = document.createElement("div");
    popup1.className = "scorePopup";
    popup1.innerText = "+ " + base + " pts";
    popup1.style.top = "120px";
    document.body.appendChild(popup1);

    // --- ÉTAPE 2 : après 900ms, apparition du multiplicateur ---
    setTimeout(() => {
        popup1.remove();

        // Bandeau "× N !" centré sur le panneau score
        const multiplierBadge = document.createElement("div");
        multiplierBadge.id = "doubleXpBadge";
        multiplierBadge.innerHTML = `
            <div style="font-size:14px;color:rgba(255,255,255,0.7);letter-spacing:2px;
                        font-family:monospace">DOUBLE XP</div>
            <div style="font-size:48px;font-weight:900;font-family:'Orbitron',monospace;
                        color:#ffea00;text-shadow:0 0 16px #ffea00,0 0 32px #ff00ff;
                        letter-spacing:4px;line-height:1">
                × ${multiplier}
            </div>
        `;
        Object.assign(multiplierBadge.style, {
            position      : "fixed",
            top           : "50%",
            left          : "50%",
            transform     : "translate(-50%,-50%) scale(0.4)",
            background    : "linear-gradient(135deg,#1a0030,#2b0050)",
            border        : "3px solid #ffea00",
            borderRadius  : "18px",
            padding       : "18px 36px",
            textAlign     : "center",
            boxShadow     : "0 0 40px #ffea00, 0 0 80px rgba(255,0,255,0.4)",
            zIndex        : "99992",
            pointerEvents : "none",
            opacity       : "0",
            transition    : "opacity 0.25s ease, transform 0.35s cubic-bezier(0.22,1.8,0.36,1)"
        });
        document.body.appendChild(multiplierBadge);

        requestAnimationFrame(() => {
            multiplierBadge.style.opacity   = "1";
            multiplierBadge.style.transform = "translate(-50%,-50%) scale(1)";
        });

        Sounds.jouer("comboBoost");

        // Flash doré sur le panneau score
        const scorePanel = document.getElementById("scorePanel");
        scorePanel.classList.add("doubleXpFlash");

    }, 900);

    // --- ÉTAPE 3 : compteur animé du score ---
    // Le score a déjà été ajouté dans nextLevel(), on repart de
    // (score - total + base) pour animer jusqu'à score
    const scoreEl = document.getElementById("floatingScore");
    const startVal = score - total + base; // valeur après les points de base
    const endVal   = score;                // valeur finale avec le multiplicateur
    const duration = 1800; // ms
    const startTime = performance.now() + 1200; // démarre après l'apparition du badge

    function animateCount(now) {
        if (now < startTime) { requestAnimationFrame(animateCount); return; }
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing "ease-out"
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(startVal + (endVal - startVal) * eased);
        scoreEl.innerText = current;
        scoreText.innerText = "Score : " + current;
        if (progress < 1) {
            requestAnimationFrame(animateCount);
        } else {
            scoreEl.innerText   = endVal;
            scoreText.innerText = "Score : " + endVal;
        }
    }
    requestAnimationFrame(animateCount);

    // --- ÉTAPE 4 : popup total + nettoyage ---
    setTimeout(() => {
        const popup2 = document.createElement("div");
        popup2.className = "scorePopup";
        popup2.innerText = "+ " + total + " pts";
        popup2.style.top    = "120px";
        popup2.style.color  = "#ffea00";
        popup2.style.border = "1px solid #ffea00";
        document.body.appendChild(popup2);
        setTimeout(() => popup2.remove(), 2000);
    }, 1800);

    setTimeout(() => {
        const badge = document.getElementById("doubleXpBadge");
        if (badge) {
            badge.style.opacity   = "0";
            badge.style.transform = "translate(-50%,-50%) scale(0.7)";
            setTimeout(() => badge.remove(), 300);
        }
        const scorePanel = document.getElementById("scorePanel");
        scorePanel.classList.remove("doubleXpFlash");
    }, 3200);
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

        // Le popup masquait le clavier au niveau 21 : on s'assure que
        // le suivi de la souris est bien actif une fois qu'il disparaît,
        // sans attendre que le joueur bouge la souris de lui-même.
        if (level === 21) {
            handleLevel21();
        }
    }

    // Fermer au clic n'importe où, ou en appuyant sur une touche
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", dismiss);

    // Auto-fermeture plus courte (5s) pour ne pas bloquer trop longtemps
    // l'accès visuel au clavier sur ce niveau précis
    const autoHide = setTimeout(dismiss, 5000);
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

        score                     = 0;
        level                     = 2;
        currentRank               = "Débutant";
        gameHasHadPenalty         = false;
        hadPenaltyThisLevel       = false;
        comboFirstShown           = false;
        streakPoints              = 0;
        bonusInventory            = [];
        activeBonus               = null;
        lastStreakThresholdGiven  = 0;
        comboBoostStreak          = 0;
        comboBoostPending         = false;
        shieldActive              = false;
        shieldUsesLeft            = 0;
        doubleXpActive            = false;
        doubleXpMultiplier        = 1;

        deleteSave(); // on repart de zéro → effacer la sauvegarde

        document.getElementById("victoryScreen").style.display = "none";
        updateStreakDisplay();
        updateBonusInventoryDisplay();
        updateActiveBonusDisplay();
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

    // Application des effets de bonus actifs au démarrage du timer
    let startSeconds = seconds;
    freezeActive       = false;
    slowTimeActive     = false;
    slowTimeMultiplier = 1;

    let freezeSecondsLeft   = 0;
    let slowTimeSecondsLeft = 0;

    _timerTotalSeconds  = startSeconds;
    timerSeconds        = startSeconds;
    timerBonusPoints    = TIMER_BONUS_MAX;
    _bonusDecayTick     = 0;

    const panel      = document.getElementById("timerPanel");
    const ring       = document.getElementById("timerRing");
    const number     = document.getElementById("timerNumber");
    const bonusFill  = document.getElementById("timerBonusFill");
    const bonusNum   = document.getElementById("timerBonusNum");


    objectCounter.style.display = "none";

    // Montrer le panneau chrono AVANT d'appliquer les effets visuels de bonus
    // (sinon la classe .frozen/.slowed serait ajoutée à un panneau encore caché)
    panel.style.display = "flex";
    panel.classList.remove("urgent");
    panel.classList.remove("timerStart");
    void panel.offsetWidth; // forcer le reflow pour relancer l'animation
    panel.classList.add("timerStart");
    setTimeout(() => panel.classList.remove("timerStart"), 600);

    // Son de démarrage du chrono (optionnel, si le fichier existe)
    Sounds.jouer("timerStart");

    // --- Maintenant que le panneau est visible, on applique les bonus actifs ---

     // Application des bonus freeze/slowtime en attente au démarrage du timer
    const pendingSlowtime = activeBonuses.find(b => b.type === "slowtime");
    const pendingFreeze   = activeBonuses.find(b => b.type === "freeze");

    if (pendingSlowtime) {
        const boosted = pendingSlowtime.boosted;
        startSeconds        += boosted ? 10 : 5;
        _timerTotalSeconds   = startSeconds;
        timerSeconds         = startSeconds;
        slowTimeActive       = true;
        slowTimeMultiplier   = 0.5;
        slowTimeSecondsLeft  = boosted ? 10 : 7;
        clearActiveBonus("slowtime");
        showBonusActivatedPopup({ type: "slowtime", boosted });
        applySlowtimeChromeEffect(slowTimeSecondsLeft);
    }

    if (pendingFreeze) {
        const boosted = pendingFreeze.boosted;
        if (pendingSlowtime) {
            // Slowtime actif → freeze attendra dans activeBonuses,
            // il sera enchaîné automatiquement dans applySlowtimeNow()
        } else {
            freezeActive      = true;
            freezeSecondsLeft = boosted ? 15 : 10;
            clearActiveBonus("freeze");
            showBonusActivatedPopup({ type: "freeze", boosted });
            applyFreezeChromeEffect(freezeSecondsLeft);
        }
    }

    // Init visuel (recalculé après l'éventuel ajustement de durée par +Temps)
    _updateTimerVisuals(ring, number, bonusFill, bonusNum);

    // Tick toutes les secondes — mais le rythme réel dépend du gel/ralentissement
    function tick() {

        // Gel du temps : le chrono ne descend pas du tout
        if (freezeSecondsLeft > 0) {
            freezeSecondsLeft--;
            _updateTimerVisuals(ring, number, bonusFill, bonusNum);
            if (freezeSecondsLeft <= 0) freezeActive = false;
            timerInterval = setTimeout(tick, 1000);
            return;
        }

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
            return;
        }

        // Ralentissement actif : le prochain tick met 2x plus de temps (0.5x vitesse)
        let nextDelay = 1000;
        if (slowTimeSecondsLeft > 0) {
            slowTimeSecondsLeft--;
            nextDelay = 1000 / slowTimeMultiplier; // 0.5x vitesse = délai doublé
            if (slowTimeSecondsLeft <= 0) {
                slowTimeActive     = false;
                slowTimeMultiplier = 1;
            }
        }

        timerInterval = setTimeout(tick, nextDelay);
    }

    timerInterval = setTimeout(tick, freezeSecondsLeft > 0 ? 1000 : (slowTimeSecondsLeft > 0 ? 1000 / slowTimeMultiplier : 1000));
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
        clearTimeout(timerInterval); // interchangeable avec clearInterval en JS
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

    // Bouclier actif : on ignore complètement cette erreur (pas de points perdus,
    // pas de casse de série, pas de marquage "partie imparfaite")
    if (shieldActive && shieldUsesLeft > 0) {
        shieldUsesLeft--;
        showShieldBlockedPopup(shieldUsesLeft);
        if (shieldUsesLeft <= 0) {
            shieldActive = false;
            clearActiveBonus();
        }
        return;
    }

    penaltyCooldown = true;
    setTimeout(() => { penaltyCooldown = false; }, 1000);

    // Cette partie n'est plus "parfaite" — utilisé pour le bonus PERFECT
    gameHasHadPenalty = true;

    // Signale une faute sur le niveau en cours (série de performance)
    breakStreak();

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
//  POPUP : ERREUR BLOQUÉE PAR LE BOUCLIER
// ============================================================

function showShieldBlockedPopup(usesLeft) {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:30px">🛡️</div>
        <div style="font-size:15px;font-weight:900;color:#00ffff;letter-spacing:1px;
                    font-family:'Orbitron',monospace;margin-top:4px">
            ERREUR BLOQUÉE !
        </div>
        ${usesLeft > 0 ? `<div style="font-size:11px;color:#aaa;margin-top:2px">${usesLeft} protection(s) restante(s)</div>` : ""}
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "45%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.7)",
        background    : "rgba(0,20,40,0.92)",
        border        : "2px solid #00ffff",
        borderRadius  : "14px",
        padding       : "14px 24px",
        textAlign     : "center",
        boxShadow     : "0 0 18px cyan",
        zIndex        : "99989",
        pointerEvents : "none",
        opacity       : "0",
        transition    : "all 0.2s ease"
    });
    document.body.appendChild(popup);

    requestAnimationFrame(() => {
        popup.style.opacity   = "1";
        popup.style.transform = "translate(-50%,-50%) scale(1)";
    });

    setTimeout(() => {
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%,-50%) scale(0.7)";
        setTimeout(() => popup.remove(), 200);
    }, 900);
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
    tutorialOverlayActive = true;

    let dismissed = false;

    function dismiss() {
        if (dismissed) return;
        dismissed = true;

        clearTimeout(timer);
        overlay.removeEventListener("click", dismiss);
        document.removeEventListener("mousemove", moveDismiss);

        overlay.classList.add("tutFadeOut");
        setTimeout(() => {
            overlay.style.display = "none";
            overlay.classList.remove("tutFadeOut");
            tutorialOverlayActive = false;
            if (callback) callback();
        }, 400);
    }

    // Le tutoriel se ferme aussi dès que le joueur bouge la souris :
    // utile pour les niveaux où l'action attendue est justement un
    // mouvement de souris (ex: niveau 2, "déplace la souris vers le fromage"),
    // sinon le joueur ne voit pas la cible et ne sait pas où viser tant
    // qu'il n'a pas explicitement cliqué pour fermer l'overlay.
    let initialMoveIgnored = false;
    function moveDismiss() {
        // On ignore le tout premier événement mousemove qui peut être
        // déclenché artificiellement juste après l'affichage de l'overlay.
        if (!initialMoveIgnored) {
            initialMoveIgnored = true;
            return;
        }
        dismiss();
    }

    overlay.addEventListener("click", dismiss);
    document.addEventListener("mousemove", moveDismiss);

    // Délai d'auto-fermeture réduit (15s → 8s) pour ne pas bloquer trop
    // longtemps l'accès visuel au reste du niveau.
    const timer = setTimeout(dismiss, 8000);
}

// ============================================================
//  ANIMATION FOCUS / BLUR SUR LE CHAMP DE SAISIE
//  Le style est désormais dans style.css (#inputZone, #textInput)
//  On gère ici seulement les classes active/idle et le curseur.
// ============================================================

// ============================================================
//  RÉVÉLER LA ZONE DE TEXTE APRÈS LE TRI (niveaux 49 et 50)
//  Ces niveaux cachent volontairement la zone d'écriture tant
//  que le joueur n'a pas fini de trier les objets dans les sacs.
// ============================================================

function showInputZoneFor49And50() {
    inputZone.style.display = "flex";
    textInput.classList.add("idle");
    textInput.classList.remove("typing");

    // Toujours au-dessus des sacs, comme pour les autres niveaux avec sacs
    inputZone.style.bottom    = "170px";
    inputZone.style.top       = "auto";
    inputZone.style.transform = "translateX(-50%)";

    validateBtn.style.display = "none"; // ces niveaux valident automatiquement

    setTimeout(() => { textInput.focus(); }, 100);
}

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
//  SYSTÈME DE SÉRIE DE PERFORMANCE
//  Règle : niveau réussi sans faute = +1 point de série
//          erreur = -3 points de série (minimum 0)
// ============================================================

// Appelé par nextLevel() quand un niveau est validé
function incrementStreak() {

    if (hadPenaltyThisLevel) {
        // Une faute a été commise sur ce niveau → pénalité de série
        streakPoints = Math.max(0, streakPoints - 3);
        comboBoostStreak = 0; // le Combo Boost se réinitialise sur la moindre faute
    } else {
        streakPoints++;
        comboBoostStreak++;

        // Vérifier si un seuil de bonus vient d'être franchi
        checkStreakBonusUnlock();

        // Vérifier le Combo Boost (24 niveaux consécutifs sans faute)
        if (comboBoostStreak > 0 && comboBoostStreak % COMBO_BOOST_THRESHOLD === 0) {
            comboBoostPending = true;
            showComboBoostUnlocked();
        }
    }

    hadPenaltyThisLevel = false;
    updateStreakDisplay();
    updateUI();
}

// Appelé par takePenalty() pour signaler une faute sur le niveau en cours
function breakStreak() {
    hadPenaltyThisLevel = true;
    updateStreakDisplay();
}

// ============================================================
//  DÉBLOCAGE DES BONUS PAR PALIER DE SÉRIE
//  Cycle : 5, 10, 15, 20, 25(=5+20), 30(=10+20), 35, 40, 45, 50...
// ============================================================

function checkStreakBonusUnlock() {

    // Le palier dans le cycle de 20 (5, 10, 15, ou 20/0)
    const cyclePos = streakPoints % 20;

    // On ne redonne pas deux fois le même seuil consécutivement
    if (streakPoints <= lastStreakThresholdGiven) return;

    let bonusType = null;

    if (cyclePos === 5)       bonusType = "doubleXp";
    else if (cyclePos === 10) bonusType = "shield";
    else if (cyclePos === 15) bonusType = "slowtime";
    else if (cyclePos === 0 && streakPoints > 0) bonusType = "freeze"; // 20, 40, 60...

    if (bonusType) {
        lastStreakThresholdGiven = streakPoints;
        unlockBonus(bonusType);
    }
}

const BONUS_INFO = {
    doubleXp : { icon: "✨", label: "Double XP",        desc: "x2 points sur le prochain niveau" },
    shield   : { icon: "🛡️", label: "Bouclier",          desc: "Ignore 1 erreur sans pénalité" },
    slowtime : { icon: "⏳", label: "+5sec et temps ralenti",  desc: "+5s et ralenti pendant 7s" },
    freeze   : { icon: "❄️", label: "Gel du temps",       desc: "Chrono figé pendant 10s" }
};

const BONUS_INFO_BOOSTED = {
    doubleXp : { icon: "✨", label: "Double XP BOOSTÉ",       desc: "x3 points sur le prochain niveau" },
    shield   : { icon: "🛡️", label: "Bouclier BOOSTÉ",        desc: "Ignore 2 erreurs sans pénalité" },
    slowtime : { icon: "⏳", label: "+ 10sec et temps ralenti",  desc: "+10s et ralenti pendant 15s" },
    freeze   : { icon: "❄️", label: "Gel du temps BOOSTÉ",     desc: "Chrono figé pendant 15s" }
};

// Ajoute un bonus à l'inventaire (consommable, à activer plus tard)
function unlockBonus(type) {
    const boosted = comboBoostPending;
    if (boosted) comboBoostPending = false;

    bonusInventory.push({ type: type, boosted: boosted });

    Sounds.jouer(boosted ? "combo20" : "combo10");
    showBonusUnlockedPopup(type, boosted);
    updateBonusInventoryDisplay();

    // Tuto flèche au premier bonus débloqué
    setTimeout(() => showBonusCardTutorial(), 1600);
}

// ============================================================
//  AFFICHAGE DU COMPTEUR DE SÉRIE (haut à gauche)
// ============================================================

function updateStreakDisplay() {
    const el = document.getElementById("comboDisplay");
    if (!el) return;

    if (streakPoints >= 5) {
        el.style.display = "flex";
        const nextThreshold = (Math.floor(streakPoints / 5) + 1) * 5;
        el.innerHTML = `🔥 SÉRIE × ${streakPoints} <span style="font-size:12px;color:#ffcc00;margin-left:8px">prochain bonus à ${nextThreshold}</span>`;
    } else if (streakPoints >= 1) {
        el.style.display = "flex";
        el.innerHTML = `⚡ Série : ${streakPoints}`;
    } else {
        el.style.display = "none";
    }
}

// ============================================================
//  POPUP : BONUS DÉBLOQUÉ
// ============================================================

function showBonusUnlockedPopup(type, boosted) {

    const info = boosted ? BONUS_INFO_BOOSTED[type] : BONUS_INFO[type];
    const displayDuration = bonusUnlockedFirstShown ? 1400 : 3000;
    bonusUnlockedFirstShown = true;

    const borderColor = boosted ? "#ffea00" : "#ff00ff";
    const glow         = boosted
        ? "0 0 30px #ffea00, 0 0 60px rgba(255,234,0,0.5)"
        : "0 0 30px #ff00ff, 0 0 60px rgba(255,0,255,0.4)";

    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:38px;margin-bottom:6px">${info.icon}</div>
        <div style="font-size:20px;font-weight:900;letter-spacing:2px;color:${boosted ? '#ffea00' : '#ff00ff'};
                    text-shadow:0 0 10px currentColor;font-family:'Orbitron',monospace">
            ${boosted ? "⚡ " : ""}BONUS DÉBLOQUÉ
        </div>
        <div style="font-size:18px;color:#00ff99;margin-top:6px;font-weight:bold">
            ${info.label}
        </div>
        <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px">
            ${info.desc}
        </div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "50%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.5)",
        background    : "linear-gradient(135deg,#1a0030,#2b0050)",
        border        : `3px solid ${borderColor}`,
        borderRadius  : "18px",
        padding       : "22px 36px",
        textAlign     : "center",
        boxShadow     : glow,
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
        setTimeout(() => popup.remove(), 250);
    }, displayDuration);
}

// ============================================================
//  POPUP : COMBO BOOST DÉBLOQUÉ (24 niveaux sans faute)
// ============================================================

function showComboBoostUnlocked() {
    Sounds.jouer("combo20");

    const displayDuration = comboBoostFirstShown ? 2200 : 3000;
    comboBoostFirstShown = true;

    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:46px;margin-bottom:6px">⚡🔥</div>
        <div style="font-size:32px;font-weight:900;letter-spacing:4px;
                    font-family:'Orbitron',monospace;color:#ffea00;
                    text-shadow:0 0 12px #ffea00,0 0 24px #ff00ff,0 0 40px #ff00ff">
            COMBO BOOST
        </div>
        <div style="font-size:14px;color:#00ff99;margin-top:8px;letter-spacing:1px;font-weight:bold">
            Ton prochain bonus sera amélioré !
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
        padding       : "26px 44px",
        textAlign     : "center",
        boxShadow     : "0 0 40px #ffea00, 0 0 80px rgba(255,0,255,0.5)",
        zIndex        : "999998",
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
        popup.style.opacity   = "0";
        popup.style.transform = "translate(-50%,-50%) scale(0.8) rotate(3deg)";
        setTimeout(() => popup.remove(), 350);
    }, displayDuration);
}

// ============================================================
//  RELANCE DU NIVEAU — gratuite, sans pénalité de points
// ============================================================

function restartCurrentLevel() {
    if (level <= 1) return;
    Sounds.jouer("restart");
    loadLevel();
}

// ============================================================
//  INVENTAIRE DES BONUS : AFFICHAGE
// ============================================================

function updateBonusInventoryDisplay() {
    const panel = document.getElementById("bonusPanel");
    const list  = document.getElementById("bonusInventoryList");
    if (!panel || !list) return;

    if (bonusInventory.length === 0 && activeBonuses.length === 0) {
        panel.style.display = "none";
        return;
    }

    // Regrouper les bonus identiques (même type + même état boosted)
    const groups = [];
    bonusInventory.forEach((b, i) => {
        const key = b.type + (b.boosted ? "_boosted" : "");
        const existing = groups.find(g => g.key === key);
        if (existing) {
            existing.count++;
            existing.indices.push(i);
        } else {
            groups.push({ key, type: b.type, boosted: b.boosted, count: 1, indices: [i] });
        }
    });

    panel.style.display = "block";

    // Bonus actif en attente (freeze/slowtime sans timer actif) : affiché en tête
    let activePendingHTML = "";
   const pendingTimerBonuses = activeBonuses.filter(b => b.type === "freeze" || b.type === "slowtime");
    activePendingHTML = pendingTimerBonuses.map(b => {
        const info = b.boosted ? BONUS_INFO_BOOSTED[b.type] : BONUS_INFO[b.type];
        return `
            <button class="bonusItem ${b.boosted ? 'boosted' : ''} bonusPending" disabled>
                <span class="bonusItemIcon">${info.icon}</span>
                <span class="bonusItemLabel">${info.label}</span>
                <span class="bonusItemDesc">${info.desc}</span>
                <span class="bonusPendingBadge">EN ATTENTE</span>
            </button>
        `;
    }).join("");

    const inventoryHTML = groups.map(g => {
        const info          = g.boosted ? BONUS_INFO_BOOSTED[g.type] : BONUS_INFO[g.type];
        const tooltip       = `${info.label} — ${info.desc}`;
        const alreadyActive = activeBonuses.some(b => b.type === g.type);
         return `
            <button class="bonusItem ${g.boosted ? 'boosted' : ''} ${alreadyActive ? 'bonusAlreadyActive' : ''}"
                    onclick="activateBonusFromInventory(event, ${g.indices[0]})"
                    ${alreadyActive ? 'disabled' : ''}>
                <span class="bonusItemIcon">${info.icon}</span>
                <span class="bonusItemLabel">${info.label}</span>
                <span class="bonusItemDesc">${info.desc}</span>
                ${g.count > 1 ? `<span class="bonusItemCount">×${g.count}</span>` : ""}
            </button>
        `;
    }).join("");

    list.innerHTML = activePendingHTML + inventoryHTML;
}

function clearActiveBonus(type) {
    if (type) {
        activeBonuses = activeBonuses.filter(b => b.type !== type);
    } else {
        activeBonuses = [];
    }
    const shield   = activeBonuses.find(b => b.type === "shield");
    const doubleXp = activeBonuses.find(b => b.type === "doubleXp");

    shieldActive       = !!shield;
    shieldUsesLeft     = shield ? (shield.boosted ? 2 : 1) : 0;
    doubleXpActive     = !!doubleXp;
    doubleXpMultiplier = doubleXp ? (doubleXp.boosted ? 3 : 2) : 1;

    updateActiveBonusDisplay();
}

// ============================================================
//  ACTIVATION D'UN BONUS : EFFET VISUEL PLEIN ÉCRAN + SON
//  Chaque type de bonus a son propre habillage visuel.
//  Durée d'affichage : 3s la première fois (par type), 1.4s ensuite.
// ============================================================

function showBonusActivatedPopup(bonus) {

    const type      = bonus.type;
    const boosted   = bonus.boosted;
    const info      = boosted ? BONUS_INFO_BOOSTED[type] : BONUS_INFO[type];
    const isFirst   = !bonusAnnounceFirstShown[type];
    bonusAnnounceFirstShown[type] = true;

    const displayDuration = isFirst ? 3000 : 1400;

    // Son distinct selon le type de bonus
    const soundMap = {
        shield   : "bonusShield",
        doubleXp : "bonusDoubleXp",
        slowtime : "bonusSlowtime",
        freeze   : "bonusFreeze"
    };
    Sounds.jouer(soundMap[type] || "combo10");

    // Habillage visuel plein écran spécifique au type
    const overlay = document.createElement("div");
    overlay.className = "bonusActivateOverlay bonus-" + type;

    const themeColor = {
        shield   : "#00ffff",
        doubleXp : "#ffea00",
        slowtime : "#ff9900",
        freeze   : "#66ccff"
    }[type];

    overlay.innerHTML = `
        <div class="bonusActivateGlow" style="--bonus-color:${themeColor}"></div>
        <div class="bonusActivateContent">
            <div class="bonusActivateIcon">${info.icon}</div>
            <div class="bonusActivateLabel" style="color:${themeColor};text-shadow:0 0 16px ${themeColor}">
                ${boosted ? "⚡ " : ""}${info.label}
            </div>
            <div class="bonusActivateDesc">${info.desc}</div>
        </div>
        ${type === "freeze" ? buildFreezeFrostHTML() : ""}
        ${type === "shield" ? buildShieldRingHTML() : ""}
        ${type === "slowtime" ? buildSlowtimeWaveHTML() : ""}
        ${type === "doubleXp" ? buildDoubleXpBurstHTML() : ""}
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("show"));

    setTimeout(() => {
        overlay.classList.remove("show");
        overlay.classList.add("hide");
        setTimeout(() => overlay.remove(), 400);
    }, displayDuration);

    // NOTE : l'effet persistant sur le panneau chrono (givre/ralenti) ne se
    // déclenche PAS ici, mais au moment réel où le timer démarre, dans
    // startTimer(). Sinon le visuel se termine avant même que le niveau
    // avec chrono ne commence (le joueur ne voit jamais l'effet).
}

// ============================================================
//  ACTIVATION D'UN BONUS DEPUIS L'INVENTAIRE
//  Un seul bonus actif à la fois, à utiliser avant un niveau.
// ============================================================

function activateBonusFromInventory(event, index) {
    event.stopPropagation();
    event.preventDefault();

    const bonus = bonusInventory[index];
    if (!bonus) return;

    // Pas deux fois le même type sur un même niveau
    if (activeBonuses.some(b => b.type === bonus.type)) return;

    // Retirer de l'inventaire
    bonusInventory.splice(index, 1);

    // Pour freeze/slowtime avec timer actif : consommé immédiatement,
    // pas besoin de passer par activeBonuses
    const consumedImmediately =
        (bonus.type === "freeze" || bonus.type === "slowtime") &&
        currentLevelHasTimer && timerInterval;

    if (!consumedImmediately) {
        activeBonuses.push(bonus);
    }

    applyActiveBonusEffect(bonus);
    showBonusActivatedPopup(bonus);
    updateBonusInventoryDisplay();
    updateActiveBonusDisplay();
}

// Applique les effets immédiats du bonus activé selon son type
function applyActiveBonusEffect(bonus) {
    const boosted = bonus.boosted;

    if (bonus.type === "shield") {
        shieldActive   = true;
        shieldUsesLeft = boosted ? 2 : 1;
    }

    if (bonus.type === "doubleXp") {
        doubleXpActive     = true;
        doubleXpMultiplier = boosted ? 3 : 2;
    }

    if (bonus.type === "freeze") {
        if (currentLevelHasTimer && timerInterval) {
            applyFreezeNow(boosted ? 15 : 10);
            clearActiveBonus("freeze");
        }
        // Si pas de timer : reste dans activeBonuses en attente
        updateBonusInventoryDisplay();
    }

    if (bonus.type === "slowtime") {
        if (currentLevelHasTimer && timerInterval) {
            applySlowtimeNow(boosted ? 10 : 7, boosted ? 10 : 5);
            clearActiveBonus("slowtime");
        }
        // Si pas de timer : reste dans activeBonuses en attente
        updateBonusInventoryDisplay();
    }
}  // ← accolade fermante de applyActiveBonusEffect()

// --- Décor SVG/HTML spécifique à chaque type de bonus ---

function buildFreezeFrostHTML() {
    return `
        <svg class="bonusFrostCorners" viewBox="0 0 100 100" preserveAspectRatio="none">
            <text x="2" y="20" font-size="22">❄️</text>
            <text x="78" y="20" font-size="22">❄️</text>
            <text x="2" y="95" font-size="22">❄️</text>
            <text x="78" y="95" font-size="22">❄️</text>
        </svg>
    `;
}

function buildShieldRingHTML() {
    return `<div class="bonusShieldRing"></div>`;
}

function buildSlowtimeWaveHTML() {
    return `<div class="bonusSlowtimeWave"></div>`;
}

function buildDoubleXpBurstHTML() {
    return `<div class="bonusXpBurst">✨✨✨</div>`;
}

// ============================================================
//  EFFET PERSISTANT SUR LE PANNEAU CHRONO PENDANT LE GEL
//  Givre + halo bleu autour du timerPanel, anneau figé visuellement.
// ============================================================

function applyFreezeChromeEffect(durationSeconds) {
    const panel = document.getElementById("timerPanel");
    if (!panel) return;

    panel.classList.add("frozen");
    setTimeout(() => panel.classList.remove("frozen"), durationSeconds * 1000);
}

function applySlowtimeChromeEffect(durationSeconds) {
    const panel = document.getElementById("timerPanel");
    if (!panel) return;

    panel.classList.add("slowed");
    setTimeout(() => panel.classList.remove("slowed"), durationSeconds * 1000);
}

function applyFreezeNow(freezeSecs) {
    if (!currentLevelHasTimer || !timerInterval) return;

    clearTimeout(timerInterval);
    timerInterval = null;
    freezeActive  = true;
    applyFreezeChromeEffect(freezeSecs);

    const t = setTimeout(() => {
        freezeActive = false;

        if (!currentLevelHasTimer) return;

        // Si slowtime attend en file, on l'enchaîne maintenant
        const pending = activeBonuses.find(b => b.type === "slowtime");
        if (pending) {
            const boosted = pending.boosted;
            clearActiveBonus("slowtime");
            // Remettre timerInterval à une valeur non-null pour que
            // applySlowtimeNow() ne soit pas bloqué par la vérification
            timerInterval = setTimeout(() => {}, 0);
            applySlowtimeNow(boosted ? 10 : 7, boosted ? 10 : 5);
        } else {
            // Reprendre le décompte normal
            const ring      = document.getElementById("timerRing");
            const number    = document.getElementById("timerNumber");
            const bonusFill = document.getElementById("timerBonusFill");
            const bonusNum  = document.getElementById("timerBonusNum");

            function tick() {
                timerSeconds--;
                _bonusDecayTick++;
                if (_bonusDecayTick >= TIMER_BONUS_DECAY) {
                    _bonusDecayTick = 0;
                    if (timerBonusPoints > TIMER_BONUS_MIN) timerBonusPoints--;
                }
                _updateTimerVisuals(ring, number, bonusFill, bonusNum);
                if (timerSeconds <= 0) { stopTimer(); timerFailed(); return; }
                timerInterval = setTimeout(tick, 1000);
            }

            timerInterval = setTimeout(tick, 1000);
        }
    }, freezeSecs * 1000);
    levelTimeouts.push(t);
}

function applySlowtimeNow(slowSecs, extraSecs) {
    if (!currentLevelHasTimer || !timerInterval) return;

    clearTimeout(timerInterval);
    timerInterval = null;

    timerSeconds       += extraSecs;
    _timerTotalSeconds += extraSecs;
    slowTimeActive      = true;
    slowTimeMultiplier  = 0.5;

    // Effet visuel orange sur le panneau chrono
    applySlowtimeChromeEffect(slowSecs);

    const ring      = document.getElementById("timerRing");
    const number    = document.getElementById("timerNumber");
    const bonusFill = document.getElementById("timerBonusFill");
    const bonusNum  = document.getElementById("timerBonusNum");

    let slowSecsLeft = slowSecs;

    function tick() {
        // Décrémenter le temps ralenti
        timerSeconds--;
        _bonusDecayTick++;
        if (_bonusDecayTick >= TIMER_BONUS_DECAY) {
            _bonusDecayTick = 0;
            if (timerBonusPoints > TIMER_BONUS_MIN) timerBonusPoints--;
        }

        _updateTimerVisuals(ring, number, bonusFill, bonusNum);

        if (timerSeconds <= 0) { stopTimer(); timerFailed(); return; }

        // Calculer le délai du prochain tick
        let nextDelay = 1000;

        if (slowSecsLeft > 0) {
            slowSecsLeft--;
            nextDelay = 1000 / slowTimeMultiplier; // 2000ms = deux fois plus lent

            if (slowSecsLeft <= 0) {
                // Ralentissement terminé
                slowTimeActive     = false;
                slowTimeMultiplier = 1;

                // Vérifier si un freeze attend en file
                const pending = activeBonuses.find(b => b.type === "freeze");
                if (pending) {
                    const boosted = pending.boosted;
                    clearActiveBonus("freeze");
                    setTimeout(() => {
                        showBonusActivatedPopup({ type: "freeze", boosted });
                        // Remettre timerInterval non-null pour applyFreezeNow
                        timerInterval = setTimeout(() => {}, 0);
                        applyFreezeNow(boosted ? 15 : 10);
                    }, 300);
                    return; // on arrête ce tick, applyFreezeNow reprend la main
                }
            }
        }

        timerInterval = setTimeout(tick, nextDelay);
    }

    // Premier tick au rythme ralenti
    timerInterval = setTimeout(tick, 1000 / slowTimeMultiplier);
}

// ============================================================
//  AFFICHAGE DU BONUS ACTIF SUR LE NIVEAU EN COURS
// ============================================================

function updateActiveBonusDisplay() {
    const el = document.getElementById("activeBonusBadge");
    if (!el) return;

    if (activeBonuses.length === 0) {
        el.style.display = "none";
        return;
    }

    el.style.display = "flex";
    el.style.flexWrap = "wrap";
    el.style.gap = "6px";

    el.innerHTML = activeBonuses.map(b => {
        const info = b.boosted ? BONUS_INFO_BOOSTED[b.type] : BONUS_INFO[b.type];
        const isPending = (b.type === "freeze" || b.type === "slowtime") && !currentLevelHasTimer;
        return `
            <span style="display:inline-flex;align-items:center;gap:4px">
                ${info.icon}
                <span style="margin-left:4px">${info.label}</span>
                ${isPending
                    ? `<span style="margin-left:6px;font-size:11px;color:#ffea00">⏳ en attente chrono</span>`
                    : ""}
            </span>
        `;
    }).join(`<span style="color:#555;margin:0 4px">|</span>`);
}

// ============================================================
//  TUTO PREMIER BONUS : flèche pointant la première carte
// ============================================================

let _bonusTutorialShown = false;

function showBonusCardTutorial() {
    if (_bonusTutorialShown) return;
    _bonusTutorialShown = true;

    const tuto = document.createElement("div");
    tuto.id = "bonusCardTutorial";
    tuto.innerHTML = `
        <div id="bonusCardTutoText">Tu peux utiliser des cartes pour t'aider durant la partie !</div>
        <div id="bonusCardTutoArrow">▼</div>
    `;
    document.body.appendChild(tuto);

    requestAnimationFrame(() => tuto.classList.add("show"));

    const dismiss = () => {
        tuto.classList.remove("show");
        tuto.classList.add("hide");
        setTimeout(() => tuto.remove(), 300);
        document.removeEventListener("click", dismiss);
        clearTimeout(autoHide);
    };

    // Phase 1 : 1.5s non cliquable
    setTimeout(() => {
        // Phase 2 : 3.5s cliquable, puis disparition auto
        document.addEventListener("click", dismiss);
        const autoHide = setTimeout(dismiss, 3500);
    }, 1500);
}

// ============================================================
//  LISTENERS DU BOUTON RELANCE
// ============================================================

document.getElementById("restartBtn").addEventListener("click", () => {
    restartCurrentLevel();
});

// Init affichage au démarrage
updateStreakDisplay();
updateBonusInventoryDisplay();
updateActiveBonusDisplay();

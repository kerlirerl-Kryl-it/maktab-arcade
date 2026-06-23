// ============================================================
//  game.js  (anciennement script.js)
//  Moteur principal : loadLevel, nextLevel, resetAll,
//  clavier visuel, positions aléatoires, niveaux spéciaux.
// ============================================================

// Cacher la fenêtre de jeu au démarrage
gameWindow.style.display = "none";

// ============================================================
//  BOUTON JOUER
// ============================================================

playButton.addEventListener("click", () => {

    if (playButton.disabled) return;

    Sounds.jouer("playBtn", 0.4);

    // Si une sauvegarde existe, on propose de reprendre AVANT de lancer
    // la séquence de chargement classique du menu.
    if (hasSave()) {
        checkSaveOnStart();
        return;
    }

    startNewGameSequence();
});

// ============================================================
//  SÉQUENCE DE LANCEMENT D'UNE NOUVELLE PARTIE
//  (extraite pour être réutilisable depuis l'écran de reprise
//  quand le joueur choisit "Recommencer")
// ============================================================

function startNewGameSequence() {

    gameHasHadPenalty        = false; // nouvelle partie = chance de PERFECT remise à zéro
    comboFirstShown          = false;
    streakPoints             = 0;
    bonusInventory           = [];
    activeBonuses            = [];
    lastStreakThresholdGiven = 0;
    comboBoostStreak         = 0;
    comboBoostPending        = false;
    shieldActive             = false;
    shieldUsesLeft           = 0;
    doubleXpActive           = false;
    doubleXpMultiplier       = 1;

    playButton.disabled = true;
    playButton.classList.add("playFlash");

    setTimeout(() => {
        playButton.classList.remove("playFlash");
        window.scrollTo(0, 0);
        document.body.classList.add("mouseCursor");
        document.getElementById("menu").style.pointerEvents = "none";

        // Animation de chargement
        let dots = 0;
        playButton.innerText = "LOADING";
        Sounds.jouer("loading", 0.2, true);

        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            playButton.innerText = "LOADING" + ".".repeat(dots);
        }, 300);

        setTimeout(() => {
            clearInterval(loadingInterval);
            Sounds.arreter("loading");

            document.getElementById("menu").style.display = "none";
            gameWindow.style.display = "block";
            document.getElementById("livesPanel").style.display = "block";
            updateRecordToBeat();
            loadLevel();
        }, 2000);

    }, 200);
}

// ============================================================
//  PASSER AU NIVEAU SUIVANT
// ============================================================

function nextLevel() {

    if (!canValidate) return;
    if (penaltyAnnounceActive) return; // bloque tant que le popup pénalités est affiché
    canValidate = false;

    // Fermer le tutoriel si visible
    const overlay = document.getElementById("tutorialOverlay");
    if (overlay && overlay.style.display !== "none") {
        overlay.style.display = "none";
        overlay.classList.remove("tutFadeOut");
    }

    Sounds.jouer("levelComplete");
    arcadeSuccessEffect();
    stopTimer();

    // Mise à jour de la série de performance AVANT d'ajouter les points
    if (level > 1) incrementStreak();

     if (level > 1) {
        const xpMultiplier = doubleXpActive ? doubleXpMultiplier : 1;

        if (currentLevelHasTimer) {
            const base  = timerBonusPoints;
            const total = base * xpMultiplier;
            score += total;
            if (xpMultiplier > 1) {
                showDoubleXpAnimation(base, total);
            } else {
                showTimerBonusPopup(total, false);
            }
        } else {
            const base  = 10;
            const total = base * xpMultiplier;
            score += total;
            if (xpMultiplier > 1) {
                showDoubleXpAnimation(base, total);
            } else {
                showScorePopup(total);
            }
        }

        if (doubleXpActive) {
        clearActiveBonus("doubleXp");
        }

        if (shieldActive) {
        clearActiveBonus("shield");
        }
    }

    // Dernier niveau → écran victoire
    if (level === LEVELS.length) {
        setTimeout(() => showVictoryScreen(), 400);
        return;
    }

    setTimeout(() => {
        const previousLevel = level;
        level++;

        // Son de palier (1-10, 11-20, etc.)
        Sounds.jouerNiveau(level);

        // Voix spéciale au passage d'une dizaine
        Sounds.jouerVoixDizaine(previousLevel);

        // Animation "LEVEL UP" tous les 10 niveaux
        if (level % 10 === 1) {
            const lvlTxt = document.getElementById("levelUpText");
            lvlTxt.classList.add("showLevelUp");
            setTimeout(() => lvlTxt.classList.remove("showLevelUp"), 1500);
        }

        updateUI();
        loadLevel();
        saveGame(); // sauvegarde automatique à chaque niveau

        setTimeout(() => { canValidate = true; }, 500);

    }, 250);
}

// ============================================================
//  RESET ENTRE CHAQUE NIVEAU
// ============================================================

function resetAll() {

    // Annuler tout effet typewriter encore actif (sécurité : évite que le
    // texte d'un niveau précédent continue de s'écrire ou que ses listeners
    // de clic/touche restent actifs sur le niveau suivant)
    cancelTypewriter();

    // Sécurité : si un changement de niveau brusque a eu lieu pendant que
    // l'overlay tutoriel était affiché, on s'assure qu'il ne bloque pas
    // la détection du niveau suivant.
    const tutorialOverlay = document.getElementById("tutorialOverlay");
    if (tutorialOverlay && tutorialOverlay.style.display === "none") {
        tutorialOverlayActive = false;
    }

    // Cacher tous les éléments
    const elements = [
        cheese, redApple, greenApple,
        redObject, greenObject, blueObject,
        redBag, greenBag, blueBag, yellowBag,
        keyboard, nextBtn, objectCounter
    ];
    elements.forEach(el => { el.style.display = "none"; });

    // Masquer le wrapper input (gère textInput + validateBtn d'un coup)
    inputZone.style.display = "none";
    textInput.value = "";

    // Réinitialiser les flags
    mouseMoved          = false;
    leftClicked         = false;
    rightClicked        = false;
    sequence            = 0;
    objectsPlaced       = 0;
    objectsTotal        = 0;
    dragOrderIndex      = 0;
    keyPressed          = false;
    wordValidated       = false;
    cheeseDropped       = false;
    clickCount          = 0;
    level7CheeseClicked = false;
    wasDragging         = false;
    wordIndex           = 0;

    // Réinitialiser les positions et styles des éléments
    [cheese, redApple, greenApple, redObject, greenObject, blueObject].forEach(el => {
        el.style.left      = "";
        el.style.top       = "";
        el.style.opacity   = "1";
        el.style.boxShadow = "";
        el.style.transform = "";
    });

    greenObject.style.left = "";
    greenObject.style.top  = "";
    blueObject.style.left  = "";
    blueObject.style.top   = "";

    // Repositionner les pommes pour le niveau 15
    [redApple, greenApple].forEach(el => {
        el.style.position = "absolute";
        el.style.zIndex   = "10";
        el.style.display  = "none";
        el.style.left     = "50%";
        el.style.top      = "50%";
    });

    // Nettoyer les listeners spéciaux
    if (cheese._level43Handler) {
        cheese.removeEventListener("click", cheese._level43Handler);
        cheese._level43Handler = null;
    }
    if (level46ClickHandler) {
        document.removeEventListener("click", level46ClickHandler);
        level46ClickHandler = null;
    }

    // Annuler tous les timeouts en cours
    levelTimeouts.forEach(clearTimeout);
    levelTimeouts = [];

    stopTimer();
    resetPenalty();
    clearChecklist();
}

// ============================================================
//  CHARGEMENT D'UN NIVEAU
// ============================================================

function loadLevel() {

    resetAll();
    updateUI();
    updateBackground();

    const data = LEVELS[level - 1];
    instruction.innerText = data.instruction;
    // Niveau 1 : cacher la zone de jeu — on affiche uniquement l'instruction et le bouton
    const gameArea = document.getElementById("gameArea");
    if (level === 1) {
        gameArea.classList.add("hidden");
    } else {
        gameArea.classList.remove("hidden");
    }

    // --- Checklists selon le niveau ---
    const checklists = {
        7:  [{ icon: "🖱️", label: "Clic gauche sur le fromage" },
             { icon: "🖱️", label: "Clic droit sur la pomme" }],

        16: [{ icon: "🧀", label: "Glisse le fromage → sac jaune" },
             { icon: "🍎", label: "Glisse la pomme → sac rouge" }],

        17: [{ icon: "🔴", label: "Glisse le rouge en premier" },
             { icon: "🟢", label: "Puis le vert" },
             { icon: "🔵", label: "Puis le bleu" }],

        32: [{ icon: "⌨️", label: "Appuie sur la lettre S" },
             { icon: "🧀", label: "Clique sur le fromage" }],

        33: [{ icon: "⌨️", label: "Appuie sur la lettre A" },
             { icon: "🍎", label: "Clique sur la pomme rouge" }],

        34: [{ icon: "⌨️", label: "Écris le mot 'rouge'" },
             { icon: "🍎", label: "Glisse la pomme → sac rouge" }],

        35: [{ icon: "🖱️", label: "Clic gauche" },
             { icon: "⌨️", label: "Touche du clavier" },
             { icon: "🖱️", label: "Clic droit" }],

        38: [{ icon: "🍎", label: "Clique sur la pomme" },
             { icon: "🧀", label: "Clique sur le fromage" },
             { icon: "🍎", label: "Clique sur la pomme" }],

        39: [{ icon: "⌨️", label: "Écris le mot 'jeu'" },
             { icon: "🧀", label: "Double-clique sur le fromage" }],

        40: [{ icon: "⌨️", label: "Écris 'bravo'" },
             { icon: "🧀", label: "Glisse le fromage → sac" },
             { icon: "🍎", label: "Clique sur la pomme" }],

        47: [{ icon: "🧀", label: "Glisse le fromage → sac" },
             { icon: "⌨️", label: "Écris 'vite'" }],

        50: [{ icon: "🎯", label: "Trie les 3 objets" },
             { icon: "⌨️", label: "Écris 'champion'" },
             { icon: "🧀", label: "Clique sur le fromage" }]
    };

    if (checklists[level]) initChecklist(checklists[level]);

    // Annonce pénalités au niveau 21
    if (level === 21) setTimeout(() => showPenaltyAnnounce(), 800);

    // --- Afficher les éléments demandés par le niveau ---
    const allElements = {
        cheese, redApple, greenApple,
        redObject, greenObject, blueObject,
        redBag, greenBag, blueBag, yellowBag,
        keyboard, nextBtn
    };

    for (const id in allElements) {
        if (data.show.includes(id)) {
            allElements[id].style.display = "block";
        }
    }

    // Afficher le wrapper input si le niveau en a besoin
    if (data.show.includes("textInput")) {
        inputZone.style.display = "flex";
        textInput.classList.add("idle");
        textInput.classList.remove("typing");

        const hasBags = data.show.some(id =>
            ["redBag","greenBag","blueBag","yellowBag"].includes(id)
        );
        const hasOtherElements = data.show.some(id =>
            ["cheese","redApple","greenApple","redObject","greenObject",
             "blueObject","redBag","greenBag","blueBag","yellowBag","keyboard"].includes(id)
        );

        if (!hasOtherElements) {
            // Niveau texte seul (28, 29, 30...) → centrer verticalement
            inputZone.style.bottom    = "auto";
            inputZone.style.top       = "50%";
            inputZone.style.transform = "translateX(-50%) translateY(-50%)";
        } else if (hasBags) {
            // Niveau avec des sacs en bas → monter la zone de texte
            // au-dessus des sacs (sacs = bottom:30px, hauteur ~120px)
            inputZone.style.bottom    = "170px";
            inputZone.style.top       = "auto";
            inputZone.style.transform = "translateX(-50%)";
        } else {
            // Niveau avec objets mais sans sacs → coller en bas
            inputZone.style.bottom    = "18px";
            inputZone.style.top       = "auto";
            inputZone.style.transform = "translateX(-50%)";
        }

        setTimeout(() => { textInput.focus(); }, 100);
    }

    // Cacher le bouton valider pour les niveaux à validation automatique
    const autoValidateLevels = [
        "write-then-drag", "write-object-name", "write-then-doubleclick",
        "mini-challenge", "timer-write-2-words", "timer-drag-and-write",
        "timer-sort-and-write", "timer-grand-final"
    ];
    if (autoValidateLevels.includes(data.action)) {
        validateBtn.style.display = "none";
    }

    // --- Compteur d'objets ---
    if (data.total) {
        objectsTotal = data.total;
        updateCounter();
    }

    // --- Actions spéciales selon le niveau ---
    if (data.action === "hover-cheese") {
        // Léger délai pour laisser gameArea retrouver sa taille réelle
        // après la transition CSS (notamment juste après le niveau 1 caché)
        setTimeout(() => placeCheeseRandom(), 60);
    }

    if (data.action === "hover-keyboard" || data.action === "click-key") {
        createKeyboard();
    }

    if (data.action === "hover-keyboard") {
        setTimeout(() => handleLevel21(), 100);
    }

    if (data.action === "reveal-then-drag-red") {
        redApple.style.position  = "absolute";
        greenApple.style.position = "absolute";
        redApple.style.zIndex    = "10";
        greenApple.style.zIndex  = "10";
        redApple.style.left      = "200px";
        redApple.style.top       = "180px";
        greenApple.style.left    = "220px";
        greenApple.style.top     = "200px";
    }

    if (data.action === "sequence-apple-cheese-apple") {
        sequence = 0;
        setTimeout(() => {
            positionNoOverlap(redApple, []);
            positionNoOverlap(cheese, [redApple]);
        }, 50);
    }

    if (data.action === "drag-2-apples") {
        setTimeout(() => {
            randomPosition(redApple);
            randomPosition(greenApple);
        }, 50);
    }

    if (["drag-3-objects", "drag-3-objects-fast", "drag-ordered"].includes(data.action)) {
        setTimeout(() => {
            randomPosition(redObject);
            randomPosition(greenObject);
            randomPosition(blueObject);
        }, 50);
    }

    if (data.action === "timer-click-cheese-appear" || data.action === "timer-click-5-random") {
        setTimeout(() => startLevel43(), 600);
    }

    if (data.action === "timer-sequence-4") {
        setTimeout(() => startLevel46(), 600);
    }

    // --- Démarrer le timer si besoin ---
    currentLevelHasTimer = !!data.timer;
    if (data.timer) {
        setTimeout(() => startTimer(data.timer), 500);
    }

    // --- Afficher le tutoriel animé si ce niveau en a un ---
    showTutorialAnim(level, null);

} // ← FIN DE loadLevel

// ============================================================
//  POSITION ALÉATOIRE (moitié haute de la zone de jeu)
// ============================================================

function randomPosition(el) {
    const gameArea = document.getElementById("gameArea");
    const maxX = gameArea.clientWidth - 100;
    const maxY = (gameArea.clientHeight / 2) - 100;
    el.style.position = "absolute";
    el.style.left     = (Math.random() * maxX) + "px";
    el.style.top      = (Math.random() * maxY) + "px";
}

// ============================================================
//  POSITION ALÉATOIRE DU FROMAGE (évite les sacs en bas)
// ============================================================

function placeCheeseRandom() {
    const gameArea  = document.getElementById("gameArea");
    const padding   = 20;
    const cheeseSize = 90;

    // Sécurité : si gameArea n'a pas encore retrouvé sa taille réelle
    // (juste après avoir retiré la classe .hidden, pendant la transition CSS),
    // clientWidth/clientHeight peuvent valoir 0 ou une valeur transitoire.
    // On utilise alors la taille de référence connue du jeu (700x500).
    const width  = gameArea.clientWidth  > 100 ? gameArea.clientWidth  : 700;
    const height = gameArea.clientHeight > 100 ? gameArea.clientHeight : 500;

    const maxX = Math.max(0, width  - cheeseSize - padding);
    const maxY = Math.max(0, height - cheeseSize - padding - 130);
    const x = Math.random() * maxX + padding;
    const y = Math.random() * maxY + padding;
    cheese.style.position = "absolute";
    cheese.style.left     = x + "px";
    cheese.style.top      = y + "px";
}

// ============================================================
//  POSITION SANS CHEVAUCHEMENT
// ============================================================

function positionNoOverlap(el, others) {
    const gameArea = document.getElementById("gameArea");
    const margin   = 20;
    const maxX     = gameArea.clientWidth  - 100 - margin;
    const maxY     = (gameArea.clientHeight / 2) - 100 - margin;
    let x, y, tries = 0;

    do {
        x = Math.random() * maxX + margin;
        y = Math.random() * maxY + margin;
        tries++;
    } while (
        tries < 50 &&
        others.some(other => {
            const ox = parseInt(other.style.left) || 0;
            const oy = parseInt(other.style.top)  || 0;
            return Math.abs(x - ox) < 120 && Math.abs(y - oy) < 120;
        })
    );

    el.style.position = "absolute";
    el.style.left     = x + "px";
    el.style.top      = y + "px";
}

// ============================================================
//  CLAVIER VISUEL (niveaux 21 et 22)
// ============================================================

function createKeyboard() {
    keyboard.innerHTML = "";

    const rows = [
        ["A","Z","E","R","T","Y","U","I","O","P"],
        ["Q","S","D","F","G","H","J","K","L","M"],
        ["W","X","C","V","B","N"],
        ["1","2","3","4","5","6","7","8","9","0"]
    ];

    rows.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.className = "keyRow";

        row.forEach(char => {
            const key = document.createElement("div");
            key.className = "key";
            key.innerText = char;

            key.addEventListener("click", () => {
                if (level === 22) {
                    if (/[0-9]/.test(char)) {
                        takePenalty();
                    } else {
                        nextLevel();
                    }
                }
            });

            rowDiv.appendChild(key);
        });

        keyboard.appendChild(rowDiv);
    });
}

// ============================================================
//  NIVEAU 21 : SURVOL DU CLAVIER
// ============================================================

function handleLevel21() {
    if (level !== 21) return;

    if (level21Handler) {
        document.removeEventListener("mousemove", level21Handler);
    }

    let progress = 0;

    level21Handler = function(e) {

        // Le popup "ATTENTION les erreurs coûtent des points" est affiché
        // par-dessus le clavier : on ignore le mouvement tant qu'il est là,
        // sinon la progression peut se déclencher sur une zone masquée.
        if (penaltyAnnounceActive) {
            progress = 0;
            keyboard.style.filter = "none";
            return;
        }

        const rect   = keyboard.getBoundingClientRect();
        const inside = e.clientX >= rect.left && e.clientX <= rect.right &&
                       e.clientY >= rect.top  && e.clientY <= rect.bottom;

        if (inside) {
            progress++;
            keyboard.style.filter = "brightness(1.2)";
            if (progress >= 20) {
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

// ============================================================
//  NIVEAU 43/48 : FROMAGES SUCCESSIFS
// ============================================================

function startLevel43() {
    const data         = LEVELS[level - 1];
    const total        = data.total || 3;
    let count          = 0;
    const currentLevel = level;

    objectsTotal  = total;
    objectsPlaced = 0;
    updateCounter();

    function showCheese() {
        if (level !== currentLevel) return;
        placeCheeseRandom();
        cheese.style.display = "block";
    }

    if (cheese._level43Handler) {
        cheese.removeEventListener("click", cheese._level43Handler);
    }

    cheese._level43Handler = function(e) {
        e.stopPropagation();
        if (level !== currentLevel) return;
        count++;
        objectsPlaced = count;
        updateCounter();
        cheese.style.display = "none";

        if (count >= total) {
            cheese.removeEventListener("click", cheese._level43Handler);
            cheese._level43Handler = null;
            setTimeout(() => nextLevel(), 400);
        } else {
            setTimeout(showCheese, 600);
        }
    };

    cheese.addEventListener("click", cheese._level43Handler);
    showCheese();
}

// ============================================================
//  NIVEAU 46 : SÉQUENCE 4 OBJETS QUI S'ALLUMENT
// ============================================================

function startLevel46() {
    const currentLevel  = level;
    const sequence46    = [cheese, redApple, greenApple, redObject];
    let currentIndex    = 0;

    objectsTotal  = sequence46.length;
    objectsPlaced = 0;
    updateCounter();

    // Positions fixes sans superposition
    cheese.style.position     = "absolute"; cheese.style.left     = "80px";  cheese.style.top = "80px";
    redApple.style.position   = "absolute"; redApple.style.left   = "280px"; redApple.style.top = "80px";
    greenApple.style.position = "absolute"; greenApple.style.left = "480px"; greenApple.style.top = "80px";
    redObject.style.position  = "absolute"; redObject.style.left  = "280px"; redObject.style.top = "250px";

    function highlightNext() {
        if (level !== currentLevel) return;

        // Éteindre tous les objets
        sequence46.forEach(el => {
            el.style.boxShadow = "0 0 20px rgba(255,255,255,0.5)";
            el.style.transform = "scale(1)";
        });

        if (currentIndex >= sequence46.length) {
            nextLevel();
            return;
        }

        const current = sequence46[currentIndex];
        current.style.boxShadow = "0 0 30px #ffff00, 0 0 60px #ffff00";
        current.style.transform = "scale(1.2)";

        level46ClickHandler = function(e) {
            if (level !== currentLevel) {
                document.removeEventListener("click", level46ClickHandler);
                level46ClickHandler = null;
                return;
            }

            const clickedCorrect = e.target === current || current.contains(e.target);

            if (clickedCorrect) {
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

// ============================================================
//  save.js
//  Sauvegarde locale via localStorage.
// ============================================================

// ============================================================
//  SAUVEGARDER
// ============================================================

function saveGame() {
    const data = {
        level                    : level,
        score                    : score,
        bestScore                : bestScore,
        currentRank              : currentRank,
        streakPoints             : streakPoints,
        bonusInventory           : bonusInventory,
        lastStreakThresholdGiven : lastStreakThresholdGiven,
        comboBoostStreak         : comboBoostStreak,
        comboBoostPending        : comboBoostPending,
        gameHasHadPenalty        : gameHasHadPenalty,
        savedAt                  : new Date().toISOString()
    };
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch(e) {
        console.warn("Impossible de sauvegarder :", e);
    }
}

// ============================================================
//  CHARGER
// ============================================================

function loadGame() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch(e) {
        return null;
    }
}

// ============================================================
//  SUPPRIMER
// ============================================================

function deleteSave() {
    localStorage.removeItem(SAVE_KEY);
}

// ============================================================
//  EST-CE QU'UNE SAUVEGARDE EXISTE ?
// ============================================================

function hasSave() {
    return localStorage.getItem(SAVE_KEY) !== null;
}

// ============================================================
//  FORMATER LA DATE DE SAUVEGARDE
// ============================================================

function formatSaveDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString("fr-FR", {
        day   : "2-digit",
        month : "2-digit",
        year  : "numeric",
        hour  : "2-digit",
        minute: "2-digit"
    });
}

// ============================================================
//  APPLIQUER UNE SAUVEGARDE À L'ÉTAT DU JEU
// ============================================================

function applySave(data) {
    level                    = data.level                    || 1;
    score                    = data.score                    || 0;
    bestScore                = data.bestScore                || 0;
    currentRank              = data.currentRank              || "Débutant";
    streakPoints             = data.streakPoints             || 0;
    bonusInventory           = data.bonusInventory           || [];
    lastStreakThresholdGiven = data.lastStreakThresholdGiven || 0;
    comboBoostStreak         = data.comboBoostStreak         || 0;
    comboBoostPending        = data.comboBoostPending        || false;
    gameHasHadPenalty        = data.gameHasHadPenalty        || false;
    hadPenaltyThisLevel      = false;
    activeBonus              = null; // un bonus actif ne survit pas à une fermeture/reprise
}

// ============================================================
//  ÉCRAN DE REPRISE AU DÉMARRAGE
// ============================================================

function checkSaveOnStart() {
    if (!hasSave()) return;
    const save = loadGame();
    if (!save) return;

    const overlay = document.createElement("div");
    overlay.id = "resumeOverlay";
    Object.assign(overlay.style, {
        position       : "fixed",
        top            : "0", left: "0",
        width          : "100%", height: "100%",
        background     : "rgba(0,0,0,0.82)",
        zIndex         : "99999",
        display        : "flex",
        justifyContent : "center",
        alignItems     : "center"
    });

    overlay.innerHTML = `
        <div id="resumeBox">
            <div id="resumeIcon">💾</div>
            <div id="resumeTitle">SAUVEGARDE TROUVÉE</div>
            <div id="resumeInfo">
                <div class="resumeLine">
                    <span class="resumeLabel">Niveau</span>
                    <span class="resumeValue">${save.level}</span>
                </div>
                <div class="resumeLine">
                    <span class="resumeLabel">Score</span>
                    <span class="resumeValue" style="color:#00ff99">${save.score} pts</span>
                </div>
                <div class="resumeLine">
                    <span class="resumeLabel">Meilleur</span>
                    <span class="resumeValue" style="color:#ffea00">${save.bestScore} pts</span>
                </div>
                <div class="resumeLine">
                    <span class="resumeLabel">Rang</span>
                    <span class="resumeValue" style="color:#ffcc00">${save.currentRank}</span>
                </div>
                <div class="resumeLine">
                    <span class="resumeLabel">Série</span>
                    <span class="resumeValue">🔥 × ${save.streakPoints || 0}</span>
                </div>
                <div class="resumeLine">
                    <span class="resumeLabel">Bonus en stock</span>
                    <span class="resumeValue">🎁 × ${(save.bonusInventory || []).length}</span>
                </div>
                <div class="resumeSavedAt">Sauvegardé le ${formatSaveDate(save.savedAt)}</div>
            </div>
            <div id="resumeBtns">
                <button id="resumeContinueBtn">▶ CONTINUER</button>
                <button id="resumeNewBtn">🔄 RECOMMENCER</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("resumeContinueBtn").addEventListener("click", () => {
        applySave(save);
        overlay.remove();

        document.getElementById("menu").style.display       = "none";
        document.getElementById("gameWindow").style.display = "block";
        document.getElementById("livesPanel").style.display = "block";
        document.body.classList.add("mouseCursor");

        updateUI();
        updateBackground();
        updateStreakDisplay();
        updateBonusInventoryDisplay();
        updateActiveBonusDisplay();
        updateRecordToBeat();
        loadLevel();
        canValidate = true;
    });

    document.getElementById("resumeNewBtn").addEventListener("click", () => {
        deleteSave();
        overlay.remove();
        startNewGameSequence();
    });
}

// ============================================================
//  SAUVEGARDE AUTOMATIQUE À LA FERMETURE DE LA PAGE
// ============================================================

window.addEventListener("beforeunload", () => {
    if (document.getElementById("gameWindow").style.display === "block") {
        saveGame();
    }
});

// ============================================================
//  EFFACER TOTALEMENT LA PROGRESSION
//  Reset complet : sauvegarde + état du jeu en mémoire,
//  puis retour au menu principal.
// ============================================================

function resetAllProgress() {

    // 0. Garder une trace de la partie en cours dans l'historique
    //    avant de tout effacer (pour ne pas perdre le score atteint)
    recordGameInHistory();

    // 1. Effacer le localStorage
    deleteSave();

    // 2. Réinitialiser toutes les variables d'état en mémoire
    level                     = 1;
    score                     = 0;
    bestScore                 = 0;
    currentRank               = "Débutant";
    gameHasHadPenalty         = false;
    hadPenaltyThisLevel       = false;
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

    // 3. Arrêter tout ce qui pourrait tourner (timer, sons de victoire...)
    stopTimer();
    if (victoryLoop) {
        clearInterval(victoryLoop);
        victoryLoop = null;
    }
    Sounds.arreter("victory");

    // 4. Cacher la fenêtre de jeu et revenir au menu
    document.getElementById("gameWindow").style.display = "none";
    document.getElementById("livesPanel").style.display = "none";
    document.getElementById("victoryScreen").style.display = "none";
    document.getElementById("menu").style.display = "flex";
    document.getElementById("menu").style.pointerEvents = "auto";

    document.body.classList.remove("mouseCursor");

    // Réinitialiser le bouton JOUER (au cas où il était sur "LOADING...")
    playButton.disabled  = false;
    playButton.innerText = "JOUER";

    updateUI();
    updateStreakDisplay();
    updateBonusInventoryDisplay();
    updateActiveBonusDisplay();
    updateBackground();
}

// ============================================================
//  MODALE DE CONFIRMATION D'EFFACEMENT
// ============================================================

function initDeleteSaveUI() {

    const deleteBtn   = document.getElementById("deleteSaveBtn");
    const modal       = document.getElementById("deleteSaveModal");
    const confirmBtn  = document.getElementById("deleteSaveConfirmBtn");
    const cancelBtn   = document.getElementById("deleteSaveCancelBtn");

    if (!deleteBtn || !modal) return; // sécurité si les éléments n'existent pas

    // Ouvrir la modale
    deleteBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    // Confirmer l'effacement
    confirmBtn.addEventListener("click", () => {
        modal.style.display = "none";
        resetAllProgress();
        showResetConfirmation();
    });

    // Annuler
    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Fermer en cliquant en dehors de la boîte
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

// ============================================================
//  PETIT POPUP DE CONFIRMATION VISUELLE APRÈS EFFACEMENT
// ============================================================

function showResetConfirmation() {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:32px">🗑️✅</div>
        <div style="font-size:16px;font-weight:900;color:#00ffff;
                    font-family:'Orbitron',monospace;letter-spacing:2px;margin-top:6px">
            PROGRESSION EFFACÉE
        </div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "50%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.7)",
        background    : "rgba(10,10,20,0.92)",
        border        : "2px solid #00ffff",
        borderRadius  : "16px",
        padding       : "20px 32px",
        textAlign     : "center",
        boxShadow     : "0 0 20px cyan",
        zIndex        : "99999",
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
        popup.style.transform = "translate(-50%,-50%) scale(0.7)";
        setTimeout(() => popup.remove(), 250);
    }, 1500);
}

// Initialiser les listeners de la modale une fois le DOM prêt
// (différé pour ne pas dépendre de l'ordre de chargement des scripts)
document.addEventListener("DOMContentLoaded", initDeleteSaveUI);
if (document.readyState !== "loading") initDeleteSaveUI();

// ============================================================
//  HISTORIQUE DES PARTIES
//  Chaque partie terminée (victoire ou abandon volontaire) est
//  ajoutée à un historique des HISTORY_MAX dernières parties.
// ============================================================

function getHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch(e) {
        return [];
    }
}

function addToHistory(entry) {
    const history = getHistory();
    history.unshift(entry); // la plus récente en premier
    const trimmed = history.slice(0, HISTORY_MAX);
    try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    } catch(e) {
        console.warn("Impossible de sauvegarder l'historique :", e);
    }
}

// Enregistre la partie en cours dans l'historique
// (appelée à la victoire finale ou quand le joueur efface sa progression)
function recordGameInHistory() {
    if (level <= 1) return; // pas de partie réellement jouée
    addToHistory({
        score    : score,
        level    : level,
        rank     : currentRank,
        date     : new Date().toISOString()
    });
}

// ============================================================
//  STATISTIQUES GLOBALES (calculées depuis l'historique)
// ============================================================

function getProfileStats() {
    const history = getHistory();

    if (history.length === 0) {
        return {
            bestScore   : 0,
            bestLevel   : 0,
            gamesPlayed : 0,
            bestRank    : "-"
        };
    }

    const rankOrder = ["Débutant", "Intermédiaire", "Clavier", "Expert", "Champion"];

    let bestScore = 0, bestLevel = 0, bestRankIndex = 0;

    history.forEach(g => {
        if (g.score > bestScore) bestScore = g.score;
        if (g.level > bestLevel) bestLevel = g.level;
        const idx = rankOrder.indexOf(g.rank);
        if (idx > bestRankIndex) bestRankIndex = idx;
    });

    return {
        bestScore   : bestScore,
        bestLevel   : bestLevel,
        gamesPlayed : history.length,
        bestRank    : rankOrder[bestRankIndex]
    };
}

// ============================================================
//  RÉCORD À BATTRE (affiché pendant le jeu)
// ============================================================

function updateRecordToBeat() {
    const stats = getProfileStats();
    const el = document.getElementById("recordToBeatValue");
    const panel = document.getElementById("recordToBeat");
    if (!el || !panel) return;

    if (stats.bestScore > 0) {
        panel.style.display = "block";
        el.innerText = stats.bestScore;
    } else {
        panel.style.display = "none";
    }
}

// ============================================================
//  ÉCRAN PROFIL JOUEUR
// ============================================================

function formatHistoryDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) +
           " à " +
           d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function renderProfileScreen() {
    const stats   = getProfileStats();
    const history = getHistory();

    document.getElementById("profileBestScore").innerText   = stats.bestScore;
    document.getElementById("profileBestLevel").innerText   = stats.bestLevel;
    document.getElementById("profileGamesPlayed").innerText = stats.gamesPlayed;
    document.getElementById("profileBestRank").innerText    = stats.bestRank;

    const listEl  = document.getElementById("profileHistoryList");
    const emptyEl = document.getElementById("profileEmptyState");

    if (history.length === 0) {
        listEl.style.display  = "none";
        emptyEl.style.display = "block";
        return;
    }

    listEl.style.display  = "flex";
    emptyEl.style.display = "none";

    listEl.innerHTML = history.map((g, i) => `
        <div class="profileHistoryItem">
            <div class="profileHistoryLeft">
                <div class="profileHistoryScore">${i === 0 ? "🏆 " : ""}${g.score} pts</div>
                <div class="profileHistoryMeta">Niveau ${g.level} — ${g.rank}</div>
            </div>
            <div class="profileHistoryDate">${formatHistoryDate(g.date)}</div>
        </div>
    `).join("");
}

function openProfileScreen() {
    renderProfileScreen();
    document.getElementById("profileScreen").style.display = "flex";
}

function closeProfileScreen() {
    document.getElementById("profileScreen").style.display = "none";
}

function initProfileUI() {
    const openBtn  = document.getElementById("profileBtn");
    const closeBtn = document.getElementById("profileCloseBtn");
    const overlay  = document.getElementById("profileScreen");

    if (!openBtn || !overlay) return;

    openBtn.addEventListener("click", openProfileScreen);
    closeBtn.addEventListener("click", closeProfileScreen);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeProfileScreen();
    });

    initClearHistoryUI();
}

// ============================================================
//  VIDER L'HISTORIQUE DU PROFIL
//  Supprime toutes les parties enregistrées (historique +
//  statistiques dérivées : meilleur score, niveau max, rang).
//  N'affecte pas la partie en cours (sauvegarde séparée).
// ============================================================

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderProfileScreen(); // rafraîchir l'écran avec les stats à zéro
}

function initClearHistoryUI() {
    const clearBtn   = document.getElementById("clearHistoryBtn");
    const modal      = document.getElementById("clearHistoryModal");
    const confirmBtn = document.getElementById("clearHistoryConfirmBtn");
    const cancelBtn  = document.getElementById("clearHistoryCancelBtn");

    if (!clearBtn || !modal) return;

    clearBtn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    confirmBtn.addEventListener("click", () => {
        modal.style.display = "none";
        clearHistory();
        showHistoryClearedConfirmation();
    });

    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
}

function showHistoryClearedConfirmation() {
    const popup = document.createElement("div");
    popup.innerHTML = `
        <div style="font-size:32px">🗑️✅</div>
        <div style="font-size:16px;font-weight:900;color:#00ffff;
                    font-family:'Orbitron',monospace;letter-spacing:2px;margin-top:6px">
            HISTORIQUE EFFACÉ
        </div>
    `;
    Object.assign(popup.style, {
        position      : "fixed",
        top           : "50%",
        left          : "50%",
        transform     : "translate(-50%,-50%) scale(0.7)",
        background    : "rgba(10,10,20,0.92)",
        border        : "2px solid #00ffff",
        borderRadius  : "16px",
        padding       : "20px 32px",
        textAlign     : "center",
        boxShadow     : "0 0 20px cyan",
        zIndex        : "100002",
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
        popup.style.transform = "translate(-50%,-50%) scale(0.7)";
        setTimeout(() => popup.remove(), 250);
    }, 1500);
}

document.addEventListener("DOMContentLoaded", initProfileUI);
if (document.readyState !== "loading") initProfileUI();

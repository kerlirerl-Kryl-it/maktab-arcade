// ============================================================
//  config.js
//  Toutes les variables globales du jeu.
//  Ce fichier est chargé EN PREMIER dans index.html.
//  Les autres fichiers lisent et modifient ces variables.
// ============================================================

// --- État du jeu ---
let level          = 1;
let score          = 0;
let currentRank    = "Débutant";
let bestScore      = 0;
let canValidate    = true;
let replayBtnReady = false;
let victoryLoop    = null;

// --- Souris & interactions ---
let mouseMoved     = false;
let leftClicked    = false;
let rightClicked   = false;
let wasDragging    = false;
let dragStartX     = 0;
let dragStartY     = 0;
let dragging       = null;
let offsetX        = 0;
let offsetY        = 0;

// --- Progression dans les niveaux ---
let sequence       = 0;
let objectsPlaced  = 0;
let objectsTotal   = 0;
let dragOrderIndex = 0;
let clickCount     = 0;
let wordIndex      = 0;

// --- Flags d'étapes ---
let keyPressed          = false;
let wordValidated       = false;
let cheeseDropped       = false;
let level7CheeseClicked = false;
let level11Done         = false;

// --- Timer ---
let timerInterval  = null;
let timerSeconds   = 0;

// --- Listeners à nettoyer ---
let level21Handler     = null;
let level46ClickHandler = null;

// --- Timeouts en cours (pour pouvoir les annuler) ---
let levelTimeouts = [];

// --- Pénalités ---
let penaltyCount    = 0;
let penaltyCooldown = false;
let hadPenaltyThisLevel = false;

// --- Annonce pénalités (niveau 21) ---
// Tant que c'est à true, on ne peut pas valider le niveau
let penaltyAnnounceActive = false;

// ============================================================
//  SYSTÈME DE SÉRIE DE PERFORMANCE + BONUS ARCADE ÉDUCATIF
// ============================================================
//
//  Règle principale :
//    - Niveau réussi sans faute  → +1 point de série
//    - Erreur                    → -3 points de série (min 0)
//
//  Bonus débloqués par série (cycle tous les 20) :
//    5  → Double XP   (x2 sur les points du niveau)
//    10 → Bouclier    (ignore 1 erreur sans pénalité)
//    15 → +Temps      (+5s au chrono, ralentissement x0.5 pendant 10s)
//    20 → Gel du temps (chrono figé 10s)
//
//  Combo Boost : à 24 niveaux sans faute consécutifs (cumulés, pas remis
//  à zéro par le système de "min 0"), le PROCHAIN bonus choisi est en
//  version boostée (effet renforcé).
// ------------------------------------------------------------

// --- Points de série (streak) ---
let streakPoints = 0;

// --- Seuils de bonus (cycle répété tous les 20 points) ---
const BONUS_THRESHOLDS = [5, 10, 15, 20];

// --- Inventaire des bonus débloqués mais pas encore utilisés ---
// Chaque entrée : { type: "doubleXp"|"shield"|"slowtime"|"freeze", boosted: bool }
let bonusInventory = [];

// --- Bonus actuellement actif sur le niveau en cours (1 seul à la fois) ---
// null ou { type, boosted }
let activeBonuses = []; // tableau des bonus actifs sur le niveau en cours

// --- Suivi des seuils déjà franchis pour ne pas les redonner deux fois ---
let lastStreakThresholdGiven = 0;

// --- Combo Boost : série continue sans faute (jamais réduite, sauf reset total) ---
let comboBoostStreak = 0;
const COMBO_BOOST_THRESHOLD = 24;
let comboBoostPending = false; // true = le prochain bonus choisi sera boosté

// --- États d'effet en cours (pour l'affichage / la logique de jeu) ---
let shieldActive       = false; // bouclier anti-erreur actif sur le niveau en cours
let shieldUsesLeft     = 0;     // nombre d'erreurs encore ignorées (1 normal, 2 boosté)
let freezeActive        = false; // gel du temps en cours
let slowTimeActive      = false; // ralentissement du chrono en cours
let slowTimeMultiplier  = 1;     // 0.5 pendant le ralentissement
let doubleXpActive      = false; // double XP actif sur le niveau en cours
let doubleXpMultiplier  = 1;     // x2 normal, x3 boosté

// --- Combo : première apparition du popup (réutilisé pour timing d'affichage) ---
let comboFirstShown = false;

// --- Timer bonus (points dégressifs) ---
let timerBonusPoints    = 50;  // points bonus disponibles au départ
let timerBonusInterval  = null; // setInterval qui décrémente le bonus
const TIMER_BONUS_MAX   = 50;
const TIMER_BONUS_MIN   = 5;
const TIMER_BONUS_DECAY = 2;    // toutes les combien de secondes on perd 1 pt bonus

// --- Flag : le niveau en cours a-t-il un timer ? ---
let currentLevelHasTimer = false;

// --- Sauvegarde locale ---
let playerName    = "";   // prénom du joueur (saisi au niveau 28)
const SAVE_KEY    = "maktab_arcade_save";

// --- Clé de l'historique des parties (pour le profil joueur) ---
const HISTORY_KEY  = "maktab_arcade_history";
const HISTORY_MAX  = 10; // nombre de parties conservées dans l'historique

// --- Détection de partie "PERFECT" (aucune faute du début à la fin) ---
let gameHasHadPenalty = false; // mis à true dès la 1ère pénalité de toute la partie

// --- Tracking : première apparition de chaque type d'annonce de bonus ---
// (pour garantir un affichage de 3s minimum la toute première fois)
let bonusAnnounceFirstShown = {
    doubleXp: false,
    shield:   false,
    slowtime: false,
    freeze:   false
};

// --- Tracking : première apparition du popup "BONUS DÉBLOQUÉ" ---
let bonusUnlockedFirstShown = false;

// --- Tracking : première apparition du popup "COMBO BOOST" ---
let comboBoostFirstShown = false;

// --- Empêche la détection de survol du niveau 2 pendant que l'overlay tutoriel est encore visible ---
let tutorialOverlayActive = false;

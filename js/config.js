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

// --- Annonce pénalités (niveau 21) ---
// Tant que c'est à true, on ne peut pas valider le niveau
let penaltyAnnounceActive = false;

// --- Combo : niveaux consécutifs sans faute ---
let comboCount          = 0;
let hadPenaltyThisLevel = false;

// --- Vies ---
let lives    = 0;
let maxLives = 9;

// --- Relance ---
let restartCost = 10;

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

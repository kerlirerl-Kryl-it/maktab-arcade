// ============================================================
//  sounds.js
//  Tous les sons du jeu regroupés ici.
//  Pour jouer un son : Sounds.jouer("drop")
//  Pour jouer avec volume : Sounds.jouer("loading", 0.2)
// ============================================================

const Sounds = {

    // --- Sons généraux ---
    // IMPORTANT : on n'appelle plus la propriété "play" car c'est
    // aussi le nom d'une méthode de l'objet Audio — ça crée un conflit.
    // On utilise des noms différents pour les sons.
    playBtn        : new Audio("./sounds/play.mp3"),
    levelComplete  : new Audio("./sounds/level-complete.mp3"),
    levelUp        : new Audio("./sounds/levelup.mp3"),
    drop           : new Audio("./sounds/drop.mp3"),
    loading        : new Audio("./sounds/loading.mp3"),
    nextBtn        : new Audio("./sounds/nextbtn.mp3"),
    nextLevelVoice : new Audio("./sounds/nextlevel-voice.mp3"),
    victory        : new Audio("./sounds/victory.mp3"),
    victoryVoice   : new Audio("./sounds/victory-voice.mp3"),
    timerStart     : new Audio("./sounds/timer-start.mp3"),

    // --- Sons d'erreur ---
    error1 : new Audio("./sounds/error1.mp3"),
    error2 : new Audio("./sounds/error2.mp3"),

    // --- Sons combo ---
    combo5  : new Audio("./sounds/combo5.mp3"),   // x5 niveaux parfaits
    combo10 : new Audio("./sounds/combo10.mp3"),  // x10
    combo20 : new Audio("./sounds/combo20.mp3"),  // x20 (palier majeur)

    // --- Son gain de vie ---
    oneUp   : new Audio("./sounds/1up.mp3"),

    // --- Son relance niveau ---
    restart : new Audio("./sounds/restart.mp3"),

    // --- Sons d'activation des bonus arcade ---
    bonusShield   : new Audio("./sounds/bonus-shield.mp3"),
    bonusDoubleXp : new Audio("./sounds/bonus-doublexp.mp3"),
    bonusSlowtime : new Audio("./sounds/bonus-slowtime.mp3"),
    bonusFreeze   : new Audio("./sounds/bonus-freeze.mp3"),
    comboBoost : new Audio("./sounds/combo-boost.mp3"),

    // --- Sons par palier de niveaux ---
    level1 : new Audio("./sounds/level-1.mp3"),
    level2 : new Audio("./sounds/level-2.mp3"),
    level3 : new Audio("./sounds/level-3.mp3"),
    level4 : new Audio("./sounds/level-4.mp3"),
    level5 : new Audio("./sounds/level-5.mp3"),

    // --- Sons de changement de rang ---
    rank2 : new Audio("./sounds/rank2.mp3"),
    rank3 : new Audio("./sounds/rank3.mp3"),
    rank4 : new Audio("./sounds/rank4.mp3"),
    rank5 : new Audio("./sounds/rank5.mp3"),

    // --- Sons des dizaines (voix) ---
    decadeVoice : new Audio("./sounds/nextlevelvoice.mp3"),

    // --------------------------------------------------------
    //  Méthode principale pour jouer un son
    //  Exemples :
    //    Sounds.jouer("drop")
    //    Sounds.jouer("playBtn", 0.4)
    //    Sounds.jouer("loading", 0.2, true)   ← loop = true
    // --------------------------------------------------------
    jouer(nom, volume, loop) {
        const s = this[nom];
        if (!s || !(s instanceof Audio)) {
            console.warn("Son introuvable :", nom);
            return;
        }
        s.currentTime = 0;
        if (volume !== undefined) s.volume = volume;
        if (loop   !== undefined) s.loop   = loop;
        s.play().catch(() => {}); // évite les erreurs si le navigateur bloque
    },

    // --------------------------------------------------------
    //  Arrêter un son
    // --------------------------------------------------------
    arreter(nom) {
        const s = this[nom];
        if (!s || !(s instanceof Audio)) return;
        s.pause();
        s.currentTime = 0;
    },

    // --------------------------------------------------------
    //  Son selon le palier de niveau (1-10, 11-20, etc.)
    // --------------------------------------------------------
    jouerNiveau(lvl) {
        if      (lvl <= 10) this.jouer("level1");
        else if (lvl <= 20) this.jouer("level2");
        else if (lvl <= 30) this.jouer("level3");
        else if (lvl <= 40) this.jouer("level4");
        else                this.jouer("level5");
    },

    // --------------------------------------------------------
    //  Voix spéciale aux passages 10, 20, 30, 40, 50
    // --------------------------------------------------------
    jouerVoixDizaine(lvl) {
        if ([10, 20, 30, 40, 50].includes(lvl)) {
            setTimeout(() => this.jouer("decadeVoice"), 200);
        }
    },

    // --------------------------------------------------------
    //  Son de changement de rang
    // --------------------------------------------------------
    jouerRang(rang) {
        const map = {
            "Intermédiaire" : "rank2",
            "Clavier"       : "rank3",
            "Expert"        : "rank4",
            "Champion"      : "rank5"
        };
        if (map[rang]) this.jouer(map[rang]);
    },

    // --------------------------------------------------------
    //  Son de combo selon le palier atteint
    //  5, 15, 25... → combo5
    //  10, 30, 50.. → combo10
    //  20, 40, 60.. → combo20 (+ vie)
    // --------------------------------------------------------
    jouerCombo(count) {
        if (count % 20 === 0)     this.jouer("combo20");
        else if (count % 10 === 0) this.jouer("combo10");
        else                       this.jouer("combo5");
    }
};

// Volume par défaut du son de chargement
Sounds.loading.volume = 0.2;

// ============================================================
//  Raccourcis globaux utilisés dans game.js, ui.js, events.js
//  (ces fonctions appellent Sounds.jouer)
// ============================================================
function playDropSound()     { Sounds.jouer("drop"); }
function playLevelSound(lvl) { Sounds.jouerNiveau(lvl); }
function playDecadeVoice(lvl){ Sounds.jouerVoixDizaine(lvl); }
function playRankSound(rang) { Sounds.jouerRang(rang); }

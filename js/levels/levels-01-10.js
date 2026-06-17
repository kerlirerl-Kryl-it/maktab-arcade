// ============================================================
//  levels-01-10.js
//  Niveaux 1 à 10
// ============================================================

const LEVELS_01_10 = [

    // NIVEAU 1
    {
        instruction: "Bienvenue dans le jeu ! 🎮\n\nTu vas apprendre à utiliser une souris et un clavier en t'amusant.\n\nDemande à tes parents de cliquer sur Suivant pour commencer. Suis les consignes, à certains niveaux si tu te trompes, tu perds des points, bonne chance!",
        show: ["nextBtn"],
        action: "next-btn"
    },

    // NIVEAU 2
    {
        instruction: "Déplace ta souris sur le fromage 🧀",
        show: ["cheese"],
        action: "hover-cheese"
    },

    // NIVEAU 3
    {
        instruction: "Fais un CLIC GAUCHE n'importe où (dans le carré des arbres)",
        show: [],
        action: "left-click"
    },

    // NIVEAU 4
    {
        instruction: "Fais un CLIC GAUCHE sur le fromage 🧀",
        show: ["cheese"],
        action: "click-cheese"
    },

    // NIVEAU 5
    {
        instruction: "Fais un CLIC DROIT n'importe où (dans le carré des arbres)",
        show: [],
        action: "right-click"
    },

    // NIVEAU 6
    {
        instruction: "Fais un CLIC DROIT sur le fromage 🧀",
        show: ["cheese"],
        action: "right-click-cheese"
    },

    // NIVEAU 7
    {
        instruction: "Fais un CLIC GAUCHE sur le fromage 🧀, puis un CLIC DROIT sur la pomme 🍎",
        show: ["cheese", "redApple"],
        action: "click-cheese-then-right-apple"
    },

    // NIVEAU 8
    {
        instruction: "Fais un DOUBLE CLIC GAUCHE n'importe où",
        show: [],
        action: "double-left"
    },

    // NIVEAU 9
    {
        instruction: "Fais un DOUBLE CLIC GAUCHE sur le fromage 🧀",
        show: ["cheese"],
        action: "double-click-cheese"
    },

    // NIVEAU 10
    {
        instruction: "Glisse le fromage 🧀 dans le sac jaune (click gauche dessus, et laisse le click gauche appuyer, et déplace la souris en même temps).",
        show: ["cheese", "yellowBag"],
        action: "drag-cheese-yellowbag"
    }

];

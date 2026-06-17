// ============================================================
//  levels-11-20.js
//  Niveaux 11 à 20
// ============================================================

const LEVELS_11_20 = [

    // NIVEAU 11
    {
        instruction: "Glisse la pomme rouge 🍎 dans le sac rouge",
        show: ["redApple", "redBag"],
        action: "drag-red-apple-redbag"
    },

    // NIVEAU 12
    {
        instruction: "Glisse la pomme verte 🍏 dans le sac vert",
        show: ["greenApple", "greenBag"],
        action: "drag-green-apple-greenbag"
    },

    // NIVEAU 13
    {
        instruction: "Glisse les 2 pommes dans leur sac 🍎🍏",
        show: ["redApple", "greenApple", "redBag", "greenBag"],
        action: "drag-2-apples",
        total: 2
    },

    // NIVEAU 14
    {
        instruction: "Glisse les 3 objets dans leur sac 🔴🟢🔵 (en fonction des couleurs)",
        show: ["redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag"],
        action: "drag-3-objects",
        total: 3
    },

    // NIVEAU 15
    {
        instruction: "Déplace la pomme verte pour révéler la rouge, puis glisse la rouge dans son sac 🍎",
        show: ["redApple", "greenApple", "redBag"],
        action: "reveal-then-drag-red"
    },

    // NIVEAU 16
    {
        instruction: "Glisse le fromage 🧀 dans le sac jaune ET la pomme rouge 🍎 dans le sac rouge",
        show: ["cheese", "redApple", "yellowBag", "redBag"],
        action: "drag-cheese-and-apple",
        total: 2
    },

    // NIVEAU 17
    {
        instruction: "Glisse les objets dans l'ordre : rouge 🔴 → vert 🟢 → bleu 🔵",
        show: ["redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag"],
        action: "drag-ordered",
        total: 3
    },

    // NIVEAU 18
    {
        instruction: "Glisse uniquement le FROMAGE 🧀 dans le sac jaune (ignore la pomme)",
        show: ["cheese", "redApple", "yellowBag"],
        action: "drag-only-cheese"
    },

    // NIVEAU 19
    {
        instruction: "⏱️ Vite ! Glisse les 3 objets dans leur sac en moins de 30 secondes !",
        show: ["redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag"],
        action: "drag-3-objects-fast",
        timer: 30,
        total: 3
    },

    // NIVEAU 20
    {
        instruction: "Trie tout ! 🧀🍎🍏 , chacun dans son sac",
        show: ["cheese", "redApple", "greenApple", "yellowBag", "redBag", "greenBag"],
        action: "drag-3-objects",
        total: 3
    }

];

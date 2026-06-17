// ============================================================
//  levels-31-40.js
//  Niveaux 31 à 40
// ============================================================

const LEVELS_31_40 = [

    // NIVEAU 31
    {
        instruction: "Écris le mot : souris 🖱️, puis clique sur Valider",
        show: ["textInput", "validateBtn"],
        action: "write-word",
        word: "souris"
    },

    // NIVEAU 32
    {
        instruction: "Appuie sur la lettre S, puis clique sur le fromage 🧀",
        show: ["cheese"],
        action: "key-then-click",
        key: "s"
    },

    // NIVEAU 33
    {
        instruction: "Appuie sur la lettre A, puis clique sur la pomme rouge 🍎",
        show: ["redApple"],
        action: "key-then-click-apple",
        key: "a"
    },

    // NIVEAU 34
    {
        instruction: "Écris le mot 'rouge'. Ensuite glisse la pomme rouge 🍎 dans son sac",
        show: ["redApple", "redBag", "textInput", "validateBtn"],
        action: "write-then-drag",
        word: "rouge"
    },

    // NIVEAU 35
    {
        instruction: "Séquence : CLIC GAUCHE → touche clavier → CLIC DROIT",
        show: [],
        action: "sequence-click-key-rightclick"
    },

    // NIVEAU 36
    {
        instruction: "Écris le nom de l'objet affiché 👇",
        show: ["cheese", "textInput", "validateBtn"],
        action: "write-object-name",
        word: "fromage"
    },

    // NIVEAU 37
    {
        instruction: "Clique uniquement sur le fromage 🧀 (ignore les pommes !)",
        show: ["cheese", "redApple", "greenApple"],
        action: "click-only-cheese"
    },

    // NIVEAU 38
    {
        instruction: "Clique gauche sur les objets, dans l'ordre suivant: pomme 🍎 → fromage 🧀 → pomme 🍎",
        show: ["redApple", "cheese"],
        action: "sequence-apple-cheese-apple"
    },

    // NIVEAU 39
    {
        instruction: "Écris le mot 'jeu', puis double-clique sur le fromage 🧀",
        show: ["cheese", "textInput", "validateBtn"],
        action: "write-then-doubleclick",
        word: "jeu"
    },

    // NIVEAU 40
    {
        instruction: "Mini défi ! Écris 'bravo', glisse le fromage dans son sac, puis clique sur la pomme 🍎",
        show: ["cheese", "redApple", "yellowBag", "textInput", "validateBtn"],
        action: "mini-challenge"
    }

];

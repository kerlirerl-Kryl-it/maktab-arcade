// ============================================================
//  levels-21-30.js
//  Niveaux 21 à 30
// ============================================================

const LEVELS_21_30 = [

    // NIVEAU 21
    {
        instruction: "Passe la souris SUR le clavier et reste un moment 👇",
        show: ["keyboard"],
        action: "hover-keyboard"
    },

    // NIVEAU 22
    {
        instruction: "CLIC SUR UNE LETTRE du clavier",
        show: ["keyboard"],
        action: "click-key"
    },

    // NIVEAU 23
    {
        instruction: "Appuie sur une touche de ton clavier",
        show: [],
        action: "any-key"
    },

    // NIVEAU 24
    {
        instruction: "Appuie que sur une LETTRE de ton clavier",
        show: [],
        action: "any-letter"
    },

    // NIVEAU 25
    {
        instruction: "Appuie que sur un CHIFFRE de ton clavier",
        show: [],
        action: "any-digit"
    },

    // NIVEAU 26
    {
        instruction: "Appuie sur la lettre A",
        show: [],
        action: "key-a"
    },

    // NIVEAU 27
    {
        instruction: "Appuie sur le chiffre 0",
        show: [],
        action: "key-0"
    },

    // NIVEAU 28
    {
        instruction: "Écris ton prénom dans le rectangle, puis clique gauche sur Valider",
        show: ["textInput", "validateBtn"],
        action: "write-name"
    },

    // NIVEAU 29
    {
        instruction: "Écris ton âge dans le rectangle, puis clique gauche sur Valider",
        show: ["textInput", "validateBtn"],
        action: "write-age"
    },

    // NIVEAU 30
    {
        instruction: "Écris le mot : chat 🐱, puis clique sur Valider",
        show: ["textInput", "validateBtn"],
        action: "write-word",
        word: "chat"
    }

];

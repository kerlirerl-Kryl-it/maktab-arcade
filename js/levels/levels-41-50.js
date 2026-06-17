// ============================================================
//  levels-41-50.js
//  Niveaux 41 à 50
// ============================================================

const LEVELS_41_50 = [

    // NIVEAU 41
    {
        instruction: "⏱️ Clique 3 fois sur le fromage avant la fin du temps !",
        show: ["cheese"],
        action: "timer-click-cheese-3",
        timer: 90,
        total: 3
    },

    // NIVEAU 42
    {
        instruction: "⏱️ Glisse 2 objets dans leur sac avant la fin du temps !",
        show: ["redObject", "greenObject", "redBag", "greenBag"],
        action: "timer-drag-2",
        timer: 90,
        total: 2
    },

    // NIVEAU 43
    {
        instruction: "⏱️ Clique sur les fromages qui apparaissent un par un !",
        show: ["cheese"],
        action: "timer-click-cheese-appear",
        timer: 90,
        total: 3
    },

    // NIVEAU 44
    {
        instruction: "⏱️ Trie les 3 objets dans leur sac avant la fin du temps !",
        show: ["redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag"],
        action: "timer-drag-3",
        timer: 120,
        total: 3
    },

    // NIVEAU 45
    {
        instruction: "⏱️ Écris les 2 mots : chat puis chien avant la fin du temps !",
        show: ["textInput", "validateBtn"],
        action: "timer-write-2-words",
        timer: 120,
        words: ["chat", "chien"]
    },

    // NIVEAU 46
    {
        instruction: "⏱️ Clique dans l'ordre sur les 4 objets qui s'allument !",
        show: ["cheese", "redApple", "greenApple", "redObject"],
        action: "timer-sequence-4",
        timer: 120,
        total: 4
    },

    // NIVEAU 47
    {
        instruction: "⏱️ Glisse le fromage dans son sac et écris 'VITE' avant la fin du temps !",
        show: ["cheese", "yellowBag", "textInput", "validateBtn"],
        action: "timer-drag-and-write",
        timer: 120,
        word: "vite"
    },

    // NIVEAU 48
    {
        instruction: "⏱️ Clique sur 5 fromages qui apparaissent aléatoirement !",
        show: ["cheese"],
        action: "timer-click-5-random",
        timer: 90,
        total: 5
    },

    // NIVEAU 49
    {
        instruction: "⏱️ Trie 3 objets ET écris le mot 'SUPER' avant la fin du temps !",
        show: ["cheese", "redApple", "greenApple", "yellowBag", "redBag", "greenBag", "textInput", "validateBtn"],
        action: "timer-sort-and-write",
        timer: 150,
        word: "super",
        total: 3
    },

    // NIVEAU 50 — GRAND FINAL
    {
        instruction: "🏆 GRAND FINAL ! Trie les objets, écris 'CHAMPION' et clique sur le fromage avant la fin du temps !",
        show: ["cheese", "redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag", "textInput", "validateBtn"],
        action: "timer-grand-final",
        timer: 180,
        word: "champion",
        total: 3
    }

];

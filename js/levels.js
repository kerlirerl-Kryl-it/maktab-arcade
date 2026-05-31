const LEVELS = [

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
        instruction: "Fais un CLIC GAUCHE n'importe où (dans le carré des arbres)" ,
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
        instruction: "Glisse le fromage 🧀 dans le sac jaune (click gauche dessus, et laisse le click gauche appuyer, et déplace la souris en même temps). ",
        show: ["cheese", "yellowBag"],
        action: "drag-cheese-yellowbag"
    },

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
        action: "drag-4-objects",
        total: 3
    },

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
    },

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
        instruction: "Écris le mot 'rouge'.Ensuite glisse la pomme rouge 🍎 dans son sac",
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
    },

    // NIVEAU 41 — TIMER
    {
        instruction: "⏱️ Clique 3 fois sur le fromage en moins d'1 minute !",
        show: ["cheese"],
        action: "timer-click-cheese-3",
        timer: 60,
        total: 3
    },

    // NIVEAU 42 — TIMER
    {
        instruction: "⏱️ Glisse 2 objets dans leur sac en moins d'1 minute !",
        show: ["redObject", "greenObject", "redBag", "greenBag"],
        action: "timer-drag-2",
        timer: 60,
        total: 2
    },

    // NIVEAU 43 — TIMER
    {
        instruction: "⏱️ Clique sur les fromages qui apparaissent un par un !",
        show: ["cheese"],
        action: "timer-click-cheese-appear",
        timer: 60,
        total: 3
    },

    // NIVEAU 44 — TIMER
    {
        instruction: "⏱️ Trie les 3 objets dans leur sac en moins d'1 minute !",
        show: ["redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag"],
        action: "timer-drag-3",
        timer: 60,
        total: 3
    },

    // NIVEAU 45 — TIMER
    {
        instruction: "⏱️ Écris les 2 mots : chat puis chien en moins d'1 minute !",
        show: ["textInput", "validateBtn"],
        action: "timer-write-2-words",
        timer: 60,
        words: ["chat", "chien"]
    },

    // NIVEAU 46 — TIMER
    {
        instruction: "⏱️ Clique dans l'ordre sur les 4 objets qui s'allument !",
        show: ["cheese", "redApple", "greenApple", "redObject"],
        action: "timer-sequence-4",
        timer: 60,
        total: 4
    },

    // NIVEAU 47 — TIMER
    {
        instruction: "⏱️ Glisse le fromage dans son sac et, écris 'VITE' en moins d'1 minute !",
        show: ["cheese", "yellowBag", "textInput", "validateBtn"],
        action: "timer-drag-and-write",
        timer: 60,
        word: "vite"
    },

    // NIVEAU 48 — TIMER
    {
        instruction: "⏱️ Clique sur 5 fromages qui apparaissent aléatoirement !",
        show: ["cheese"],
        action: "timer-click-5-random",
        timer: 60,
        total: 5
    },

    // NIVEAU 49 — TIMER
    {
        instruction: "⏱️ Trie 4 objets ET écris le mot 'SUPER' en moins d'1 minute !",
        show: ["cheese", "redApple", "greenApple", "yellowBag", "redBag", "greenBag", "textInput", "validateBtn"],
        action: "timer-sort-and-write",
        timer: 60,
        word: "super",
        total: 3
    },

    // NIVEAU 50 — GRAND FINAL
    {
        instruction: "🏆 GRAND FINAL ! Trie les objets, écris 'CHAMPION' et clique sur le fromage en moins d'1 minute !",
        show: ["cheese", "redObject", "greenObject", "blueObject", "redBag", "greenBag", "blueBag", "textInput", "validateBtn"],
        action: "timer-grand-final",
        timer: 60,
        word: "champion",
        total: 3
    }

];
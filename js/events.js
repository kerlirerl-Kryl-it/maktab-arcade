// ============================================================
//  events.js
//  Tous les écouteurs d'événements :
//  clics gauche/droit, double-clic, clavier, drag & drop,
//  validation du texte.
// ============================================================

// ============================================================
//  BOUTON SUIVANT (niveau 1)
// ============================================================

nextBtn.addEventListener("click", () => {
    Sounds.jouer("nextBtn", 0.35);
    if (level === 1) {
        level++;
        updateUI();
        loadLevel();
    }
});

// ============================================================
//  MOUVEMENT DE SOURIS
// ============================================================

document.addEventListener("mousemove", (e) => {

    if (level !== 2 || mouseMoved) return;
    if (tutorialOverlayActive) return; // le fromage est caché derrière le tutoriel

    const rect = cheese.getBoundingClientRect();
    const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;

    if (inside) {
        mouseMoved = true;
        nextLevel();
    }
});

// ============================================================
//  CLIC GAUCHE
// ============================================================

document.addEventListener("click", (e) => {

    if (wasDragging) return;
    if (e.target.id === "nextBtn") return;

    // Niveau 3 : clic gauche n'importe où
    if (level === 3) {
        nextLevel();
        return;
    }

    // Niveau 7 étape 1 : clic gauche sur le fromage
    if (level === 7 && !level7CheeseClicked) {
        if (e.target.id === "cheese") {
            level7CheeseClicked = true;
            cheese.style.opacity = "0.4";
            validateStep();
        }
        return;
    }
});

// ============================================================
//  CLIC DROIT
// ============================================================

document.addEventListener("contextmenu", (e) => {
    e.preventDefault();

    if (level === 5) nextLevel();

    if (level === 7 && level7CheeseClicked) {
        if (e.target.id === "redApple") {
            cheese.style.opacity = "1";
            nextLevel();
        }
    }

    if (level === 35 && keyPressed && leftClicked) nextLevel();
});

cheese.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (level === 6) nextLevel();
});

// ============================================================
//  CLIC GAUCHE SUR LE FROMAGE
// ============================================================

cheese.addEventListener("click", (e) => {
    if (wasDragging) return;

    if (level === 4)  nextLevel();
    if (level === 28 || level === 37) nextLevel();
    if (level === 32 && keyPressed)   nextLevel();

    if (level === 41) {
        clickCount++;
        objectsPlaced = clickCount;
        objectsTotal  = 3;
        updateCounter();
        if (clickCount >= 3) nextLevel();
    }

    // Niveau 50 : clic final après avoir tout fait
    if (level === 50 && wordValidated && objectsPlaced >= objectsTotal) {
        // Étape 2 = "Clique sur le fromage"
        validateStep(2);
        nextLevel();
    }
});

// ============================================================
//  DOUBLE CLIC
// ============================================================

document.addEventListener("dblclick", () => {
    if (level === 8) nextLevel();
});

cheese.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (level === 9) nextLevel();
    if (level === 39 && wordValidated) nextLevel();
});

// ============================================================
//  POMMES : CLICS
// ============================================================

redApple.addEventListener("click", () => {
    if (wasDragging) return;
    if (level === 33 && keyPressed) nextLevel();
    if (level === 37) takePenalty();
    if (level === 40 && wordValidated && cheeseDropped) nextLevel();
});

greenApple.addEventListener("click", () => {
    if (wasDragging) return;
    if (level === 37) takePenalty();
});

// ============================================================
//  CLAVIER PHYSIQUE : TOUCHES
// ============================================================

document.addEventListener("keydown", (e) => {

    if (level === 23) { nextLevel(); return; }

    if (level === 24) {
        if (/[a-z]/i.test(e.key))  nextLevel();
        else if (/[0-9]/.test(e.key)) takePenalty();
        return;
    }

    if (level === 25) {
        if (/[0-9]/.test(e.key)) nextLevel();
        // Pas de pénalité sur ce niveau, même en cas de mauvaise touche
        return;
    }

    if (level === 26) {
        if (e.key.toLowerCase() === "a") nextLevel();
        else takePenalty();
        return;
    }

    if (level === 27) {
        if (e.key === "0") nextLevel();
        else if (/[a-z]/i.test(e.key) || (/[0-9]/.test(e.key) && e.key !== "0")) takePenalty();
        return;
    }

    if (level === 32) {
        if (e.key.toLowerCase() === "s") {
            keyPressed = true;
            instruction.innerText = "Bien ! Maintenant clique sur le fromage 🧀";
            validateStep();
        } else {
            takePenalty();
        }
        return;
    }

    if (level === 33) {
        if (e.key.toLowerCase() === "a") {
            keyPressed = true;
            instruction.innerText = "Bien ! Maintenant clique sur la pomme rouge 🍎";
        } else {
            takePenalty();
        }
        return;
    }

    if (level === 35 && leftClicked && !keyPressed) {
        keyPressed = true;
        instruction.innerText = "Parfait ! Maintenant fais un CLIC DROIT";
        validateStep();
    }
});

// ============================================================
//  NIVEAU 35 : MOUSEDOWN POUR DÉTECTER LE CLIC GAUCHE
// ============================================================

document.addEventListener("mousedown", (e) => {
    if (level === 35 && e.button === 0 && !leftClicked) {
        const isDraggable =
            e.target.classList.contains("object") ||
            e.target.id === "cheese" ||
            e.target.classList.contains("apple");
        if (!isDraggable) {
            leftClicked = true;
            instruction.innerText = "Bien ! Maintenant appuie sur une touche du clavier";
            validateStep();
        }
    }
});

// ============================================================
//  SÉQUENCE NIVEAU 38 : POMME → FROMAGE → POMME
// ============================================================

document.addEventListener("click", (e) => {
    if (level !== 38) return;
    if (wasDragging) return;

    if      (sequence === 0 && e.target.closest("#redApple")) { sequence = 1; validateStep(); }
    else if (sequence === 1 && e.target.closest("#cheese"))   { sequence = 2; validateStep(); }
    else if (sequence === 2 && e.target.closest("#redApple")) { nextLevel(); }
    else {
        // Mauvais clic : on recommence la séquence depuis le début
        sequence = 0;
        takePenalty();
        showRestartPopup();
        resetChecklistTo(0);
    }
});

// ============================================================
//  VALIDATION AUTOMATIQUE DU TEXTE (sans cliquer sur Valider)
// ============================================================

textInput.addEventListener("input", () => {

    const value = textInput.value.trim();
    const data  = LEVELS[level - 1];

    // Actions avec validation automatique
    const autoActions = [
        "write-then-drag", "write-object-name", "write-then-doubleclick",
        "mini-challenge", "timer-write-2-words", "timer-drag-and-write",
        "timer-sort-and-write", "timer-grand-final"
    ];
    if (!autoActions.includes(data.action)) return;

    // Trouver le mot attendu
    let expectedWord = null;

    if (["write-then-drag","write-object-name","write-then-doubleclick",
         "timer-drag-and-write","timer-sort-and-write","timer-grand-final"].includes(data.action)) {
        expectedWord = data.word;
    }
    if (data.action === "mini-challenge") {
        expectedWord = "bravo";
    }
    if (data.action === "timer-write-2-words") {
        if (data._wordIndex === undefined) data._wordIndex = 0;
        expectedWord = data.words[data._wordIndex];
    }

    if (!expectedWord) return;
    if (value.toLowerCase() !== expectedWord.toLowerCase()) return;

    // Le mot est correct : on traite selon l'action
    textInput.value = "";
    handleWordValidated(data);
});

// ============================================================
//  BOUTON VALIDER (clic manuel)
// ============================================================

validateBtn.addEventListener("click", () => {

    const value = textInput.value.trim();
    const data  = LEVELS[level - 1];

    if (data.action === "write-name" || data.action === "write-animal") {
        if (/^[A-Za-zÀ-ÿ\- ]{2,20}$/.test(value)) nextLevel();
        else takePenalty();
        return;
    }

    if (data.action === "write-age") {
        if (/^\d+$/.test(value)) {
            const age = Number(value);
            if (age >= 1 && age <= 18) nextLevel();
            else takePenalty();
        } else {
            takePenalty();
        }
        return;
    }

    if (data.action === "write-word" || data.action === "write-object-name") {
        if (value.toLowerCase() === data.word) nextLevel();
        else takePenalty();
        return;
    }

    // Pour toutes les actions mixtes, on vérifie le mot et on délègue
    const mixedActions = [
        "write-then-drag", "write-then-doubleclick", "mini-challenge",
        "timer-drag-and-write", "timer-write-2-words",
        "timer-sort-and-write", "timer-grand-final"
    ];

    if (mixedActions.includes(data.action)) {
        // Récupérer le mot attendu selon l'action
        let expectedWord = data.word;
        if (data.action === "mini-challenge") expectedWord = "bravo";
        if (data.action === "timer-write-2-words") {
            if (data._wordIndex === undefined) data._wordIndex = 0;
            expectedWord = data.words[data._wordIndex];
        }

        if (value.toLowerCase() === expectedWord.toLowerCase()) {
            textInput.value = "";
            handleWordValidated(data);
        } else {
            takePenalty();
        }
    }
});

// ============================================================
//  LOGIQUE COMMUNE APRÈS UN MOT VALIDÉ
//  (appelée par le bouton ET par la validation automatique)
// ============================================================

function handleWordValidated(data) {

    if (data.action === "write-then-drag") {
        wordValidated = true;
        inputZone.style.display = "none";
        
        validateStep();
        instruction.innerText = "Bien ! Maintenant glisse la pomme rouge 🍎 dans son sac";
        return;
    }

    if (data.action === "write-object-name") {
        nextLevel();
        return;
    }

    if (data.action === "write-then-doubleclick") {
        wordValidated = true;
        inputZone.style.display = "none";
        
        validateStep();
        instruction.innerText = "Bien ! Maintenant double-clique sur le fromage 🧀";
        return;
    }

    if (data.action === "mini-challenge") {
        wordValidated = true;
        inputZone.style.display = "none";
        
        validateStep();
        if (cheeseDropped) instruction.innerText = "Super ! Maintenant clique sur la pomme 🍎";
        else               instruction.innerText = "Super ! Glisse le fromage dans son sac, puis clique sur la pomme";
        return;
    }

    if (data.action === "timer-drag-and-write") {
        wordValidated = true;
        inputZone.style.display = "none";
        
        validateStep();
        if (cheeseDropped) nextLevel();
        else instruction.innerText = "Bien ! Maintenant glisse le fromage 🧀 dans son sac";
        return;
    }

    if (data.action === "timer-write-2-words") {
        data._wordIndex++;
        if (data._wordIndex >= data.words.length) nextLevel();
        else instruction.innerText = "⏱️ Maintenant écris : " + data.words[data._wordIndex];
        return;
    }

    if (data.action === "timer-sort-and-write") {
        wordValidated = true;
        inputZone.style.display = "none";
        
        validateStep();
        if (objectsPlaced >= objectsTotal) nextLevel();
        else instruction.innerText = "⏱️ Bien ! Maintenant trie les objets restants !";
        return;
    }

    if (data.action === "timer-grand-final") {
        wordValidated = true;
        inputZone.style.display = "none";
        
        // Étape 1 = "Écris 'champion'" (index 1 dans la checklist niveau 50)
        validateStep(1);
        if (objectsPlaced >= objectsTotal) instruction.innerText = "🏆 Maintenant clique sur le fromage 🧀 pour finir !";
        else instruction.innerText = "⏱️ Bien ! Trie les objets restants, puis clique sur le fromage !";
        return;
    }
}

// ============================================================
//  DRAG & DROP — MOUSEDOWN (début du glisser)
// ============================================================

document.addEventListener("mousedown", (e) => {

    const target = e.target;
    const isDraggable =
        target.classList.contains("object") ||
        target.id === "cheese" ||
        target.classList.contains("apple");

    if (!isDraggable) return;

    dragStartX  = e.clientX;
    dragStartY  = e.clientY;
    wasDragging = false;
    dragging    = target;

    const zoom  = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    offsetX     = e.offsetX / zoom;
    offsetY     = e.offsetY / zoom;

    dragging.style.position = "absolute";
    dragging.style.zIndex   = "999";
    dragging.style.cursor   = "grabbing";
});

// ============================================================
//  DRAG & DROP — MOUSEMOVE (pendant le glisser)
// ============================================================

document.addEventListener("mousemove", (e) => {

    if (!dragging) return;

    const dx = Math.abs(e.clientX - dragStartX);
    const dy = Math.abs(e.clientY - dragStartY);
    if (dx > 5 || dy > 5) wasDragging = true;

    const gameArea = document.getElementById("gameArea");
    const areaRect = gameArea.getBoundingClientRect();
    const zoom     = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;

    let newX = (e.clientX / zoom) - (areaRect.left / zoom) - offsetX;
    let newY = (e.clientY / zoom) - (areaRect.top  / zoom) - offsetY;

    newX = Math.max(0, Math.min(newX, gameArea.clientWidth  - dragging.offsetWidth));
    newY = Math.max(0, Math.min(newY, gameArea.clientHeight - dragging.offsetHeight));

    dragging.style.left = newX + "px";
    dragging.style.top  = newY + "px";
});

// ============================================================
//  DRAG & DROP — MOUSEUP (fin du glisser)
// ============================================================

document.addEventListener("mouseup", (e) => {

    if (!dragging) return;
    dragging.style.cursor = "grab";

    if (!wasDragging) {
        dragging = null;
        return;
    }

    const zoom    = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    const cursorX = e.clientX / zoom;
    const cursorY = e.clientY / zoom;

    // Vérifie si le curseur est au-dessus d'un élément cible
    function isOver(target) {
        const rect   = target.getBoundingClientRect();
        const margin = 30;
        return (
            cursorX >= (rect.left  / zoom) - margin &&
            cursorX <= (rect.right / zoom) + margin &&
            cursorY >= (rect.top   / zoom) - margin &&
            cursorY <= (rect.bottom/ zoom) + margin
        );
    }

    // Vérifie si l'objet a été lâché dans un mauvais sac
    function droppedInWrongBag(correctBags) {
        const allBags = [redBag, greenBag, blueBag, yellowBag];
        return allBags.some(bag => {
            return bag.style.display !== "none" &&
                   !correctBags.includes(bag)   &&
                   isOver(bag);
        });
    }

    // --- NIVEAU 10 : fromage → sac jaune ---
    if (level === 10) {
        if (dragging.id === "cheese" && isOver(yellowBag))                { playDropSound(); nextLevel(); }
        else if (droppedInWrongBag([yellowBag]))                           takePenalty();
    }

    // --- NIVEAU 11 : pomme rouge → sac rouge ---
    if (level === 11) {
        if (dragging.id === "redApple" && isOver(redBag))                 { playDropSound(); nextLevel(); }
        else if (droppedInWrongBag([redBag]))                              takePenalty();
    }

    // --- NIVEAU 12 : pomme verte → sac vert ---
    if (level === 12) {
        if (dragging.id === "greenApple" && isOver(greenBag))             { playDropSound(); nextLevel(); }
        else if (droppedInWrongBag([greenBag]))                            takePenalty();
    }

    // --- NIVEAU 13 : 2 pommes ---
    if (level === 13) {
        let ok = false;
        if (dragging.id === "redApple"   && isOver(redBag))   { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging.id === "greenApple" && isOver(greenBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (droppedInWrongBag([redBag, greenBag]))             takePenalty();
        if (ok) checkObjectsPlaced();
    }

    // --- NIVEAUX 14 et 19 : 3 objets colorés ---
    if (level === 14 || level === 19) {
        let ok = false;
        if      (dragging === redObject   && isOver(redBag))   { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging === greenObject && isOver(greenBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging === blueObject  && isOver(blueBag))  { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (droppedInWrongBag([redBag, greenBag, blueBag])) takePenalty();
        if (ok) checkObjectsPlaced();
    }

    // --- NIVEAU 15 : révéler puis glisser rouge ---
    if (level === 15) {
        if (dragging.id === "redApple" && isOver(redBag))                  { playDropSound(); nextLevel(); }
        else if (dragging.id === "redApple" && droppedInWrongBag([redBag])) takePenalty();
    }

    // --- NIVEAU 16 : fromage + pomme rouge ---
    if (level === 16) {
        let ok = false;
        if (dragging.id === "cheese"   && isOver(yellowBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; validateStep(); ok = true; }
        else if (dragging.id === "redApple" && isOver(redBag))    { playDropSound(); dragging.style.display = "none"; objectsPlaced++; validateStep(); ok = true; }
        else if (droppedInWrongBag([yellowBag, redBag]))            takePenalty();
        if (ok) checkObjectsPlaced();
    }

    // --- NIVEAU 17 : ordre rouge → vert → bleu ---
    if (level === 17) {
        const order = [
            { el: redObject,   bag: redBag   },
            { el: greenObject, bag: greenBag },
            { el: blueObject,  bag: blueBag  }
        ];
        const current = order[dragOrderIndex];
        if (current && dragging === current.el && isOver(current.bag)) {
            playDropSound();
            dragging.style.display = "none";
            dragOrderIndex++;
            objectsPlaced++;
            validateStep();
            checkObjectsPlaced();
        } else if (droppedInWrongBag([redBag, greenBag, blueBag])) {
            takePenalty();
        }
        updateCounter();
    }

    // --- NIVEAU 18 : uniquement le fromage ---
    if (level === 18) {
        if (dragging.id === "cheese" && isOver(yellowBag))                     { playDropSound(); nextLevel(); }
        else if (dragging.id === "cheese" && droppedInWrongBag([yellowBag]))    takePenalty();
    }

    // --- NIVEAU 20 : fromage + 2 pommes ---
    if (level === 20) {
        let ok = false;
        if      (dragging.id === "cheese"     && isOver(yellowBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging.id === "redApple"   && isOver(redBag))    { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging.id === "greenApple" && isOver(greenBag))  { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (droppedInWrongBag([yellowBag, redBag, greenBag]))   takePenalty();
        if (ok) checkObjectsPlaced();
    }

    // --- NIVEAU 34 : glisser pomme rouge après avoir écrit ---
    if (level === 34 && wordValidated) {
        if (dragging.id === "redApple" && isOver(redBag))                  { validateStep(); playDropSound(); nextLevel(); }
        else if (droppedInWrongBag([redBag]))                               takePenalty();
    }

    // --- NIVEAU 40 : glisser fromage ---
    if (level === 40 && wordValidated && !cheeseDropped) {
        if (dragging.id === "cheese" && isOver(yellowBag)) {
            playDropSound();
            cheeseDropped = true;
            dragging.style.display = "none";
            validateStep();
            instruction.innerText = "Super ! Maintenant clique sur la pomme 🍎";
        } else if (dragging.id === "cheese" && droppedInWrongBag([yellowBag])) {
            takePenalty();
        }
    }

    // --- NIVEAUX 42 et 44 : timer drag ---
    if (level === 42 || level === 44) {
        let ok = false;
        if      (dragging === redObject   && isOver(redBag))   { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging === greenObject && isOver(greenBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging === blueObject  && isOver(blueBag))  { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (droppedInWrongBag([redBag, greenBag, blueBag])) takePenalty();
        if (ok) {
            if (objectsTotal === 0) objectsTotal = LEVELS[level - 1].total;
            checkObjectsPlaced();
        }
    }

    // --- NIVEAU 47 : glisser fromage + écrire ---
    if (level === 47) {
        if (dragging.id === "cheese" && isOver(yellowBag)) {
            playDropSound();
            cheeseDropped = true;
            dragging.style.display = "none";
            validateStep();
            if (wordValidated) nextLevel();
            else instruction.innerText = "⏱️ Bien ! Maintenant écris 'vite'";
        } else if (dragging.id === "cheese" && droppedInWrongBag([yellowBag])) {
            takePenalty();
        }
    }

    // --- NIVEAU 49 : trier d'abord, puis écrire seulement une fois le tri terminé ---
    if (level === 49) {
        let ok = false;
        if      (dragging.id === "cheese"     && isOver(yellowBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging.id === "redApple"   && isOver(redBag))    { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging.id === "greenApple" && isOver(greenBag))  { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (droppedInWrongBag([yellowBag, redBag, greenBag]))   takePenalty();

        if (ok) {
            updateCounter();
            // Une fois le tri terminé, on révèle la zone de texte
            if (objectsPlaced >= objectsTotal && inputZone.style.display === "none") {
                showInputZoneFor49And50();
                instruction.innerText = "⏱️ Bien joué ! Maintenant écris le mot 'super'";
            }
        }
    }

    // --- NIVEAU 50 : trier d'abord, puis écrire + clic fromage ---
    if (level === 50) {
        let ok = false;
        if      (dragging === redObject   && isOver(redBag))   { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging === greenObject && isOver(greenBag)) { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (dragging === blueObject  && isOver(blueBag))  { playDropSound(); dragging.style.display = "none"; objectsPlaced++; ok = true; }
        else if (droppedInWrongBag([redBag, greenBag, blueBag])) takePenalty();
        if (ok) {
            updateCounter();
            // Étape 0 = "Trie les 3 objets" : validée seulement quand TOUT est trié
            if (objectsPlaced >= objectsTotal) {
                validateStep(0);
                // Une fois le tri terminé, on révèle la zone de texte
                if (inputZone.style.display === "none") {
                    showInputZoneFor49And50();
                    instruction.innerText = "🏆 Bien joué ! Maintenant écris 'champion'";
                }
            }
        }
        // pas de nextLevel ici, il faut aussi le mot + le fromage
    }

    dragging = null;

    // Reset wasDragging après un court délai
    setTimeout(() => { wasDragging = false; }, 50);
});

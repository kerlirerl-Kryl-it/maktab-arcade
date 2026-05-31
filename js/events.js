/* =========================
   BOUTON SUIVANT
========================= */
nextBtn.addEventListener("click", () => {

    nextBtnSound.currentTime = 0;
    nextBtnSound.play();

    if(level === 1){
        level++;
        updateUI();
        loadLevel();
    }
});

/* =========================
   SOURIS : MOUVEMENT
========================= */

document.addEventListener("mousemove", (e) => {

    if(level !== 2 || mouseMoved) return;

    const rect = cheese.getBoundingClientRect();
    const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if(inside){
        mouseMoved = true;
        nextLevel();
    }
});

/* =========================
   CLIC GAUCHE
========================= */

document.addEventListener("click", (e) => {

    // Éviter que les clics de drag soient interprétés comme des clics normaux
    if(wasDragging) return;

    // Bouton suivant niveau 1 — ne jamais bloquer
    if(e.target.id === "nextBtn") return;

    // Niveau 3 : clic gauche n'importe où
    if(level === 3){
        nextLevel();
        return;
    }

    // Niveau 7 : étape 1 — clic gauche sur le fromage
    if(level === 7 && !level7CheeseClicked){
        if(e.target.id === "cheese"){
            level7CheeseClicked = true;
            cheese.style.opacity = "0.4";
        }
        return;
    }
});

/* =========================
   CLIC DROIT
========================= */

document.addEventListener("contextmenu", (e) => {

    e.preventDefault();

    if(level === 5){
        nextLevel();
    }

    if(level === 7 && level7CheeseClicked){
        if(e.target.id === "redApple"){
            cheese.style.opacity = "1";
            nextLevel();
        }
    }

    if(level === 35 && keyPressed && leftClicked){
        nextLevel();
    }
});

cheese.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if(level === 6){
        nextLevel();
    }
});

/* =========================
   FROMAGE : CLIC GAUCHE
========================= */

cheese.addEventListener("click", (e) => {

    if(wasDragging) return;

    if(level === 4){
        nextLevel();
    }

    if(level === 28 || level === 37){
        nextLevel();
    }

    if(level === 32 && keyPressed){
        nextLevel();
    }

    if(level === 41){
        clickCount++;
        objectsPlaced = clickCount;
        objectsTotal = 3;
        updateCounter();
        if(clickCount >= 3){
            nextLevel();
        }
    }
    // Niveau 50 : clic final sur fromage après avoir tout fait
    if(level === 50 && wordValidated && objectsPlaced >= objectsTotal){
        nextLevel();
    }
});

/* =========================
   DOUBLE CLIC
========================= */

document.addEventListener("dblclick", () => {
    if(level === 8){
        nextLevel();
    }
});

cheese.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(level === 9){
        nextLevel();
    }
    if(level === 39 && wordValidated){
        nextLevel();
    }
});

/* =========================
   POMMES
========================= */

redApple.addEventListener("click", () => {
    if(wasDragging) return;
    if(level === 24){
        nextLevel();
    }
    if(level === 33 && keyPressed){
        nextLevel();
    }
});

greenApple.addEventListener("click", () => {
    if(wasDragging) return;
    if(level === 25){
        nextLevel();
    }
});

/* =========================
   CLAVIER : TOUCHES
========================= */

document.addEventListener("keydown", (e) => {

    if(level === 23){
        nextLevel();
    }

    if(level === 24){
        if(/[a-z]/i.test(e.key)){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(level === 25){
        if(/[0-9]/.test(e.key)){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(level === 26){
        if(e.key.toLowerCase() === "a"){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(level === 27){
        if(e.key === "0"){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(level === 32){
        if(e.key.toLowerCase() === "s"){
            keyPressed = true;
            instruction.innerText = "Bien ! Maintenant clique sur le fromage 🧀";
        } else {
            takePenalty();
        }
    }

    if(level === 33){
        if(e.key.toLowerCase() === "a"){
            keyPressed = true;
            instruction.innerText = "Bien ! Maintenant clique sur la pomme rouge 🍎";
        } else {
            takePenalty();
        }
    }

    if(level === 35 && leftClicked && !keyPressed){
        keyPressed = true;
        instruction.innerText = "Parfait ! Maintenant fais un CLIC DROIT";
    }
});

/* =========================
   NIVEAU 35 : MOUSEDOWN POUR CLIC GAUCHE
========================= */

document.addEventListener("mousedown", (e) => {
    if(level === 35 && e.button === 0 && !leftClicked){
        // Ne pas déclencher si on clique sur un objet draggable
        const isDraggable =
            e.target.classList.contains("object") ||
            e.target.id === "cheese" ||
            e.target.classList.contains("apple");
        if(!isDraggable){
            leftClicked = true;
            instruction.innerText = "Bien ! Maintenant appuie sur une touche du clavier";
        }
    }
});

/* =========================
   VALIDATION AUTOMATIQUE
========================= */

textInput.addEventListener("input", () => {

    const value = textInput.value.trim();
    const data = LEVELS[level - 1];

    // Niveaux avec validation automatique
    const autoLevels = [
        "write-then-drag",
        "write-object-name",
        "write-then-doubleclick",
        "mini-challenge",
        "timer-write-2-words",
        "timer-drag-and-write",
        "timer-sort-and-write",
        "timer-grand-final"
    ];

    if(!autoLevels.includes(data.action)) return;

    // Récupérer le mot attendu selon l'action
    let expectedWord = null;

    if(data.action === "write-then-drag" ||
       data.action === "write-object-name" ||
       data.action === "write-then-doubleclick"){
        expectedWord = data.word;
    }

    if(data.action === "mini-challenge"){
        expectedWord = "bravo";
    }

    if(data.action === "timer-drag-and-write"){
        expectedWord = data.word;
    }

    if(data.action === "timer-sort-and-write" ||
       data.action === "timer-grand-final"){
        expectedWord = data.word;
    }

    if(data.action === "timer-write-2-words"){
        if(!data._wordIndex) data._wordIndex = 0;
        expectedWord = data.words[data._wordIndex];
    }

    if(!expectedWord) return;

    // Vérifier si le mot est correct
    if(value.toLowerCase() === expectedWord.toLowerCase()){

        // Simuler la logique du bouton valider
        textInput.value = "";

        // Même logique que validateBtn pour chaque action
        if(data.action === "write-then-drag"){
            wordValidated = true;
            textInput.style.display = "none";
            instruction.innerText = "Bien ! Maintenant glisse la pomme rouge 🍎 dans son sac";
        }

        if(data.action === "write-object-name"){
            nextLevel();
        }

        if(data.action === "write-then-doubleclick"){
            wordValidated = true;
            textInput.style.display = "none";
            instruction.innerText = "Bien ! Maintenant double-clique sur le fromage 🧀";
        }

        if(data.action === "mini-challenge"){
            wordValidated = true;
            textInput.style.display = "none";
            if(cheeseDropped){
                instruction.innerText = "Super ! Maintenant clique sur la pomme 🍎";
            } else {
                instruction.innerText = "Super ! Glisse le fromage dans son sac, puis clique sur la pomme";
            }
        }

        if(data.action === "timer-drag-and-write"){
            wordValidated = true;
            textInput.style.display = "none";
            if(cheeseDropped){ nextLevel(); }
            else { instruction.innerText = "Bien ! Maintenant glisse le fromage 🧀 dans son sac"; }
        }

        if(data.action === "timer-write-2-words"){
            data._wordIndex++;
            if(data._wordIndex >= data.words.length){
                nextLevel();
            } else {
                instruction.innerText = "⏱️ Maintenant écris : " + data.words[data._wordIndex];
            }
        }

        if(data.action === "timer-sort-and-write"){
            wordValidated = true;
            textInput.style.display = "none";
            if(objectsPlaced >= objectsTotal){ nextLevel(); }
            else { instruction.innerText = "⏱️ Bien ! Maintenant trie les objets restants !"; }
        }

        if(data.action === "timer-grand-final"){
            wordValidated = true;
            textInput.style.display = "none";
            if(objectsPlaced >= objectsTotal){
                instruction.innerText = "🏆 Maintenant clique sur le fromage 🧀 pour finir !";
            } else {
                instruction.innerText = "⏱️ Bien ! Trie les objets restants, puis clique sur le fromage !";
            }
        }
    }
});

/* =========================
   BOUTON VALIDER
========================= */

validateBtn.addEventListener("click", () => {

    const value = textInput.value.trim();
    const data = LEVELS[level - 1];

    if(data.action === "write-name" || data.action === "write-animal"){
        if(/^[a-zA-Z]{1,10}$/.test(value)){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(data.action === "write-age"){
        const age = Number(value);
        if(age >= 1 && age <= 18){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(data.action === "write-word" || data.action === "write-object-name"){
        if(value.toLowerCase() === data.word){
            nextLevel();
        } else {
            takePenalty();
        }
    }

    if(data.action === "write-then-drag"){
        if(value.toLowerCase() === data.word){
            wordValidated = true;
            textInput.style.display = "none";
            validateBtn.style.display = "none";
            instruction.innerText = "Bien ! Maintenant glisse la pomme rouge 🍎 dans son sac";
        } else {
            takePenalty();
        }
    }

    if(data.action === "write-then-doubleclick"){
        if(value.toLowerCase() === data.word){
            wordValidated = true;
            textInput.style.display = "none";
            validateBtn.style.display = "none";
            instruction.innerText = "Bien ! Maintenant double-clique sur le fromage 🧀";
        } else {
            takePenalty();
        }
    }

    if(data.action === "timer-drag-and-write"){
        if(value.toLowerCase() === data.word){
            wordValidated = true;
            textInput.style.display = "none";
            validateBtn.style.display = "none";
            if(cheeseDropped){
                nextLevel();
            } else {
                instruction.innerText = "Bien ! Maintenant glisse le fromage 🧀 dans son sac";
            }
        } else {
            takePenalty();
        }
    }

    if(data.action === "mini-challenge"){
        if(value.toLowerCase() === "bravo"){
            wordValidated = true;
            textInput.style.display = "none";
            validateBtn.style.display = "none";
            if(cheeseDropped){
                instruction.innerText = "Super ! Maintenant clique sur la pomme 🍎";
            } else {
                instruction.innerText = "Super ! Glisse le fromage dans son sac, puis clique sur la pomme";
            }
        } else {
            takePenalty();
        }
    }

    if(data.action === "timer-write-2-words"){
        if(!data._wordIndex) data._wordIndex = 0;
        if(value.toLowerCase() === data.words[data._wordIndex]){
            data._wordIndex++;
            textInput.value = "";
            if(data._wordIndex >= data.words.length){
                nextLevel();
            } else {
                instruction.innerText = "⏱️ Maintenant écris : " + data.words[data._wordIndex];
            }
        } else {
            takePenalty();
        }
    }

    if(data.action === "timer-sort-and-write"){
    if(value.toLowerCase() === data.word){
        wordValidated = true;
        textInput.style.display = "none";
        validateBtn.style.display = "none";
        if(objectsPlaced >= objectsTotal){
            nextLevel();
            } else {
            instruction.innerText = "⏱️ Bien ! Maintenant trie les objets restants !";
            }
        } else {
        takePenalty();
        }   
    }

    if(data.action === "timer-grand-final"){
    if(value.toLowerCase() === data.word){
        wordValidated = true;
        textInput.style.display = "none";
        validateBtn.style.display = "none";
        if(objectsPlaced >= objectsTotal){
            instruction.innerText = "🏆 Maintenant clique sur le fromage 🧀 pour finir !";
            } else {
            instruction.innerText = "⏱️ Bien ! Trie les objets restants, puis clique sur le fromage !";
            }
        }   else {
        takePenalty();
        }
}
});

/* =========================
   SEQUENCE NIVEAU 38
========================= */

document.addEventListener("click", (e) => {

    if(level !== 38) return;
    if(wasDragging) return;

    if(sequence === 0 && e.target.closest("#redApple")){
        sequence = 1;
    }
    else if(sequence === 1 && e.target.closest("#cheese")){
        sequence = 2;
    }
    else if(sequence === 2 && e.target.closest("#redApple")){
        nextLevel();
    }
    else {
        sequence = 0;
        takePenalty();
    }
});

/* =========================
   NIVEAU 40 : CLIC POMME APRÈS FROMAGE
========================= */

redApple.addEventListener("click", () => {
    if(wasDragging) return;
    if(level === 40 && wordValidated && cheeseDropped){
        nextLevel();
    }
});

/* =========================
   DRAG & DROP
========================= */

document.addEventListener("mousedown", (e) => {

    const target = e.target;

    const isDraggable =
        target.classList.contains("object") ||
        target.id === "cheese" ||
        target.classList.contains("apple");

    if(!isDraggable) return;

    // On mémorise la position de départ
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    wasDragging = false;

    dragging = target;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    dragging.style.position = "absolute";
    dragging.style.zIndex = 999;
    dragging.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {

    if(!dragging) return;

    // On considère que c'est un drag seulement après 5px de mouvement
    const dx = Math.abs(e.clientX - dragStartX);
    const dy = Math.abs(e.clientY - dragStartY);
    if(dx > 5 || dy > 5){
        wasDragging = true;
    }

    const gameArea = document.getElementById("gameArea");
    const areaRect = gameArea.getBoundingClientRect();

    let newX = e.clientX - areaRect.left - offsetX;
    let newY = e.clientY - areaRect.top - offsetY;

    if(newX < 0){ newX = 0; }
    if(newY < 0){ newY = 0; }
    if(newX > gameArea.clientWidth - dragging.offsetWidth){
        newX = gameArea.clientWidth - dragging.offsetWidth;
    }
    if(newY > gameArea.clientHeight - dragging.offsetHeight){
        newY = gameArea.clientHeight - dragging.offsetHeight;
    }

    dragging.style.left = newX + "px";
    dragging.style.top = newY + "px";
});

document.addEventListener("mouseup", (e) => {

    if(!dragging) return;

    dragging.style.cursor = "grab";

    if(!wasDragging){
        dragging = null;
        return;
    }

    // On utilise la position du curseur au moment du lâcher
    const cursorX = e.clientX;
    const cursorY = e.clientY;

    function isOver(target){
        const rect = target.getBoundingClientRect();
        const margin = 30;
        return (
            cursorX >= rect.left - margin &&
            cursorX <= rect.right + margin &&
            cursorY >= rect.top - margin &&
            cursorY <= rect.bottom + margin
        );
    }

    function droppedInWrongBag(correctBags){
        const allBags = [redBag, greenBag, blueBag, yellowBag];
        return allBags.some(bag => {
            const bagVisible = bag.style.display !== "none";
            const notCorrect = !correctBags.includes(bag);
            return bagVisible && notCorrect && isOver(bag);
        });
    }

    // ── NIVEAU 10 : fromage → sac jaune ──
    if(level === 10){
        if(dragging.id === "cheese" && isOver(yellowBag)){
            playDropSound();
            nextLevel();
        } else if(droppedInWrongBag([yellowBag])){
            takePenalty();
        }
        // Lâché dans le vide → rien
    }

    // ── NIVEAU 11 : pomme rouge → sac rouge ──
    if(level === 11){
        if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound();
            nextLevel();
        } else if(droppedInWrongBag([redBag])){
            takePenalty();
        }
    }

    // ── NIVEAU 12 : pomme verte → sac vert ──
    if(level === 12){
        if(dragging.id === "greenApple" && isOver(greenBag)){
            playDropSound();
            nextLevel();
        } else if(droppedInWrongBag([greenBag])){
            takePenalty();
        }
    }

    // ── NIVEAU 13 : 2 pommes ──
    if(level === 13){
        let correct = false;
        if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging.id === "greenApple" && isOver(greenBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(droppedInWrongBag([redBag, greenBag])){
            takePenalty();
        }
        if(correct) checkObjectsPlaced();
    }

    // ── NIVEAUX 14 et 19 : 3 objets colorés ──
    if(level === 14 || level === 19){
        let correct = false;
        if(dragging === redObject && isOver(redBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging === greenObject && isOver(greenBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging === blueObject && isOver(blueBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(droppedInWrongBag([redBag, greenBag, blueBag])){
            takePenalty();
        }
        if(correct) checkObjectsPlaced();
    }

    // ── NIVEAU 15 : révéler puis glisser rouge ──
    if(level === 15){
        if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound();
            nextLevel();
        } else if(dragging.id === "redApple" && droppedInWrongBag([redBag])){
            takePenalty();
        }
        // Pomme verte : on peut la déplacer librement, pas de pénalité
    }

    // ── NIVEAU 16 : fromage + pomme rouge ──
    if(level === 16){
        let correct = false;
        if(dragging.id === "cheese" && isOver(yellowBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(droppedInWrongBag([yellowBag, redBag])){
            takePenalty();
        }
        if(correct) checkObjectsPlaced();
    }

    // ── NIVEAU 17 : ordre rouge → vert → bleu ──
    if(level === 17){
        const order = [
            { el: redObject, bag: redBag },
            { el: greenObject, bag: greenBag },
            { el: blueObject, bag: blueBag }
        ];
        const current = order[dragOrderIndex];
        if(current && dragging === current.el && isOver(current.bag)){
            playDropSound();
            dragging.style.display = "none";
            dragOrderIndex++;
            objectsPlaced++;
            checkObjectsPlaced();
        } else if(droppedInWrongBag([redBag, greenBag, blueBag])){
            takePenalty();
        }
        updateCounter();
    }

    // ── NIVEAU 18 : uniquement le fromage ──
    if(level === 18){
        if(dragging.id === "cheese" && isOver(yellowBag)){
            playDropSound();
            nextLevel();
        } else if(dragging.id === "cheese" && droppedInWrongBag([yellowBag])){
            takePenalty();
        }
        // Pomme rouge : pas de pénalité si on la déplace
    }

    // ── NIVEAU 20 : fromage + 2 pommes ──
    if(level === 20){
        let correct = false;
        if(dragging.id === "cheese" && isOver(yellowBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging.id === "greenApple" && isOver(greenBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(droppedInWrongBag([yellowBag, redBag, greenBag])){
            takePenalty();
        }
        if(correct) checkObjectsPlaced();
    }

    // ── NIVEAU 26 : pomme rouge → sac rouge ──
    if(level === 26){
        if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound();
            nextLevel();
        } else if(droppedInWrongBag([redBag])){
            takePenalty();
        }
    }

    // ── NIVEAU 27 : trier 3 objets ──
    if(level === 27){
        let correct = false;
        if(dragging === redObject && isOver(redBag)){
            playDropSound(); redObject.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging === greenObject && isOver(greenBag)){
            playDropSound(); greenObject.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging === blueObject && isOver(blueBag)){
            playDropSound(); blueObject.style.display = "none"; objectsPlaced++; correct = true;
        } else if(droppedInWrongBag([redBag, greenBag, blueBag])){
            takePenalty();
        }
        if(correct) checkObjectsPlaced();
    }

    // ── NIVEAU 34 : glisser pomme rouge après avoir écrit ──
    if(level === 34 && wordValidated){
        if(dragging.id === "redApple" && isOver(redBag)){
            playDropSound();
            nextLevel();
        } else if(droppedInWrongBag([redBag])){
            takePenalty();
        }
    }

    // ── NIVEAU 40 : glisser fromage ──
    if(level === 40 && wordValidated && !cheeseDropped){
        if(dragging.id === "cheese" && isOver(yellowBag)){
            playDropSound();
            cheeseDropped = true;
            dragging.style.display = "none";
            instruction.innerText = "Super ! Maintenant clique sur la pomme 🍎";
        } else if(dragging.id === "cheese" && droppedInWrongBag([yellowBag])){
            takePenalty();
        }
    }

    // ── NIVEAUX 42 et 44 : timer drag ──
    if(level === 42 || level === 44){
        let correct = false;
        if(dragging === redObject && isOver(redBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging === greenObject && isOver(greenBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(dragging === blueObject && isOver(blueBag)){
            playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
        } else if(droppedInWrongBag([redBag, greenBag, blueBag])){
            takePenalty();
        }
        if(correct){
        if(objectsTotal === 0) objectsTotal = LEVELS[level - 1].total;
        checkObjectsPlaced();
        }  
    }

    // ── NIVEAU 47 : glisser fromage + écrire ──
    if(level === 47){
        if(dragging.id === "cheese" && isOver(yellowBag)){
            playDropSound();
            cheeseDropped = true;
            dragging.style.display = "none";
            if(wordValidated){
                nextLevel();
            } else {
                instruction.innerText = "⏱️ Bien ! Maintenant écris 'vite'";
            }
        } else if(dragging.id === "cheese" && droppedInWrongBag([yellowBag])){
            takePenalty();
        }
    }

    // ── NIVEAU 49 : timer trier + écrire ──
if(level === 49){
    let correct = false;
    if(dragging.id === "cheese" && isOver(yellowBag)){
        playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
    } else if(dragging.id === "redApple" && isOver(redBag)){
        playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
    } else if(dragging.id === "greenApple" && isOver(greenBag)){
        playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
    } else if(droppedInWrongBag([yellowBag, redBag, greenBag])){
        takePenalty();
    }
    if(correct && wordValidated) checkObjectsPlaced();
    else if(correct) updateCounter();
}

// ── NIVEAU 50 : trier objets + écrire + clic fromage ──
if(level === 50){
    let correct = false;
    if(dragging === redObject && isOver(redBag)){
        playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
    } else if(dragging === greenObject && isOver(greenBag)){
        playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
    } else if(dragging === blueObject && isOver(blueBag)){
        playDropSound(); dragging.style.display = "none"; objectsPlaced++; correct = true;
    } else if(droppedInWrongBag([redBag, greenBag, blueBag])){
        takePenalty();
    }
    // On met à jour le compteur mais on ne valide PAS encore
    if(correct) updateCounter();
}

    dragging = null;

    // Reset wasDragging après un court délai
    // pour que les listeners "click" l'ignorent
    setTimeout(() => {
        wasDragging = false;
    }, 50);
});

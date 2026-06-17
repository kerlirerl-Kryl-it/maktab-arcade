// ============================================================
//  js/levels/index.js
//  Assemble tous les fichiers de niveaux en un seul tableau.
//
//  Pour ajouter des niveaux 51-60 plus tard :
//    1. Crée le fichier js/levels/levels-51-60.js
//    2. Ajoute <script src="./js/levels/levels-51-60.js"> dans index.html AVANT ce fichier
//    3. Ajoute ...LEVELS_51_60 dans le tableau ci-dessous
// ============================================================

const LEVELS = [
    ...LEVELS_01_10,
    ...LEVELS_11_20,
    ...LEVELS_21_30,
    ...LEVELS_31_40,
    ...LEVELS_41_50
    // ...LEVELS_51_60,   ← décommenter quand tu ajouteras des niveaux
    // ...LEVELS_61_70,
];

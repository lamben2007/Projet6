const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

/**
 * @function upload
 * @description Middleware de gestion de l'upload d'image avec Multer.
 */
const upload = multer({
    storage: storage, // Définit l'endroit et la manière dont les fichiers seront stockés
    limits: { fileSize: 1 * 1024 * 1024 }, // Limite la taille du fichier à 1 Mo (1 * 1024 * 1024 octets)
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) { // Vérifie si le fichier est une image en analysant son type MIME
            return cb(new Error('Seuls les fichiers image sont autorisés !'), false); // Rejette le fichier s'il ne s'agit pas d'une image
        }
        cb(null, true); // Accepte le fichier si c'est une image
    }
}).single('image'); // Accepte un seul fichier avec le champ 'image' dans la requête


/**
 * @function processImage
 * @description Middleware pour traiter une image uploadée
 * @param {Object} req - Objet de requête Express contenant le fichier uploadé
 * @param {Object} res - Objet de réponse Express pour renvoyer une erreur en cas d'échec
 * @param {Function} next - Fonction middleware suivante à appeler
 * @returns {void} - Passe au middleware suivant ou renvoie une erreur
 */
const processImage = async (req, res, next) => {

    // SI fichier image non spécifié
    if (!req.file) {
        next(); // Aller à la fonction middleware suivante
    }
    // SINON (si fichier spécifié)
    else {

        try {
            // Définition du fichier image avec son chemin
            const filename = `image-${Date.now()}.webp`;
            const outputPath = path.join('images', filename);

            // Créer le dossier "images" s'il n'existe pas
            if (!fs.existsSync(path.join('images'))) {
                fs.mkdirSync(path.join('images'), { recursive: true });
            }

            // Traitement de l'image avec Sharp
            await sharp(req.file.buffer)
                .webp({ quality: 80 })
                .resize(450) // Redimensionne à la largeur à 450px
                .toFormat('webp') // Convertit en WebP
                .toFile(outputPath); // Définition fichier image

            // Définition du fichier image (avec et sans chemin)
            req.file.filename = filename;
            req.file.path = outputPath;

            // Aller à la fonction middleware suivante
            next();
        }
        // Gestion des erreurs
        catch (error) {
            // Renvoie une erreur 500 'Erreur lors du traitement de l'image
            return res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
        }

    }
};

module.exports = { upload, processImage };
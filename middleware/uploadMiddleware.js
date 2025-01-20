const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

//
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 Mo
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Seuls les fichiers image sont autorisés !'), false);
        }
        cb(null, true);
    }
}).single('image'); // 'image' est le champ attendu dans la requête


//
const processImage = async (req, res, next) => {
    if (!req.file) {
        // return res.status(400).json({ error: 'Aucun fichier téléchargé' });
        // console.log("Aucun fichier téléchargé'");
        next(); // BLA : est-ce correct ?
        return; // BLA : est-ce correct ?
    }

    try {
        const filename = `image-${Date.now()}.webp`;
        const outputPath = path.join('images', filename);

        // Vérifier que le dossier existe
        if (!fs.existsSync(path.join('images'))) {
            fs.mkdirSync(path.join('images'), { recursive: true });
            // console.log("répertoire image a été créé");
        }
        // else
        //     console.log("répertoire image existe");

        // Traitement avec Sharp
        await sharp(req.file.buffer)
            // .webp({ quality: 20 })
            // .resize(800, 600, { fit: 'inside' }) // Redimensionne à 800x600 max
            .toFormat('webp') // Convertit en WebP
            .toFile(outputPath);

        req.file.filename = filename;
        req.file.path = outputPath;

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
    }
};

module.exports = { upload, processImage };

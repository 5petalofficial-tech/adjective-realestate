const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Anchor to this file's directory (adjective-backend/src/utils/) so the upload
// destination is always adjective-backend/uploads/dealer regardless of the
// working directory from which the Node process was started (e.g. monorepo root).
const baseDir = path.join(__dirname, '..', '..', 'uploads', 'dealer');
const bannerDir = path.join(baseDir, 'banner');
const brochureDir = path.join(baseDir, 'brochure');
const galleryDir = path.join(baseDir, 'galleries');

const directories = [bannerDir, brochureDir, galleryDir];

directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'bannerImage') {
            cb(null, bannerDir);
        } else if (file.fieldname === 'brochureUrl') {
            cb(null, brochureDir);
        } else if (file.fieldname === 'projectGallery') {
            cb(null, galleryDir);
        } else {
            cb(null, baseDir);
        }
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Anchor to this file's directory (adjective-backend/src/utils/) so the upload
// destination is always adjective-backend/uploads/solo regardless of the
// working directory from which the Node process was started (e.g. monorepo root).
const soloDir = path.join(__dirname, '..', '..', 'uploads', 'solo');
if (!fs.existsSync(soloDir)) {
    fs.mkdirSync(soloDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, soloDir); 
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extension);
    }
});

const upload = multer({ storage: storage });
module.exports = upload;

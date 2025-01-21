const util = require('util');
const multer = require('multer');
const sharp = require('sharp');

const maxSize = 1 * 1000 * 1000;

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

let uploadFile = multer({
    storage: storage,
}).single('file')


let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
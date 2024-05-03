const multer = require('multer');
const path = require('path');

const filename = (req, file, callback) => {
    const fileName = Date.now() + path.extname(file.originalname);
    callback(null, fileName);
};

const generateStorage = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, destination);
        },
        filename
    });
};

const generateFileFilter = (mimetypes) => {
    return (req, file, callback) => {
        if (mimetypes.includes(file.mimetype)){
            callback(null, true);
        }else{
            let err = new Error(`Only ${mimetypes} are allowed to upload!`);
            callback(err, false);
        }
    };
};

module.exports = {
    imageStorage: multer({
        storage: generateStorage('./public/images'),
        fileFilter: generateFileFilter([
            'image/png',
            'image/jpg',
            'image/jpeg'
        ]),
        onError: (err, next) => {
            next(err);
        }
    }),

    image: multer({
        storage: generateStorage('./public/images'),
        fileFilter: (req, file, callback) => {
            const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];

            if (allowedMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
                callback(err, false);
            }
        },
        onError: (err, next) => {
            next(err);
        }
    }),
};
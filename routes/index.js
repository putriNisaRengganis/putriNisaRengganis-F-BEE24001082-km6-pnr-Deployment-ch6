var express = require('express');
var router = express.Router();
const { imageStorage, image } = require('../libs/multer');

router.post('/upload/image', imageStorage.single('image'), (req, res) => {
    let imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    res.json({ image_url: imageUrl });
});
router.post('/upload/images', imageStorage.array('image'), (req, res) => {
    let imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/images/${file.filename}`);
    res.json({ image_urls: imageUrls });
});


const { imageKitUpload, generateQR } = require('../controllers/media.controllers');
router.post('/imagekit/upload/image', image.single('file'), imageKitUpload);


router.post('/qr/generate', generateQR);

module.exports = router;

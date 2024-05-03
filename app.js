const express = require('express');
const { imageKitUpload, saveImage, getImages, getDetailImages, deleteImages, updateImages } = require('./controllers/media.controllers');
const { register } = require('./controllers/auth.controllers');
const multer = require('multer')();
const app = express();
app.use(express.json());

app.post('/register', register);

app.post('/upload', multer.single('image'), imageKitUpload);

app.post('/images', saveImage);
app.get('/images', getImages);
app.get('/images/:id', getDetailImages);
app.delete('/images/:id', deleteImages);
app.put('/images/:id', updateImages);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
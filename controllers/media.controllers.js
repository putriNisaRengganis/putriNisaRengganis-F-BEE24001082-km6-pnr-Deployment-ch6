const imagekit = require('../libs/imagekit');
const path = require('path');
const qr = require('qr-image');
const prisma = require('../config/db');

module.exports = {
    imageKitUpload: async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: false,
                    message: 'File is required',
                    data: null
                });
            }
            
            let strFile = req.file.buffer.toString('base64');

            let { url } = await imagekit.upload({
                fileName: Date.now() + path.extname(req.file.originalname),
                file: strFile
            });

            res.json({
                status: true,
                message: 'OK',
                data: url
            });
        } catch (error) {
            next(error);
        }
    },

    generateQR: async (req, res, next) => {
        try {
            let { qr_data } = req.body;
            if (!qr_data) {
                return res.status(400).json({
                    status: false,
                    message: 'qr_data is required',
                    data: null
                });
            }
            let qrCode = qr.imageSync(qr_data, { type: 'png' });

            let { url } = await imagekit.upload({
                fileName: Date.now() + '.png',
                file: qrCode.toString('base64')
            });

            res.json({
                status: true,
                message: 'OK',
                data: url
            });
        } catch (error) {
            next(error);
        }
    },

    saveImage: async (req, res) => {
        
        try{
            const { title, description, image_url, user_id } = req.body;
    
            if (!title || !description || !image_url || !user_id) {
                return res.status(400).json({
                    status: false,
                    message: 'All fields are required',
                    data: null
                });
            }
    
            const image = await prisma.images.create({
                data: {
                    title,
                    description,
                    image_url,
                    user_id
                }
            });
    
            res.json({
                status: true,
                message: 'Image saved',
                data: image
            });
        }catch(error){
            res.status(500).json({
                status: false,
                message: error.message,
                data: null
            });
        }
    },

    getImages: async (req, res) => {
        try {
            const images = await prisma.images.findMany();
            res.json({
                status: true,
                message: 'OK',
                data: images
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
                data: null
            });
        }
    },

    getDetailImages: async (req, res) => {
        try {
            const { id } = req.params;
            const image = await prisma.images.findUnique({
                where: {
                    id: parseInt(id)
                },
                include: {
                    user: true
                }
            });

            if (!image) {
                return res.status(404).json({
                    status: false,
                    message: 'Image not found',
                    data: null
                });
            }

            res.json({
                status: true,
                message: 'OK',
                data: image
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
                data: null
            });
        }
    },

    deleteImages: async (req, res) => {
        try {
            const { id } = req.params;
            const imageData = await prisma.images.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if(!imageData){
                return res.status(404).json({
                    status: false,
                    message: 'Image not found',
                    data: null
                });
            }

            const image = await prisma.images.delete({
                where: {
                    id: parseInt(id)
                }
            });

            res.json({
                status: true,
                message: 'OK',
                data: image
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
                data: null
            });
        }
    },

    updateImages: async (req, res) => {
        try {
            const { id } = req.params;
            const imageData = await prisma.images.findUnique({
                where: {
                    id: parseInt(id)
                }
            });

            if(!imageData){
                return res.status(404).json({
                    status: false,
                    message: 'Image not found',
                    data: null
                });
            }
            
            const { title, description, image_url, user_id } = req.body;
            const image = await prisma.images.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    title,
                    description,
                    image_url,
                    user_id
                }
            });

            if (!image) {
                return res.status(404).json({
                    status: false,
                    message: 'Image not found',
                    data: null
                });
            }

            res.json({
                status: true,
                message: 'OK',
                data: image
            });
        } catch (error) {
            res.status(500).json({
                status: false,
                message: error.message,
                data: null
            });
        }
    }
};

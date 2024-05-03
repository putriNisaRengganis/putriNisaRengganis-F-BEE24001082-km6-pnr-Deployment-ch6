const prisma = require('../config/db');
const crypto = require('crypto');
module.exports = {
    register: async (req, res) => {
        try {

            const { name, email, password } = req.body;

            if(name == null || email == null || password == null){
                return res.status(400).json({
                    status: false,
                    message: 'All fields are required',
                    data: null
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    status: false,
                    message: 'Invalid email format',
                    data: null
                });
            }

            //hash password using bycrpt
            const hash = crypto.createHash('sha1');
            const passwordHash = hash.update(password).digest('hex');

            const user = await prisma.users.create({
                data: {
                    name,
                    email,
                    password: passwordHash
                }
            });

            return res.status(201).json({
                status: true,
                message: 'User created',
                data: user
            });



        } catch (error) {
            return res.status(500).json({
                status: false,
                message: error.message,
                data: null
            });
        }
    },

    login: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },

    whoami: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    }
};
const express = require('express');
const router = express.Router();
const { check, valudationResult, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

router.get('/test', (req, res) => {
    res.send('User Route');
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        let user = await User.findOne({ id }).select('-password');

        if(!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: "해당하는 유저가 존재하지 않습니다." }] })
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res
            .status(500)
            .send('Server Error');
    }
});

router.post(
    '/',
    [
        check('id', 'ERR_ID')
            .not()
            .isEmpty(),
        check('password', 'ERR_PASSWORD')
            .isLength({ min: 6, max: 15 }),
        check('name', 'ERR_NAME')
            .isLength({ min: 2, max: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res
                .status(210)
                .json({ errors: errors.array() });
        }

        const { id, password, name } = req.body;
        const token = '';

        try {
            let user = await User.findOne({ id });

            if(user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "ERR_ID_EXIST" }] })
            }

            user = new User({
                id,
                password,
                name,
                token
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            await user.save();

            res
                .send({ "success" : true });
        } catch (err) {
            console.error(err.message);
            res
                .status(500)
                .send('Server Error');
        }
    });

    router.post(
        '/token',
        [
            check('token', 'token값이 입력되지 않았습니다.')
                .not()
                .isEmpty()
        ],
        async (req, res) => {
            const errors = validationResult(req);
    
            if(!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ errors: errors.array() });
            }
    
            const { id, token } = req.body;
    
            try {
                let user = await User.findOne({ id });
    
                if(!user) {
                    return res
                        .status(400)
                        .json({ errors: [{ msg: "해당하는 유저가 없습니다." }] })
                }
    
                user.token = token;
    
                await user.save();
    
                res
                    .send({ "success" : true });
            } catch (err) {
                console.error(err.message);
                res
                    .status(500)
                    .send('Server Error');
            }
        });

module.exports = router;
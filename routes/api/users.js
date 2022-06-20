const express = require('express');
const router = express.Router();
const { check, valudationResult, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

router.get('/test', (req, res) => {
    res.send('User Route');
});

router.post(
    '/',
    [
        check('id', 'ID가 입력되지 않았습니다.')
            .not()
            .isEmpty(),
        check('password', '비밀번호는 6자 이상 15자 이하로 입력해주세요.')
            .isLength({ min: 6, max: 15 }),
        check('name', '이름은 2자 이상 8자 이하로 입력해주세요.')
            .isLength({ min: 2, max: 8 })
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res
                .status(400)
                .json({ errors: errors.array() });
        }

        const { id, password, name, token } = req.body;

        try {
            let user = await User.findOne({ id });

            if(user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "해당하는 ID가 이미 존재합니다." }] })
            }

            user = new User({
                id,
                password,
                name,
                token
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            
            user.save();

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
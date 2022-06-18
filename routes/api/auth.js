const express = require('express');
const router = express.Router();
const { check, valudationResult, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

router.get('/test', (req, res) => {
    res.send('Auth Route');
});

router.post(
    '/',
    [
        check('id', 'ID가 입력되지 않았습니다.').exists(),
        check('password', '비밀번호가 입력되지 않았습니다.').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id, password } = req.body;

        try {
            let user = await User.findOne({ id });

            if(!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "올바르지 않은 ID 혹은 비밀번호입니다." }] });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: "올바르지 않은 ID 혹은 비밀번호입니다." }] })
            }

            res.send({ "success" : true });
        } catch (err) {
            console.error(err.message);
            res
                .status(500)
                .send('Server Error');
        }
    });

module.exports = router;
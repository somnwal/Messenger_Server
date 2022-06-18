const express = require('express');
const router = express.Router();
const { check, valudationResult, validationResult } = require('express-validator');

const Message = require('../../models/Message');
const User = require('../../models/User');

router.get('/test', (req, res) => {
    res.send('Message Route');
});

router.post('/send', async (req, res) => {

    try {
        const { from_user, to_user } = req.body

        const from_user_obj = await User.findOne({ id: from_user }).select('-password');
        const to_user_obj = await User.findOne({ id: to_user }).select('-password');

        const newMessage = new Message({
            from_user: from_user_obj._id,
            to_user: to_user_obj._id,
            msg: req.body.msg
        });

        const message = await newMessage.save();

        res.json(message);
    } catch (err) {
        console.error(err.message);
            res
                .status(500)
                .send('Server Error');
    }
    
});

module.exports = router;
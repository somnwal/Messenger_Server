const express = require('express');
const router = express.Router();
const { check, valudationResult, validationResult } = require('express-validator');

const Message = require('../../models/Message');
const ChatRoom = require('../../models/ChatRoom');

router.get('/test', (req, res) => {
    res.send('Message Route');
});

// 유저간 대화한 내용 가져오기
router.get('/all', async (req, res) => {
    try {
        const { from_user, to_user } = req.body

        const list = await Message
            .find()
            .or([{ from_user: from_user }, { from_user: to_user }])
            .sort({ date: 1 });

        res.json(list);
    } catch (err) {
        console.error(err.message);
            res
                .status(500)
                .send('Server Error');
    }
});

// 해당 유저가 참여한 방 가져오기
router.get('/rooms', async (req, res) => {
    try {
        const { from_user } = req.body

        const list = await ChatRoom
            .find({ from_user: from_user })
            .sort({ date: 1 })

        res.json(list);
    } catch (err) {
        console.error(err.message);
            res
                .status(500)
                .send('Server Error');
    }
});

// 메시지 보내기
router.post('/send', async (req, res) => {

    try {
        const { from_user, to_user } = req.body
        const date = Date.now()

        var chatRoom_from = await ChatRoom
            .findOne({ from_user: from_user, to_user: to_user});

        var chatRoom_to = await ChatRoom
            .findOne({ from_user: to_user, to_user: from_user});

        if(!chatRoom_from) {
            chatRoom_from = new ChatRoom({
                from_user: from_user,
                to_user: to_user
            });
        }

        if(!chatRoom_to) {
            chatRoom_to = new ChatRoom({
                from_user: to_user,
                to_user: from_user
            });
        }

        chatRoom_from.date = date
        chatRoom_to.date = date

        const newMessage = new Message({
            from_user: from_user,
            to_user: to_user,
            msg: req.body.msg,
            date: date
        });

        const message = await newMessage.save();
        await chatRoom_from.save();
        await chatRoom_to.save();

        res.json(message);
    } catch (err) {
        console.error(err.message);
            res
                .status(500)
                .send('Server Error');
    }
    
});

module.exports = router;
const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true
    },
    to_user: {
        type: String,
        required: true
    },
    from_user_name: {
        type: String,
        required: true
    },
    to_user_name: {
        type: String,
        required: true
    },
    last_message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = ChatRoom = mongoose.model('chatrooms', ChatRoomSchema);
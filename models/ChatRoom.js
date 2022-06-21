const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
    from_user: {
        type: String,
        required: true
    },
    to_user: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = ChatRoom = mongoose.model('chatrooms', ChatRoomSchema);
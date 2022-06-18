const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    from_user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    to_user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    msg: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Message = mongoose.model('messages', MessageSchema);
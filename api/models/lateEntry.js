const mongoose = require('mongoose');

const lateEntryMsg = mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    header: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('LateEntryMsg', lateEntryMsg, 'late_entry_msg');
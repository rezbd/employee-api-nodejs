const mongoose = require('mongoose');

const workingTime = mongoose.Schema({
    employee_id: {
        type: String,
        required: true
    },
    employee_email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    total_working_time: {
        type: String
    },
    emp_activity: [{
        _id: false,
        start: String,
        end: String
    }]
}, { timestamps: true });


module.exports = mongoose.model('WorkingTime', workingTime, 'working_time');
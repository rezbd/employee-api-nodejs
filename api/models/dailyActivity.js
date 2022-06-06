const mongoose = require('mongoose');
const { Schema } = mongoose;

const dailyEmployeeActivity = mongoose.Schema({
    employee_id: {
        type: String,
        required: true
    },
    employee_name: {
        type: String,
        required: false
    },
    employee_email: {
        type: String,
        required: false
    },
    date: {
        type: String,
        required: true
    },
    check_in_time: {
        type: String,
        required: false
    },
    check_out_time: {
        type: String,
        required: false
    },
    lunch_break_start: {
        type: String,
        required: false
    },
    lunch_break_end: {
        type: String,
        required: false
    },
    tea_break_start: {
        type: String,
        required: false
    },
    tea_break_end: {
        type: String,
        required: false
    }
    ,
    total_actual_work_time: {
        type: String,
        required: true
    },
    total_break_time: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('DailyEmployeeActivity', dailyEmployeeActivity, 'daily_employee_activity');
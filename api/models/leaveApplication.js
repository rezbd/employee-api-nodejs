const mongoose = require('mongoose');

const leaveApplication = mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    fromDate: {
        type: String,
        required: true
    },
    toDate: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    applicationStatus: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('LeaveApplication', leaveApplication, 'leave_application');
const mongoose = require('mongoose');

const leaveApplication = mongoose.Schema({
    employeeId: {
        type: String,
        required: false
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
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'pending'
    }
}, { timestamps: true })

module.exports = mongoose.model('LeaveApplication', leaveApplication, 'leave_application');
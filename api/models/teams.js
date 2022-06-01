const mongoose = require('mongoose');
const { Schema } = mongoose;

const employeeTeams = mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamMembers: [{
        _id: false,
        emp_id: {
            type: String,
            ref: 'Employee'
        },
        name: {
            type: String,
            ref: 'Employee'
        },
        email: {
            type: String,
            ref: 'Employee'
        },
        designation: {
            type: String,
            ref: 'Employee'
        }
    }]
}, { timestamps: true });


module.exports = mongoose.model('Teams', employeeTeams, 'employee_teams');
const mongoose = require('mongoose');

const employeeTeams = mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamMembers: [{
        _id: {
            type: String,
            ref: 'Employee'
        },
        email: {
            type: String,
            ref: 'Employee'
        },
    }]
});


module.exports = mongoose.model('Teams', employeeTeams, 'employee_teams');
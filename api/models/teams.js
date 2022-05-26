const mongoose = require('mongoose');

const employeeTeams = mongoose.Schema({
    teamName: {
        type: String,
        required: true
    },
    teamMembers: {
        type: Array,
    }
});


module.exports = mongoose.exports('Teams', employeeTeams, 'employee_teams');
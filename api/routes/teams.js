const express = require('express');
const router = express.Router();
const Teams = require('../models/teams');
const verifyLogin = require('../middlewares/jwtAuth');
const verifyAdmin = require('../middlewares/verifyAdmin');
const mongoose = require('mongoose');

// router for getting all teams
router.get('/all', async (req, res, next) => {
    try {
        const result = await Teams.find();
        if (result) {
            res.status(200).json({
                action: 'Read',
                success: true,
                msg: 'Content read successfully',
                body: result
            })
        } else {
            res.status(204).json({
                success: true,
                msg: "No content found",
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'read',
            success: false,
            msg: 'Read Failed',
            body: err
        })
    }

})

// router for getting a team by id
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Teams.findById(id);
        if (result) {
            res.status(200).json({
                action: 'Read',
                success: true,
                msg: 'Content read successfully',
                body: result
            })
        } else {
            res.status(204).json({
                success: true,
                msg: "No content found",
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'read',
            success: false,
            msg: 'Read Failed',
            body: err
        })
    }
})


// router for creating a team
router.post('/', async (req, res, next) => {
    try {
        const team = new Teams({
            teamName: req.body.teamName,
            teamMembers: req.body.teamMembers
        })
        if(team){
            const result = await team.save();
            res.status(201).json({
                action: 'Create',
                success: true,
                msg: 'Created Successfully',
                body: result
            });
        } else {
            res.status(400).json({
                action: 'Create',
                success: false,
                msg: 'Bad Request',
                body: {}
            });
        }
    } catch (err) {
        res.status(500).json({
            action: 'create',
            success: false,
            msg: 'Create Failed',
            body: err
        })
    }
})


// router to add a member to a team or edit a team
router.patch('/:id', async (req, res, next) => {
    const id = req.params.id;
    const member = {
        emp_id : req.body.emp_id,
        name : req.body.name,
        email : req.body.email,
        designation : req.body.designation
    }
    const team = req.body;

    let output
    if(!member.emp_id){
        output = {
            $set: {
                teamName: team.teamName
            }
        }
    } else {
        output = {
            $addToSet: {
                teamMembers: member
            }
        }
    }

    try {
        const result = await Teams.updateOne(
            {_id: mongoose.Types.ObjectId(id)},
            output
        );
        if (result) {
            res.status(200).json({
                action: 'Update',
                success: true,
                msg: 'Updated Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Update',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Update',
            success: false,
            msg: 'Update Failed',
            Error: err
        })
    }
})


// query to change only designation of any of teamMembers
router.patch('/des/:teamId/:empId', async (req, res, next) => {
    const teamId = req.params.teamId;
    const empId = req.params.empId;
    const designation = req.body.designation;

    try {
        const result = await Teams.updateOne(
            {_id: mongoose.Types.ObjectId(teamId), "teamMembers.emp_id": empId},
            {$set: {
                "teamMembers.$.designation": designation
            }}
        );
        if (result) {
            res.status(200).json({
                action: 'Update',
                success: true,
                msg: 'Updated Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Update',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Update',
            success: false,
            msg: 'Update Failed',
            Error: err
        })
    }
})


// query to change designation of all teamMembers
router.patch('/desig/:teamId', async (req, res, next) => {
    const teamId = req.params.teamId;
    const designation = req.body.designation;

    try {
        const result = await Teams.updateOne(
            {_id: mongoose.Types.ObjectId(teamId)},
            {
                $set: {
                "teamMembers.$[].designation": designation
                }
            }
        );
        if (result) {
            res.status(200).json({
                action: 'Update',
                success: true,
                msg: 'Updated Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Update',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Update',
            success: false,
            msg: 'Update Failed',
            Error: err
        })
    }
})


// router to delete a team
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Teams.deleteOne({_id: mongoose.Types.ObjectId(id)});
        if (result) {
            res.status(200).json({
                action: 'Delete',
                success: true,
                msg: 'Deleted Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Delete',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Delete',
            success: false,
            msg: 'Delete Failed',
            Error: err
        })
    }
})

// router for removing a member from a team
router.patch('/remove/:id', async (req, res, next) => {
    const id = req.params.id;
    const member = req.body;
    try {
        const result = await Teams.updateOne(
            {_id: mongoose.Types.ObjectId(id)},
            {
                $pull: {
                    teamMembers:  member
                }
            }
        );
        if (result) {
            res.status(200).json({
                action: 'Update',
                success: true,
                msg: 'Updated Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Update',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Update',
            success: false,
            msg: 'Update Failed',
            Error: err
        })
    }
})


// router for deleting a team
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Teams.findOneAndDelete(
            {_id: id}
        );
        if (result) {
            res.status(200).json({
                action: 'Delete',
                success: true,
                msg: 'Deleted Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Delete',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Delete',
            success: false,
            msg: 'Delete Failed',
            Error: err
        })
    }
})


// show all team member info from employee-info collection
router.get('/members/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await Teams.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(id)
                }
            },
            {
                $unwind: "$teamMembers"
            },
            {
                $lookup: {
                    from: 'employee-info',
                    localField: 'teamMembers.emp_id',
                    foreignField: 'userID',
                    as: 'employeeDetails'
                }
            },
            {
                $unwind: '$employeeDetails'
            },
            {
                $group: {
                    _id: "$employeeDetails.userID",
                    teamName: {$first: "$teamName"},
                    employeeID: {$first: "$employeeDetails.userID"},
                    name: {$first: "$employeeDetails.name"},
                    email: {$first: "$employeeDetails.email"},
                    mobile: {$first: "$employeeDetails.mobile"},
                    designation: {$first: "$employeeDetails.designation"},
                    location: {$first: "$employeeDetails.location"}
                }
            }
        ]);
        if (result) {
            res.status(200).json({
                action: 'Read',
                success: true,
                msg: 'Read Successfully',
                body: result
            })
        } else {
            res.status(204).json({
                action: 'Read',
                success: false,
                msg: 'No content found',
                body: {}
            })
        }
    } catch (err) {
        res.status(500).json({
            action: 'Read',
            success: false,
            msg: 'Read Failed',
            Error: err
        })
    }
})


module.exports = router;
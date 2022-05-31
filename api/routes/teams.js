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
            teamMembers: req.body.teamMembers,
            teamLeader: req.body.teamLeader
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


// router to add a member to a team
router.patch('/:id', async (req, res, next) => {
    const id = req.params.id;
    const member = req.body;
    try {
        const result = await Teams.updateOne(
            {_id: mongoose.Types.ObjectId(id)},
            {
                $addToSet: {
                    teamMembers: member,
                }
            }
        );
        console.log(result);
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


module.exports = router;
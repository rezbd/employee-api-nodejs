const express = require('express');
const router = express.Router();
const Teams = require('../models/teams');
const verifyLogin = require('../middlewares/jwtAuth');
const verifyAdmin = require('../middlewares/verifyAdmin');

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
module.exports = router;
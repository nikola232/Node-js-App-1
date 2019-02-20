const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Load Helper
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');
// End Idea Model

/********************** ROUTES **************************/
// Idea Index Page
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        })
});

// Add Idea Form
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('ideas/add')
});

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                })
            }
        });
});

// Process Form
router.post('/', ensureAuthenticated, function (req, res) {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Title can not be empty' })
    }

    if (!req.body.details) {
        errors.push({ text: 'Details can not be empty' })
    }

    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }

    else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea addeds');
                res.redirect('/ideas');
            })
    }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            req.flash('success_msg', 'Video idea edited');
            // new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/ideas');
                });
        })
})


// Delete Idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Video idea removed');
            res.redirect('/ideas');
        })
});
/********************** End of ROUTES **************************/

module.exports = router;
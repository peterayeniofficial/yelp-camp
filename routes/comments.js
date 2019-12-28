const express = require('express')
const router = express.Router({mergeParams: true})
const Campground = require("../models/campgrounds")
const Comment = require("../models/comments")
const middleware = require("../middleware")

// comments
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/create", {campground: campground})
        }
    })
})

router.post('/', middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err){
                    console.log(err)
                }else {
                    // add username and id to comment
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    // save comment
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
        }
    })
})


module.exports = router
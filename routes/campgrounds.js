const express = require('express')
const router = express.Router()
const Campground = require("../models/campgrounds")
const middleware = require("../middleware")

router.get('/', (req, res) => {

    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds/campgrounds', {campgrounds: allCampgrounds, currentUser: req.user})
        }
    })
})

router.post('/', middleware.isLoggedIn, (req, res) => {

    // get data from form and add to campgrounds array
    let name = req.body.name 
    let image = req.body.image
    let description = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: description, author: author}
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err)
        }else {
            console.log("New Camp Added to DB")
            console.log(newlyCreated)
            // redirect to campgrounds
            res.redirect('campgrounds')
        }
    })
})

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/create')
})

router.get("/:id", (req, res) =>{
    //find the campground with provided ID
    showId = req.params.id
    Campground.findById(showId).populate("comments").exec((err, campground) => {
        if(err){
            console.log(err)
        }else {
            res.render("campgrounds/campground", {campground: campground})

        }
    }) 
})


// edit
router.get("/:id/edit", middleware.checkCampGroundOwnership, (req, res) => {

    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

// update
router.put("/:id", middleware.checkCampGroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
        if(err) {
            res.redirect("/campgrounds")
        }else {
            res.redirect("/campgrounds" + req.params.id)
        }
    })
})

// destroy campground world
router.delete("/:id", middleware.checkCampGroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds")
        }
    })
})



module.exports = router
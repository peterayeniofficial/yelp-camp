const express = require('express')
const router = express.Router()
const Campground = require("../models/campgrounds")

router.get('/', (req, res) => {

    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds/campgrounds', {campgrounds: allCampgrounds, currentUser: req.user})
        }
    })
})

router.post('/', (req, res) => {

    // get date from form and add to campgrounds array
    let name = req.body.name 
    let image = req.body.image
    let description = req.body.description
    let newCampground = {name: name, image: image, description: description}
    Campground.create(newCampground, (err, newlyCreated) => {
        if(err){
            console.log(err)
        }else {
            console.log("New Camp Added to DB")
            console.log(newlyCreated)
            // redirect to campgrounds
            res.redirect('campgrounds/campgrounds')
        }
    })
})

router.get('/new', (req, res) => {
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

module.exports = router
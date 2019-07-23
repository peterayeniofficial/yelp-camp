const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const seedDb = require("./seeds")
const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")

mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

//seedDb()
/* // Create new Camp Ground
Campground.create({
    name: "Waley Camp",
    image: "https://s3.amazonaws.com/imagescloud/images/medias/camping/MathieuDupuis-23.jpg",
    description: "Tent Camping - Find Your Campground in Quebec - Sepaq"
}, (err, newCamp) => {
    if(err){
        console.log(err)
    }else {
        console.log(newCamp)
    }
}) */

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds/campgrounds', {campgrounds: allCampgrounds})
        }
    })
})

app.post('/campgrounds', (req, res) => {

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

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/create')
})

app.get("/campgrounds/:id", (req, res) =>{
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

// comments
app.get("/campgrounds/:id/comments/new", (req, res) => {
    // find campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            res.render("comments/create", {campground: campground})
        }
    })
})

app.post('/campgrounds/:id/comments', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err){
                    console.log(err)
                }else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect('/campgrounds/' + campground._id)
                }
            })
        }
    })
})

app.listen(9000, () => console.log("Yelp Camp Server Started"))
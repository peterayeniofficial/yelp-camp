const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const seedDb = require("./seeds")
const Campground = require("./models/campgrounds")

mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

seedDb()
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
            res.render('campgrounds', {campgrounds: allCampgrounds})
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
            res.redirect('/campgrounds')
        }
    })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('create')
})

app.get("/campgrounds/:id", (req, res) =>{
    //find the campground with provided ID
    showId = req.params.id
    Campground.findById(showId, (err, campground) => {
        if(err){
            console.log(err)
        }else {
            res.render("campground", {campground: campground})

        }
    }) 
})

app.listen(9000, () => console.log("Yelp Camp Server Started"))
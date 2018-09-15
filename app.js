const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/yelp_camp")
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))

// Schema Setup 
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

const Campground = mongoose.model("Campground", campgroundSchema)



app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err)
        } else{
            res.render('campgrounds', {campgrounds: campgrounds})
        }
    })
})

app.post('/campgrounds', (req, res) => {

    // get date from form and add to campgrounds array
    let name = req.body.name 
    let image = req.body.image
    let newCampground = {name: name, image: image}
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

app.get('/campgrounds/create', (req, res) => {
    res.render('create')
})

app.listen(9000, () => console.log("Yelp Camp Server Started"))
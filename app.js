const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require('passport')
LocalStrategy = require("passport-local")

const seedDb = require("./seeds")
const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")
const User = require("./models/user")

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true})
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

// Passport Configuration

app.use(require("express-session")({
    secret: "dndjhdhdhddiw93usnsjddhddd",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

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


// Register Routes

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err)
            return res.render("register")
        }

        passport.authenticate("local")(req, res, function() {
            res.redirect("/campgrounds")
        })


    })

})

// Login Route

app.get('/login', (req, res) => {
    res.render("login")
})

app.post('/login', passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), 
    (req, res) => {

})

app.listen(9000, () => console.log("Yelp Camp Server Started"))
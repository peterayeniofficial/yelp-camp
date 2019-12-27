const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require('passport')
LocalStrategy = require("passport-local")

const seedDb = require("./seeds")

const User = require("./models/user")

const commentRoutes = require("./routes/comments")
const campgroundRoutes = require("./routes/campgrounds")
const indexRoutes = require("./routes/index")


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

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    next()
})

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(9000, () => console.log("Yelp Camp Server Started"))
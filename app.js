const express = require('express')

const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const passport = require('passport')
const LocalStrategy = require("passport-local")
const methodOverride = require("method-override")
require('dotenv').config()
const seedDb = require("./seeds")

const User = require("./models/user")

const commentRoutes = require("./routes/comments")
const campgroundRoutes = require("./routes/campgrounds")
const indexRoutes = require("./routes/index")

const app = express()
const port = process.env.PORT || 5000

const uri = process.env.ATLAS_URI
mongoose.connect("mongodb+srv://peter:WAwUKm7wTaWMHzdN@sampledata-kxl6s.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })

const connection = mongoose.connection
connection.once('open', () => {
  console.log("MongoDB database connection Established")
})

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(methodOverride("_method"))
app.use(flash())

// seedDb()

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
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next()
})

app.use("/", indexRoutes)
app.use("/campgrounds", campgroundRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(port, () => console.log("Yelp Camp Server Started"))
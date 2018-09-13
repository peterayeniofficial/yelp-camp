const express = require('express')
const app = express()
const bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
const campgrounds = [
    {
        name: "Prince Camp",
        image: "https://castawaysontheriver.com/wp-content/uploads/2016/08/Castaways-Camping-1-8-26-16-.jpg"
    },
    {
        name: "Summer Camp",
        image: "http://www.travelbirbilling.com/wp-content/uploads/camp-pic1.jpg"
    },
    {
        name: "Kings Camp",
        image: "http://www.guntherpublications.com/core/wp-content/uploads/2018/01/manali-girls-special-adventure-camp-himachal-pradesh-1xJtgtx-1440x810.jpg"
    }
]

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
    
    res.render('campgrounds', {campgrounds: campgrounds})
})

app.post('/campgrounds', (req, res) => {

    // get date from form and add to campgrounds array
    let name = req.body.name 
    let image = req.body.image
    let newCampground = {name: name, image: image}
    campgrounds.push(newCampground)

    // redirect to campgrounds
    res.redirect('/campgrounds')
})

app.get('/campgrounds/create', (req, res) => {
    res.render('create')
})

app.listen(9000, () => console.log("Yelp Camp Server Started"))
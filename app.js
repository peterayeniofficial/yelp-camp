const express = require('express')
const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('landing')
})

app.get('/campgrounds', (req, res) => {
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
    res.render('campgrounds', {campgrounds: campgrounds})
})

app.listen(9000, () => console.log("Yelp Camp Server Started"))
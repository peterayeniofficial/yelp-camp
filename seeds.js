const mongoose = require("mongoose")
const Campground = require("./models/campgrounds")

const seedDb = () => {
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err)
        }
        console.log("remove campgrounds")
    })
}

module.exports = seedDb
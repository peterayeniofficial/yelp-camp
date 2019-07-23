const mongoose = require("mongoose")
const Campground = require("./models/campgrounds")
const Comment = require("./models/comments")

const data = [
    {
        name: "Little Farmers Camp",
        image: "https://www.crestfield.net/wp-content/uploads/2017/10/Little-Farmers-Camp-768x542.jpg",
        description: "Situated ten minutes from the airport in the area of Pittsburgh, Blue Ribbon Farms, Inc. or what is known as the Little Farmers Camp is another interesting summer camp of 2017."
    },
    {
        name: "Falcon Camp",
        image: "https://www.crestfield.net/wp-content/uploads/2017/10/Falcon-Camp-Canoe.png",
        description: "For those kids who are going to their first camp, Falcon Camp is one of the most interesting in 2017 for them. "
    },
    {
        name: "WPMS Camp",
        image: "https://www.crestfield.net/wp-content/uploads/2017/10/WPMS-Camp-Western-PA-Montessori-School.jpg",
        description: "This is made available for children aging two to six years old. The impressive thing about this summer camp is that it introduces your child to learn more facts and enjoy music, time, art, science and weekly surprises."
    }
]
const seedDb = () => {
    // remove camp grounds
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err)
        }
        console.log("remove campgrounds")
         // create camp ground
        data.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("Added a camp ground")
                    // create a comment
                    Comment.create({
                        text: "Cool place to be",
                        author: "Homer",

                    }, (err, comment) => {
                        if (err) {
                            console.log(err)
                        }else {
                            campground.comments.push(comment)
                            campground.save()
                            console.log("Comment added")
                        }
                    })
                }
            })
        })
    })
   
}

module.exports = seedDb
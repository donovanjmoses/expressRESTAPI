// Load modules
const express = require("express");
const Joi = require("joi"); //npm package for input validation
const { valid } = require("joi/lib/types/object");
const app = express();


//app.use() method uses argument in the processing of the HTTP request
app.use(express.json()); //express.json property returns middleware for HTTP requests.

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" }
];


// this function executes input validation using joi
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}



// route handlers
// use Postman to test HTTP requests for 200 status
// use npm joi for input validation
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.post("/api/courses", (req, res) => {
    //input validation
    const result = validateCourse(req.body);
    // if invalid, return 404 - bad request
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
    // look up course
    // if not found, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("The course was not found.");
        return;
    }
    // validate course
    const result = validateCourse(req.body);
    // if invalid, return 404 - bad request
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    };
    // return updated course
    course.name = req.body.name;
    res.send(course);
});

app.get("/api/courses/:id", (req, res) => { // :id is parameter to endpoint
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("The course was not found.");
    res.send(course);
});

app.get("/api/courses/:id", (req, res) => {
    res.send(req.query); // req.query property enables query strings. URL = localhost:5000/api/posts/2021/1?sortBy=name
});

app.delete("/api/courses/:id", (req, res) => {
    // Look up course
    // If not found, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("The course was not found.");
    // Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    // Return the same course
    res.send(course);
});

// environment variable - PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}...`) //dynamic variable ${port} is defined by hosting service at runtime
});
const express = require("express");
const app = express();

app.get("/", (req, res) => { // this callback is called "route handler" in node.js
    res.send("Hello World");
});
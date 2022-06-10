const express = require("express");
const bodyParse = require("body-parser");
let dotenv = require("dotenv")
dotenv.config()

// GET THE APP SERVERS PORT FROM ENV, FALLBACK ON PORT 8000 IF NOT CONFIGURED
const PORT = process.env.PORT // 8000;

let app = express();

app.use(bodyParse.json())

app.use(express.static("./static"))

// get the rou definitions
const todosRoutes = require("../routes/todosRoutes.js");
// tell the express app to use the routes
app.use(todosRoutes);

// start the  express app and log what port i am on
app.listen(PORT, function(){
    console.log("API server started on port ", PORT)
});
require("dotenv").config();
const express = require("express");
const morgan = require('morgan');
const body_parser = require("body-parser");
let authRouter = require('./Routers/AuthRouter');
const speakersRouter = require('./Routers/speakerRouter');
const studentsRouter = require('./Routers/studentRouter');
const eventsRouter = require('./Routers/eventsRouter');
const connectToDb = require("./config/db");
const path = require("path");

//create server
const app = express();

//use morgan
app.use(morgan(':method :url :status :http-version :response-time '));

// allow cross origin
app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    response.header("Access-Control-Allow-Headers", "Content-Type,Authorization")
    next();
})

//multer
// app.use(multer({ storage, limits }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")))
// body parser
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
// connectToDb();
(async () => {
    //connect DB
    await connectToDb();
    //run server
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`server running on ${port}`)
    });
})();


app.use(authRouter);
app.use("/speakers", speakersRouter);
app.use("/students", studentsRouter);
app.use("/events", eventsRouter);

//Not found MW
app.use((request, response) => {
    response.status(404).json({ data: "Not Found" });
})

//Error MW
app.use((error, request, response, next) => {
    let status = error.status || 500;
    response.status(status).json({ Error: `${error}` });
})

module.exports = app;
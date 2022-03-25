const jwt = require("jsonwebtoken");
const Events = require("../Models/eventSchema");
const { findById } = require("../Models/speakerSchema");
const { generateError } = require("./handleErrors");


exports.validateToken = (req, res, next) => {
    try {
        console.log('test');
        if (!req.headers.authorization) throw new Error('please login')
        const user = jwt.verify(
            req.headers.authorization.split(" ")[1],
            process.env.secret_key
        );
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}//validate token



exports.isAdmin = (req, res, next) => {
    console.log(req.user.role != "administrator");
    if (req.user.role != "administrator") {
        generateError(403, "Access Denied")
    }
    next();
}//admin permission

exports.accessPermissions = async (req, res, next) => {
    try {
        const id = req.params.valueOf().id;
        const event = await Events.findOne({ _id: id });
        if (!event) generateError(404, "Event Not Found")
        let role = "";
        console.log(req.user);
        if (req.user.role == "administrator") role = "admin";
        else if (req.user._id.valueOf() == event.mainSpeaker.valueOf()) role = "mainSpeaker";
        else if (event.speakers.find((i) => req.user._id.valueOf() == i.valueOf())) role = "speakers";
        else if (event.students.find((i) => req.user._id.valueOf() == i.valueOf())) role = "students";
        else role = false;
        req.role = role;
        req.event = event;
        next();
    } catch (error) {
        next(error)
    }
}//allow permission for speaker and student



exports.checkSpeaker = (req, res, next) => {
    const { id } = req.params;
    const speaker = {}
    if (!speaker) {
        throw new Error("Can't Find Any Speaker WIth Given Id");
    }
    req.id = id;
    next();
}

exports.checkStudent = (req, res, next) => {
    const { id } = req.params;
    const student = {}
    if (!student) {
        throw new Error("Can't Find Any student WIth Given Id");
    }
    req.id = id;
    next();
}

exports.checkEvent = (req, res, next) => {
    const { id } = req.params;
    const event = {}
    if (!event) {
        throw new Error("Can't Find Any Event WIth Given Id");
    }
    req.id = id;
    next();
}


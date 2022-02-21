const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const eventsSchema = new mongoose.Schema({
    _id: { type: Number },
    title: {
        type: String,
        trim: true,
        required: true,
        match: [/^[A-Za-z]+$/, "title must be string"],
        minLength: [3, "Minimum length is 3 characters"],
        maxLength: [20, "Maximum Length is 20 characters"]
    },
    mainSpeaker: {
        type: mongoose.Types.ObjectId,
        ref: "speakers",
    },
    speakers: [{
        type: mongoose.Types.ObjectId,
        ref: "speakers",
    }],
    students: [{
        type: Number,
        ref: "students"
    }],
    eventDate: {
        type: Date,
        required: true
    },
    askJoinStudent: [{
        type: Number,
        ref: "students"
    }],
    askJoinSpeaker: [{
        type: mongoose.Types.ObjectId,
        ref: "speakers",
    }],
    createAt: {
        type: Date,
        default: Date.now
    }
})
const connection = mongoose.createConnection("mongodb://localhost:27017/Podcast");
autoIncrement.initialize(connection);
eventsSchema.plugin(autoIncrement.plugin, { model: 'events', startAt: 1 })


const Events = mongoose.model("events", eventsSchema);
// const event = new Events();
// event.resetCount(function (err, nextCount) {

//     // nextCount === 100 -> true

// });


module.exports = Events;
const mongoose = require('mongoose');
const { userMethods } = require('./schemaMethods');
const autoIncrement = require('mongoose-auto-increment');

const studentSchema = new mongoose.Schema({
    _id: { type: Number },
    firstName: {
        type: String,
        trim: true,
        required: true,
        match: [/^[A-Za-z]+$/, "firstName must be string"],
        minLength: [3, "Minimum length is 3 characters"],
        maxLength: [20, "Maximum Length is 20 characters"]
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
        match: [/^[A-Za-z]+$/, "lastName must be string"],
        minLength: [3, "Minimum length is 3 characters"],
        maxLength: [20, "Maximum Length is 20 characters"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Your E-Mail is Required !!"],
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Email Syntax is wrong"],
        // unique: true,
    },
    passwordHash: {
        type: String
    },
    image: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false,
    }
})
userMethods(studentSchema);

const connection = mongoose.createConnection("mongodb://localhost:27017/Podcast");
autoIncrement.initialize(connection);
studentSchema.plugin(autoIncrement.plugin, { model: 'students', startAt: 1 })


const Student = mongoose.model("students", studentSchema);
// const student = new Student();
// student.resetCount(function (err, nextCount) {

//     // nextCount === 100 -> true

// });
module.exports = Student;
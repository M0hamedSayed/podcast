const mongoose = require('mongoose');
const { userMethods } = require('./schemaMethods');

const speakerSchema = new mongoose.Schema({
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
    address: {
        type: new mongoose.Schema({
            city: {
                type: String,
                required: true,
                trim: true
            },
            building: {
                type: Number,
                required: true,
                trim: true
            },
            street: {
                type: Number,
                required: true,
                trim: true
            }
        }), required: [true, "Your Address is Required and should be contain street,building,city !!"],
    },
    image: String,
    role: { type: String, default: 'speaker', enum: ['administrator', 'speaker'] },
    createAt: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false,
    }
})


userMethods(speakerSchema);

const Speaker = mongoose.model("speakers", speakerSchema);
module.exports = Speaker;
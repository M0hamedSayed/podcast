const { body, query, param } = require("express-validator");
const mongoose = require("mongoose");

exports.validationEvent = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage("Title can not be empty!!")
        .bail()
        .isString()
        .withMessage("Title should be string"),
    body('eventDate')
        .trim()
        .notEmpty()
        .withMessage("date can not be empty!!")
        .bail()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date!'),
    body('mainSpeaker')
        .trim()
        .notEmpty()
        .withMessage("speaker can not be empty!!")
        .bail()
        .isString()
        .withMessage("speaker should be string"),
    body('speakers')
        .isArray({ min: 1 })
        .withMessage("speakers Array can not be empty!!")
        .bail()
        .custom((data, { req }) => {
            let check = data.every(item => (mongoose.isValidObjectId(item) || (typeof item === "string" && !item.includes(null, undefined, ""))))
            if (!check)
                throw new Error('speaker should be string')
            return true;
        }),
    // body('speakers.*')
    //     .trim()
    //     .notEmpty()
    //     .withMessage("speaker can not be empty!!")
    //     .bail()
    //     .isString()
    //     .withMessage("speaker should be string"),
    body('students')
        .isArray({ min: 1 })
        .withMessage("students Array can not be empty!!"),
    body('students.*')
        .trim()
        .notEmpty()
        .withMessage("student can not be empty!!")
        .bail()
        .isString()
        .withMessage("student should be string")
]
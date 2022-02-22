const { body, query, param } = require("express-validator");
const Speaker = require("../Models/speakerSchema");
const Student = require("../Models/studentSchema");
exports.loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .bail()
        .isEmail()
        .withMessage('Invalid email address!')
        .custom(async (value, { req }) => {
            const { email } = req.body;
            const speaker = await Speaker.findOne({ email });
            const student = await Student.findOne({ email });
            if (!student && !speaker) { throw new Error('Invalid email'); }
            if (student) req.body.student = student;
            if (speaker) req.body.speaker = speaker;
            return true;
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("password can not be empty!!")
        .bail()
        .isLength({ min: 8 })
        .withMessage('Minimum 8 characters required for password!')
] // login validation

exports.emailValidation = [
    body('email')
        .trim()
        .notEmpty()
        .bail()
        .isEmail()
        .withMessage('Invalid email address!')
        .custom(async (value, { req }) => {
            const { email } = req.body;
            const speaker = await Speaker.findOne({ email });
            const student = await Student.findOne({ email });
            if (!student && !speaker) { throw new Error('Invalid email'); }
            if (student) req.body.student = student;
            if (speaker) req.body.speaker = speaker;
            return true;
        })
]//email validation

exports.registerValidation = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage("FullName can not be empty!!")
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for userName!')
        .bail()
        .isString()
        .withMessage("full name should be string"),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage("FullName can not be empty!!")
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required for userName!')
        .bail()
        .isString()
        .withMessage("full name should be string"),
    body('email')
        .trim()
        .notEmpty()
        .bail()
        .isEmail()
        .withMessage('Invalid email address!')
        .custom(async (value, { req }) => {
            const { email } = req.body;
            const speaker = await Speaker.findOne({ email });
            const student = await Student.findOne({ email });
            if (student || speaker) { throw new Error('email is already exists'); }
            return true;
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage("password can not be empty!!")
        .bail()
        .isLength({ min: 8 })
        .withMessage('Minimum 8 characters required for password!'),
    body('personType')
        .trim()
        .isIn(['student', 'speaker'])
        .withMessage('please , select speaker or student only'),
    body('address')
        .if(body('personType').equals('speaker'))
        .notEmpty()
        .withMessage('address should be contain street,building,city'),
    body('address.city')
        .if(body('personType').equals('speaker'))
        .trim()
        .notEmpty()
        .bail()
        .isAlphanumeric()
        .withMessage('city is required'),
    body('address.building')
        .if(body('personType').equals('speaker'))
        .trim()
        .notEmpty()
        .withMessage('building is required')
        .bail()
        .isInt()
        .withMessage('building should bt integer number'),
    body('address.street')
        .if(body('personType').equals('speaker'))
        .trim()
        .notEmpty()
        .withMessage('street is required')
        .bail()
        .isInt()
        .withMessage('street should bt integer number'),
    body('role')
        .if(body('personType').equals('speaker'))
        .trim()
        .isIn(['administrator', 'speaker'])
        .default('speaker')
]//registration validation
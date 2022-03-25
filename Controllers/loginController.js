const Speaker = require("../Models/speakerSchema");
const Student = require("../Models/studentSchema");
const jwt = require('jsonwebtoken');
const { generateError } = require("../middleware/handleErrors");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../middleware/emailTransporter");

exports.postLogin = async (req, res, next) => {
    try {
        const { speaker, student, password } = req.body;
        const user = student || speaker;
        if (!user.verified) {
            generateError(400, "Your account not verified , please verify it")
        }
        if (!(await user.comparePassword(password))) generateError(401, "Invalid Password")
        const token = jwt.sign(user.userData(), process.env.secret_key, { expiresIn: "1h" });
        res.status(201).json({ status: "login successful", data: user.userData(), token })

    } catch (error) {
        next(error)
    }
}

exports.me_get = async (req, res, next) => {
    try {
        const user = req.user;
        res.status(200).json({ data: user });
    } catch (error) {
        next(error);
    }
}//get me refer to JWT

let user = {};
exports.postRegister = async (req, res, next) => {
    try {
        //get data from body
        const { firstName, lastName, email, password, passwordConfirm, address, personType } = req.body;

        if (personType == 'speaker') {
            user = Speaker({
                firstName,
                lastName,
                email,
                password,
                address,
                passwordConfirm,
                image: ""
            });
        }
        else if (personType == 'student') {
            user = Student({
                firstName,
                lastName,
                email,
                password,
                passwordConfirm,
                image: ""
            });
        };

        //save data
        await user.save();
        req.user = user;
        next();
    } catch (error) {
        next(error)
    }
}//registration for speakers

exports.detectUserByEmail = async (req, res, next) => {
    try {
        const { speaker, student } = req.body;
        const user = student || speaker;
        req.user = user.userData();
        next();
    } catch (error) {
        next(error)
    }
}//detect user and save it in req

exports.sendVerificationEmail = async (req, res, next) => {
    try {
        const infoHash = {};
        const user = req.user;
        infoHash.user = user;
        infoHash.id = user._id;
        const key = eval(process.env.mail_key);
        const token = jwt.sign(infoHash, key, { expiresIn: "24h" });
        const message = `${process.env.BASE_URL}/user/verify/${user._id}/${token}`;
        await sendEmail(user.email, "Verify Email", message);
        res.status(201).json({ data: "Registration successful ,An Email sent to your account please verify", token });
    } catch (error) {
        next(error)
    }
}//send email verification

exports.sendResetPassword = async (req, res, next) => {
    try {
        const infoHash = {};
        const user = req.user;
        infoHash.user = user;
        infoHash.id = user._id;
        const key = eval(process.env.reset_key);
        const token = jwt.sign(infoHash, key, { expiresIn: "1h" });
        const message = `${process.env.BASE_URL}/password/reset/${user._id}/${token}`;
        await sendEmail(user.email, "Reset Password", message);
        res.status(201).json({ data: "password rest successful ,An Email sent to your account please verify", token });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.passVerify = async (req, res, next) => {
    try {
        const key = process.env.reset_key;
        const { password, passwordConfirm } = req.body;
        const user = await userVerify(req, key);
        if (await user.comparePassword(password)) generateError(403, "you already entered the old password ,please enter the new one or return to login page")
        user.changePassword = true;
        Object.assign(user,
            password && { password },
            password && { passwordConfirm },
        );
        await user.save();
        res.status(201).json({ status: "password changed successfully" })
    } catch (error) {
        next(error);
    }
}

exports.emailVerify = async (req, res, next) => {
    try {
        const key = process.env.mail_key;
        await userVerify(req, key);
        await user.update({ verified: true })
        res.status(200).json("mail verified success")
    } catch (error) {

        next(error)
    }
}//verify email on link sent




exports.saveProfile = async (req, res, next) => {
    try {
        const image = req.file;
        if (!image) {
            generateError(403, "No Image uploaded,please try again")
        }
        changeProfilePicture(req, res, image.filename, 201, "image loaded successfully")
    } catch (error) {
        next(error)
    }
}//save profile image


exports.deleteProfile = async (req, res, next) => {
    try {
        changeProfilePicture(req, res, "", 201, "image deleted successfully")
    } catch (error) {
        next(error)
    }
}//delete profile image

exports.changePassword = async (req, res, next) => {
    try {
        let user = req.user.role ? await Speaker.findById(req.user._id) : await Student.findById(req.user._id);
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (await user.comparePassword(oldPassword) && newPassword && confirmPassword) {
            if (oldPassword == newPassword) generateError(403, " please, change new password you enter old password again")
            user.changePassword = true;
            user.password = newPassword;
            user.passwordConfirm = confirmPassword;
            await user.save();
            res.status(201).json({ status: "password changed successfully" })
        } else {
            generateError(403, "please , enter all inputs value")
        }
    } catch (error) {
        next(error)
    }
}//change password

const changeProfilePicture = async (req, res, imageTxt, status, text) => {
    const User = (req.user.role) ? Speaker : Student;
    const user = await User.findById(req.user._id);
    if (user.image) {
        const imgPath = path.join(__dirname, "../images/" + user.image);
        fs.unlinkSync(imgPath);
    }
    await User.updateOne({ _id: user._id }, { $set: { image: imageTxt } })
    res.status(status).json({ file: req.file, status: text });
}//add , update , delete profile image

const userVerify = async (req, key) => {

    const id = req.params.valueOf().id;
    let user = {};
    if (isNaN(id)) {
        user = await Speaker.findById(req.params.id);
    }
    user = await Student.findById(id);

    if (!user) { generateError(400, "invalid link") }

    const token = jwt.verify(req.params.token, eval(key));
    if (!token) { generateError(400, "invalid link") }
    return user;

}
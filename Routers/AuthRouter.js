const express = require("express");
const { loginValidation, registerValidation, emailValidation } = require('./../middleware/ValidationAuth');
const { postLogin, postRegister, me_get, saveProfile, deleteProfile, sendVerificationEmail, emailVerify, changePassword, detectUserByEmail, sendResetPassword, passVerify } = require('./../Controllers/loginController');
const { handleErrors } = require("../middleware/handleErrors");
const { validateToken } = require("../middleware/permissions");
const { avatar } = require("../middleware/uploadImage");

const router = express.Router();

/*ToDO:
    **first : validation on email and password with express-validator and check if email exist return data in request body.
    **second : <postLogin> recieve data form request body and check if email verified and match password then add token to this user.
*/
router.post("/login", loginValidation, handleErrors, postLogin);

/*ToDO:
    **first : validation on <registerValidation> <handleErrors> with express-validator and check if email exist throw error.
    **second : <postRegister> detect the user is speaker or student and save your data and return it in request.
    **third : <sendVerificationEmail> send email verify to this user 
*/
router.post("/register", registerValidation, handleErrors, postRegister, sendVerificationEmail);

/*ToDO:
    **first : validation on <emailValidation> <handleErrors> with express-validator and check if email exist return data in request body..
    **second : <detectUserByEmail> detect the user is speaker or student and  return user data in request.
    **third : <sendVerificationEmail> send email verify again to this user . 
*/
router.post("/verifyEmail", emailValidation, handleErrors, detectUserByEmail, sendVerificationEmail);

/* Todo: 
    **deal with link sent to user and update user {verified:true}
*/
router.get("/user/verify/:id/:token", emailVerify);

/* Todo: 
    **get my data to deal with it in front end
*/
router.get("/me", validateToken, me_get);

/* Todo: 
    **first need to validate token and return user data in request
    **second you must type your old password 
        if new password == old password throw error and redirect user to login
*/
router.post("/password/change", validateToken, changePassword);

/*ToDO:
    **first : validation on <emailValidation> <handleErrors> with express-validator and check if email exist return data in request body..
    **second : <detectUserByEmail> detect the user is speaker or student and  return user data in request.
    **third : <sendResetPassword> send email reset password to this user  and expires in 1h. 
*/
router.post("/password/reset", emailValidation, handleErrors, detectUserByEmail, sendResetPassword);

/* Todo: 
    **first get new password and confirm password from request body.
    **deal with link sent to user to verify and compare password 
        if new == old throw error
        else save new password after validation in db
*/
router.post("/password/reset/:id/:token", passVerify);

/* Todo: 
    **first need to validate token and return user data in request
    **second detect user is speaker or student 
        if image exist delete it from db and save new one
*/
router.post("/addAvatar", validateToken, avatar, saveProfile);
router.put("/removeAvatar", validateToken, deleteProfile);

module.exports = router;
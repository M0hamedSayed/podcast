const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

exports.userMethods = (user) => {
    //virtual full name [get,set]
    user.virtual('fullName')
        .get(function () {
            return this.firstName + ' ' + this.lastName;
        })
        .set(function (value) {
            this.firstName = value.substr(0, v.indexOf(' '));
            this.lastName = value.substr(v.indexOf(' ') + 1);
        });

    //If change password
    user.virtual('changePassword')
        .get(function () {
            return this._changePassword;
        })
        .set(function (value) {
            this._changePassword = value;
        });

    //virtual password
    user.virtual('password')
        .get(function () {
            return this._password;
        })
        .set(function (value) {
            this._password = value;
        });

    //virtual password confirm
    user.virtual('passwordConfirm')
        .get(function () {
            return this._passwordConfirm;
        })
        .set(function (value) {
            this._passwordConfirm = value;
        });

    //validate password
    const handlePassErrors = (password, passwordConfirm) => {
        if (password && passwordConfirm) {
            if (!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)) {
                throw new Error('Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters.')
            }
            if (password !== passwordConfirm) {
                throw new Error('Two Passwords doesn\'t Match.');
            }
        } else {
            throw new Error('Two passwords fields required')
        }
    }

    //pre save
    user.pre('save', async function (next) {
        try {
            if (this._changePassword || this.isNew) {
                handlePassErrors(this._password, this._passwordConfirm);
                let salt = await bcrypt.genSalt(10);
                this.passwordHash = await bcrypt.hash(this._password, salt);
            }

        } catch (error) {
            next(error)
        }
    })

    //compare password
    user.methods.comparePassword = async function (password) {
        const match = await bcrypt.compare(password, this.passwordHash);
        // if (!match) throw new Error('Invalid Password');
        if (!match) return false;
        return true;
    }

    user.methods.userData = function () {
        return {
            _id: this._id,
            fullName: this.fullName,
            email: this.email,
            address: this.address,
            image: this.image,
            role: this.role,
            verified: this.verified,
            createAt: this.createAt
        }
    }

}

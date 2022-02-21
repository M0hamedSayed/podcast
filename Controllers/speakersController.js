const Speaker = require("../Models/speakerSchema");
const { ObjectId } = require('mongoose').Types;

exports.getAllSpeakers = async (req, res, next) => {
    try {
        const data = await Speaker.find();
        if (!data) {
            next()
        }
        res.status(200).json({ data })
    } catch (error) {
        next(error)
    }
}//get all speakers for admin

exports.getSpeaker = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) next();
        const data = await Speaker.findById(id);
        if (!data) {
            next()
        }
        res.status(200).json({ data })
    } catch (error) {
        next(error)
    }
}//get one speaker by id for admin only


exports.updateSpeaker = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) next();
        const speaker = await Speaker.findOne({ _id: req.params.id });
        if (!speaker) generateError(403, "User not found")
        const { firstName, lastName, address } = req.body;
        const check = new ObjectId(speaker._id).equals(new ObjectId(req.user._id));
        if (!check) generateError(401, "can't update this user");
        Object.assign(speaker,
            firstName && { firstName },
            lastName && { lastName },
            address && { address }
        );
        // await speaker.validate()
        await speaker.save();
        res.status(200).json({ data: speaker })
    } catch (error) {
        next(error)
    }
}// update data student for exist speaker

exports.deleteSpeaker = async (req, res, next) => {
    try {
        if (!ObjectId.isValid(req.params.id)) next();
        const speaker = await Speaker.findOne({ _id: req.params.id });
        if (!speaker) next();
        await speaker.delete();
        res.status(200).json({ data: `speaker deleted ` })
    } catch (error) {
        next(error)
    }
}//delete speaker by admin
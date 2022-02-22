const { generateError } = require("../middleware/handleErrors");
const Student = require("../Models/studentSchema");

exports.getAllStudents = async (req, res, next) => {
    try {
        const data = await Student.find();
        if (!data) {
            next()
        }
        res.status(200).json({ data })
    } catch (error) {
        next(error)
    }
}//get all students for admin

exports.getStudent = async (req, res, next) => {
    try {
        const id = req.params.valueOf().id;
        const data = await Student.findById(id);
        if (!data) {
            next()
        }
        res.status(200).json({ data })
    } catch (error) {
        next(error)
    }
}//get one student by id for admin only


exports.updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findOne({ _id: req.params.valueOf().id });
        if (!student) generateError(403, "User not found")
        const { firstName, lastName } = req.body;
        const check = (student._id.valueOf() == req.user._id);
        if (!check) generateError(401, "can't update this user");
        Object.assign(student,
            firstName && { firstName },
            lastName && { lastName },
        );
        await student.save();
        res.status(200).json({ data: student })
    } catch (error) {
        next(error)
    }
}// update data student for exist student



exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findOne({ _id: req.params.valueOf().id });
        if (!student) next();
        await student.delete();
        res.status(200).json({ data: `student deleted ` })
    } catch (error) {
        next(error)
    }
} //delete student by admin
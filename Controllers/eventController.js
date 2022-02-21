const { generateError } = require("../middleware/handleErrors");
const Events = require("../Models/eventSchema")
const Speaker = require("../Models/speakerSchema")
const Student = require("../Models/studentSchema")

exports.getAllEventsUser = async (req, res, next) => {
    try {
        const id = req.user._id;
        let events = {};
        if (typeof id == "number") {
            events = await Events.find({ students: id });
        } else {
            events = await Events.find({ $or: [{ mainSpeaker: id }, { speakers: id }] });
        }

        console.log(events);

        if (!events) {
            next()
        }
        res.status(200).json({ data: events })

    } catch (error) {
        next(error)
    }
}//get all events for specific user [student,speaker]

exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Events.aggregate([
            {
                $lookup: {
                    from: "speakers",
                    localField: "mainSpeaker",
                    foreignField: "_id",
                    as: "mainSpeaker"
                }
            },
            {
                $lookup: {
                    from: "speakers",
                    pipeline: [{ $project: { firstName: 1, lastName: 1, image: 1 } }],
                    localField: "speakers",
                    foreignField: "_id",
                    as: "speakers"
                }
            },
            {
                $project: {
                    _id: 0,
                    title: 1,
                    eventDate: 1,
                    speakers: 1,
                    mainSpeaker: { firstName: 1, lastName: 1, image: 1 },
                    students: { $size: "$students" }
                }
            }
        ])
        if (!events) {
            next()
        }
        res.status(200).json({ data: events })
    } catch (error) {
        next(error)
    }
}// get all events with specific data [mainSpeaker name with image , speakers names with images , student count]

exports.getAllEventsAdmin = async (req, res, next) => {
    try {
        const events = await Events.find()
            .populate('mainSpeaker').populate('speakers').populate('students');
        if (!events) {
            next()
        }
        res.status(200).json({ data: events })
    } catch (error) {
        next(error)
    }
}// get all events for admin with populations

exports.getEvent = async (req, res, next) => {
    try {
        if (!req.role) {
            generateError(403, "Access Denied")
        }
        const event = req.event;
        if (!event) next();
        res.status(200).json({ data: event })
    } catch (error) {
        next(error)
    }
}

//get ids from multiply users
getIds = (data) => {
    if (data) {
        const arrIds = [];
        data.map((item) => {
            arrIds.push(item._id);
        })
        return arrIds;
    }
}


exports.addEvent = async (req, res, next) => {
    try {
        const { title, eventDate, mainSpeaker, speakers, students } = req.body;
        const speakersData = await Speaker.find({ email: { $in: speakers } });
        const mainSpeakersData = await Speaker.findOne({ email: mainSpeaker });
        const studentsData = await Student.find({ email: { $in: students } });
        const speakersIds = getIds(speakersData);
        const studentsIds = getIds(studentsData);

        let event = Events({
            title,
            eventDate,
            mainSpeaker: mainSpeakersData._id,
            speakers: speakersIds,
            students: studentsIds
        });
        await event.save();
        res.status(201).json({ status: "added , event", data: event })

    } catch (error) {
        next(error)
    }
}//add new event by admin

exports.updateEvent = async (req, res, next) => {
    try {
        const { title, eventDate, mainSpeaker, speakers, students, askJoinSpeaker, askJoinStudent } = req.body;
        let event = req.event;
        console.log(event);
        if (req.role == "admin") {
            Object.assign(event,
                title && { title },
                eventDate && { eventDate },
                mainSpeaker && { mainSpeaker },
                speakers && { speakers },
                students && { students },
                askJoinSpeaker && { askJoinSpeaker },
                askJoinStudent && { askJoinStudent }
            );
        } else if (req.role == "mainSpeaker") {
            Object.assign(event,
                eventDate && { eventDate },
                speakers && { speakers },
                students && { students },
                askJoinSpeaker && { askJoinSpeaker },
                askJoinStudent && { askJoinStudent }
            );
        } else if (req.role == "speakers") {
            const speaker = event.speakers.filter((item) => item != req.user.id);
            event.speakers = speaker;
        } else if (req.role == "students") {
            event.students = event.students.filter((item) => item != req.user._id);
        } else if (req.user.role) {
            event.askJoinSpeaker.push(req.user._id);
        } else if (!req.user.role) {
            event.askJoinStudent.push(req.user._id);
        }

        req.body = event;
        next()
    } catch (error) {
        next(error)
    }
} //update event customization for all users

exports.updateEventFinal = async (req, res, next) => {
    try {
        const event = req.body;
        await event.save();
        res.status(201).json({ data: event, role: req.role })
    } catch (error) {
        next(error)
    }
}//save data after update and validate

exports.deleteEvent = async (req, res, next) => {
    try {
        const event = req.event;
        if (req.role == "admin" || req.role == "mainSpeaker") {
            await event.delete();
            res.status(200).json({ data: `event deleted` })
        } else {
            generateError(401, "no permission to delete this event")
        }
    } catch (error) {
        next(error)
    }
}//delete event for admin and main speaker
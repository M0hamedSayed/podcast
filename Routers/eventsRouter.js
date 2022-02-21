const router = require('express').Router();

const { handleErrors } = require('../middleware/handleErrors');
const { isAdmin, accessPermissions, validateToken } = require('../middleware/permissions');
const { validationEvent } = require('../middleware/validationEvent');
const { getAllEvents, getEvent, addEvent, updateEvent, deleteEvent, getAllEventsAdmin, getAllEventsUser, updateEventFinal } = require('../Controllers/eventController');


/*Todo:
    **first need to validate token and return user data in request
    **second get all events for students , speakers that participate in this events
    throw error if events is not found
*/
router.get('/user/', validateToken, getAllEventsUser);

/*Todo:
    **first need to validate token and return user data in request
    **second get all events with specific data 
    [main speaker fullName and image] 
    [speakers fullName and image]
    [students count]
    throw error if events is not found
*/
router.get('/', validateToken, getAllEvents);

/*Todo : 
    **first need to validate token and return user data in request and check is admin 
    **second get all data with populate students and speakers if not exist throw error not found
*/
router.get('/admin/', validateToken, isAdmin, getAllEventsAdmin);

/*Todo : 
    **first need to validate token and return user data in request and check is admin or students , speakers that participate in this event
    **second get data with ID if exist else throw error not found
*/
router.get('/:id', validateToken, accessPermissions, getEvent);

/*Todo : 
    **first need to validate token and return user data in request and check is admin 
    **second add event by email
*/
router.post('/', validateToken, isAdmin, validationEvent, handleErrors, addEvent);

/*Todo : 
    **first need to validate token and return user data in request 
    **second <accessPermissions> that return who user that want to update >> admin , main speaker ,speakers , students or any user ask to join
    **third <updateEvent> any user can update put with specific permission
    ** then validate inputs with express validator and save data in db
*/
router.put('/:id', validateToken, accessPermissions, updateEvent, validationEvent, handleErrors, updateEventFinal);

/*Todo : 
    **first need to validate token and return user data in request and check is admin and main speaker only
    **second delete event by id
*/
router.delete('/:id', validateToken, accessPermissions, deleteEvent)


module.exports = router;
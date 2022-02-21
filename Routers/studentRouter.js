const router = require('express').Router();
const { handleErrors } = require('../middleware/handleErrors');
const { isAdmin, validateToken } = require('../middleware/permissions');
const { getAllStudents, getStudent, updateStudent, deleteStudent } = require('../Controllers/studentController');
const { registerValidation } = require('../middleware/ValidationAuth');
const { postRegisterStudent } = require('../Controllers/loginController');

/*Todo : 
    **first need to validate token and return user data in request and check is admin 
    **second get all data if exist else throw error not found
*/
router.get('/', validateToken, isAdmin, getAllStudents);

/*Todo : 
    **first need to validate token and return user data in request and check is admin 
    **second get data with ID if exist else throw error not found
*/
router.get('/:id', validateToken, isAdmin, getStudent);

/*Todo: add student redirect to register */
router.post('/', (req, res, next) => {
    try {
        res.redirect(307, "/register");
    } catch (error) {
        next(error)
    }
});

/*Todo : 
    **first need to validate token and return user data in request 
    **second update your data without password and email
*/
router.put('/:id', validateToken, updateStudent);

/*Todo : 
    **first need to validate token and return user data in request and check is admin 
    **second get data with ID if exist and delete it  else throw error not found
*/
router.delete('/:id', validateToken, isAdmin, deleteStudent);

module.exports = router;
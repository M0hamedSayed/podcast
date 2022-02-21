const router = require('express').Router();
const { handleErrors } = require('../middleware/handleErrors');
const { isAdmin, validateToken } = require('../middleware/permissions');
const { getAllSpeakers, getSpeaker, updateSpeaker, addSpeaker, deleteSpeaker } = require('../Controllers/speakersController');
const { registerValidation } = require('../middleware/ValidationAuth');

/* same student route but one different is objectID ,i should verify it before use*/
router.get('/', validateToken, isAdmin, getAllSpeakers);
router.get('/:id', validateToken, isAdmin, getSpeaker);

router.post('/', (req, res, next) => {
    try {
        res.redirect(307, "/register");
    } catch (error) {
        next(error)
    }
});

router.put('/:id', validateToken, updateSpeaker);
router.delete('/:id', validateToken, isAdmin, deleteSpeaker);

module.exports = router;
const express = require('express');
const viewsController = require('../controllers/viewsController');
// const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/overviewBooks', viewsController.getOverviewBooks);
router.get('/overviewMeetings', viewsController.getOverviewMeetings);
router.get('/overviewUsers', viewsController.getOverviewUsers);
router.get('/overviewReservations', viewsController.getOverviewReservations);

// router.get('/book', viewsController.getBook);
router.get('/overviewBooks/:id', viewsController.getBook);
router.get('/overviewMeetings/:id', viewsController.getMeeting);


module.exports = router;
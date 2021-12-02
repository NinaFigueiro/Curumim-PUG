const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

// const authController = require('./../controllers/authController');

const router = express.Router();

// Public



// ADMINS / SUPER-USERS
router.get('/overviewMeetings', authController.protect, authController.restrictTo('admin', 'super-user'), viewsController.getOverviewMeetings);
router.get('/overviewBooks/:id', authController.protect, authController.restrictTo('admin', 'super-user'), viewsController.getBook);
router.get('/overviewUsers', authController.protect, authController.restrictTo('admin', 'super-user'), viewsController.getOverviewUsers);

router.get('/submit-book-data', authController.protect, authController.restrictTo('admin', 'super-user'), viewsController.updateBook);
router.get('/overviewReservations', authController.protect, authController.restrictTo('admin', 'super-user'), viewsController.getOverviewReservations);

router.get('/me', authController.protect, viewsController.getAccount);


router.post('/sumbit-user-data', authController.protect, viewsController.updateUserData)

// For all users
router.use(authController.isLoggedIn);

router.get('/login', viewsController.getLoginForm);
// router.get('/book', viewsController.getBook);
router.get('/overviewMeetings/:id', viewsController.getMeeting);

router.get('/', viewsController.getNextMeeting);
// This post is an exeption since we don't want to use the API for it
// router.post('/sumbit-newsletter', viewsController.subscribeNewsletter )



router.get('/overviewBooks', viewsController.getOverviewBooks);

module.exports = router;
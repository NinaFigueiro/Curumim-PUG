const express = require('express');
const meetingController = require('./../controllers/meetingController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/nextMeeting').get(meetingController.getNextMeeting);

// gets yearly and monthly meetings from current year
router.route('/callendarYear').get(meetingController.getMeetingsPerYear);
router.route('/callendarYear/:month').get(meetingController.getMeetingsPerMonth);
// gets yearly and monthly meetings from queried year
router.route('/selectedYear/:year').get(meetingController.getMeetingsPerYear);
router.route('/selectedYear/:year/:month').get(meetingController.getMeetingsPerMonth);

// User has to be logged in:
router.use(authController.protect);

router.route('/:id').get(meetingController.getMeeting);

// User has to be ADMIN or SUPER-USER:
router.use(authController.restrictTo('admin', 'super-user'));

router
  .route('/')
  .get(meetingController.getAllMeetings)
  .post(meetingController.createMeeting);

router
  .route('/:id')
  .patch(meetingController.updateMeeting)
  .delete(meetingController.deleteMeeting);

module.exports = router;
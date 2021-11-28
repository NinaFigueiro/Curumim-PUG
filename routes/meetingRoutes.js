const express = require('express');
const meetingController = require('./../controllers/meetingController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.route('/:month/:year').get(meetingController.getMeetingsPerMonth);

// router
//   .route('/')
//   .get(authController.protect, bookController.getAllBooks)
//   .post(bookController.createBook);

// router
//   .route('/:id')
//   .get(bookController.getBook)
//   .patch(bookController.updateBook)
//   .delete(authController.protect, authController.restrictTo('admin', 'super-user'), bookController.deleteBook);

module.exports = router;
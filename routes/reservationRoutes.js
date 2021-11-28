const express = require('express');
const reservationController = require('./../controllers/reservationController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

// User has to be logged in
router.use(authController.protect);

router.route('/').post(reservationController.setBookUserIds, reservationController.createReservation);
// router.route('/:bookId').post(authController.protect, reservationController.createReservation);
router.route('/:id').delete(reservationController.deleteReservation);

// User has to be ADMIN or SUPER-USER
router.use(authController.restrictTo('admin', 'super-user'));

router.route('/:id').get(reservationController.getReservation);
router.route('/').get(reservationController.getAllReservations);

router.route('/setBorrowed/:id').patch(reservationController.setBorrowed);
router.route('/setReturned/:id').patch(reservationController.setReturned);


// router
//   .route('/:id')
//   .get(reservationController.getBook)
//   .patch(reservationController.updateBook)
//   .delete(authController.protect, authController.restrictTo('admin', 'super-user'), reservationController.deleteBook);

module.exports = router;
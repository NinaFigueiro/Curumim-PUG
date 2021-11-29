const express = require('express');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/authController');
// const reservationController = require('./../controllers/reservationController');
const reservationRouter = require('./../routes/reservationRoutes');

const router = express.Router();

router.use('/:bookId/reservations', reservationRouter);

router.route('/available').get(bookController.aliasBooksAvailable, bookController.getAllBooks);
router.route('/reserved').get(bookController.aliasBooksReserved, bookController.getAllBooks);
router.route('/borrowed').get(bookController.aliasBooksBorrowed, bookController.getAllBooks);

// Create Reservation on Book DELETE
// router.route('/:bookId/reservations').post(authController.protect, reservationController.createReservation);

router.route('/').get(bookController.getAllBooks);

// User has to be logged in:
router.use(authController.protect);

router.route('/:id').get(bookController.getBook);

// User has to be ADMIN or SUPER-USER:
router.use(authController.restrictTo('admin', 'super-user'));

router.route('/').post(bookController.createBook);

router.route('/:id').patch(bookController.updateBook).delete(bookController.deleteBook);

module.exports = router;
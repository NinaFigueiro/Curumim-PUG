const express = require('express');
const bookController = require('./../controllers/bookController');
const authController = require('./../controllers/authController');
// const reservationController = require('./../controllers/reservationController');
const reservationRouter = require('./../routes/reservationRoutes');

const router = express.Router();

router.route('/available').get(bookController.aliasBooksAvailable, bookController.getAllBooks);
router.route('/reserved').get(bookController.aliasBooksReserved, bookController.getAllBooks);
router.route('/borrowed').get(bookController.aliasBooksBorrowed, bookController.getAllBooks);

// Create Reservation on Book DELETE
// router.route('/:bookId/reservations').post(authController.protect, reservationController.createReservation);

router.use('/:bookId/reservations', reservationRouter);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(authController.protect, authController.restrictTo('admin', 'super-user'),  bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(authController.protect, authController.restrictTo('admin', 'super-user'), bookController.deleteBook);

module.exports = router;
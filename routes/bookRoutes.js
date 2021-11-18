const express = require('express');
const bookController = require('./../controllers/bookController');

const router = express.Router();

router.route('/available').get(bookController.aliasBooksAvailable, bookController.getAllBooks);
router.route('/reserved').get(bookController.aliasBooksReserved, bookController.getAllBooks);
router.route('/borrowed').get(bookController.aliasBooksBorrowed, bookController.getAllBooks);

router.route('/:month/:year').get(bookController.getMeetingsPerMonth);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(bookController.createBook);

router
  .route('/:id')
  .get(bookController.getBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
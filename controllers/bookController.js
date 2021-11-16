const Book = require('./../models/bookModel');

exports.getAllBooks = async (req, res) => {
   try {
        // BUILD QUERY
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        const query = Book.find(queryObj);
        // const query = Book.find()
        //     .where('status')
        //     .equals('available');

        // EXECUTE QUERY
        const books = await query;

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: books.length,
            data: {
                books
            }
        });
    } catch(err) {
          res.status(404).json({
            status: 'fail',
             message: err.message
         });
    }
};

exports.getBook = async (req, res) => {    
    try {
        const book = await Book.findById(req.params.id);
        // const book = await Book.findOne({ _id: req.params.id });
        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }  
};

exports.createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                book: newBook
            }
        });
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
    
};

exports.updateBook = async (req, res) => {
    try{
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteBook = async (req, res) => {
    try{
        await Book.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};
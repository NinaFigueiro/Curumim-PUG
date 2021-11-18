const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasBooksAvailable = (req, res, next) => {
    req.query.status = 'available';
    // req.query.sort = 'name';
    req.query.fields = 'name,author,img,status';

    next();
};

exports.aliasBooksReserved = (req, res, next) => {
    req.query.status = 'reserved';
    // req.query.sort = 'name';
    req.query.fields = 'name,author,img,status';

    next();
};

exports.aliasBooksBorrowed= (req, res, next) => {
    req.query.status = 'borrowed';
    // req.query.sort = 'name';
    req.query.fields = 'name,author,img,status';

    next();
};

exports.getMeetingsPerMonth = async (req, res) => {
    try{
        const year = req.params.year * 1;

        const month = req.params.month;

        const plan = await Book.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`${year}-${month}-01`),
                        $lte: new Date(`${year}-${month}-31`),
                    }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });

    }  catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getAllBooks = async (req, res) => {
req.query.sort = 'name';
   try {
        // EXECUTE QUERY
        const features = new APIFeatures(Book.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate(0);
        const books = await features.query;

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


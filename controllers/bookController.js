const Book = require('./../models/bookModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

exports.getMeetingsPerMonth = catchAsync(async (req, res, next) => {
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
});

exports.getAllBooks = catchAsync(async (req, res, next) => {
req.query.sort = 'name';
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
});

exports.getBook = catchAsync(async (req, res, next) => {    
        const book = await Book.findById(req.params.id);
        // const book = await Book.findOne({ _id: req.params.id });
        if(!book) {
            return next(new AppError('No book found with that ID', 404))
        }
        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        }); 
});

exports.createBook = catchAsync(async (req, res, next) => {
    const newBook = await Book.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            book: newBook
        }
    });    
});

exports.updateBook = catchAsync(async (req, res, next) => {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!book) {
            return next(new AppError('No book found with that ID', 404))
        }

        res.status(200).json({
            status: 'success',
            data: {
                book
            }
        });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
        const book = await Book.findByIdAndDelete(req.params.id);

        if(!book) {
            return next(new AppError('No book found with that ID', 404))
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
});


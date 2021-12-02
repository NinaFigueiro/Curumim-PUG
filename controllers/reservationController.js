const Book = require('./../models/bookModel');
const Reservation = require('./../models/reservationModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

// ONLY IF USING HANDLER FACTORY
exports.getReservation = factory.getOne(Reservation);
// exports.createReservation = factory.createOne(Reservation);
// exports.updateReservation = factory.updateOne(Reservation);
// exports.deleteReservation = factory.deleteOne(Reservation);
// 

// BEFORE HANDLER FACTORY
exports.getAllReservations = catchAsync(async(req, res, next) => {
    let filter = {};
    if(!req.query.sort) req.query.sort = 'createdAt';
    if(req.params.bookId) filter = {book: req.params.bookId}
    const reservations = await Reservation.find(filter);

    res.status(200).json({
        status: 'success',
        results: reservations.length,
        data: {
            reservations
        }
    })
});

// MAybe add that only the reservation user or Super-User can delete the reservation
exports.setBookUserIds = catchAsync(async (req, res, next) => {
    // Allow nested routes
    const book = await Book.findById(req.params.bookId);

    if(!req.body.bookId) req.body.bookId = book.id
    if(!req.body.bookName) req.body.bookName = book.name   
    if(!req.body.bookAuthor) req.body.bookAuthor = book.author   
    if(!req.body.userName) req.body.userName = req.user.name

    if(!(book.status === 'available')) {
        return next(new AppError('This book is already reserved', 404))
    }
    await Book.findByIdAndUpdate(req.params.bookId, { status: 'reserved'});

    next();
});
// MISSING ERROR HANDLER for when the book is already reserved
exports.createReservation = catchAsync(async (req,res,next) => {
   const newReservation = await Reservation.create(req.body);
    
    res.status(201).json({
        status: 'success',
        data: {
            reservation: newReservation
        }
    })
});

exports.deleteReservation = catchAsync(async (req, res, next) => {
    // we want to find a reservation which has our book id and logged in user
    const reservation = await Reservation.findById(req.params.id);
    console.log(req.params.id)
    const book = await Book.findById(reservation.bookId);
    if(!(book.status === 'reserved')) {
        return next(new AppError('This reservation is already borrowed and cannot be cancelled', 404))
    }
    // const reservation = await Reservation.find(req.params.id);
    await Reservation.findOneAndDelete(req.params.id);
    await Book.findByIdAndUpdate(reservation.book, { status: 'available'});
    
    if(!reservation) {
        return next(new AppError('No reservation found with that ID', 404))
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.setBorrowed = catchAsync(async (req,res,next) => {
    const reservation = await Reservation.findById(req.params.id);
    if(reservation.borrowedAt) {
        return next(new AppError('This reservation is already set to borrowed', 404))
    }
    const updatedReservation = await Reservation.findByIdAndUpdate(req.params.id, {borrowedAt: Date.now()});

    await Book.findByIdAndUpdate(reservation.book, {status: 'borrowed'});


    res.status(200).json({
        status: 'success',
        data: {
            updatedReservation
        }
    });
});

exports.setReturned = catchAsync(async (req,res,next) => {
    const reservation = await Reservation.findById(req.params.id);
    if(reservation.returnedAt || !reservation.borrowedAt) {
        return next(new AppError('This reservation has already been finalized or has not been borrowed to user yet', 404))
    }
    await Reservation.findByIdAndUpdate(req.params.id, {returnedAt: Date.now()});
    
    await Book.findByIdAndUpdate(reservation.book, {status: 'available'});
    
    res.status(200).json({
        status: 'success',
        data: {
            reservation
        }
    });
});

exports.myReservations = catchAsync(async (req,res,next) => {
    // const user = req.user
    // console.log(user)
    const reservations = await Reservation.find({ user: req.user });
    
    
    res.status(200).json({
        status: 'success',
        data: {
            reservations
        }
    });
});



const Book = require('../models/bookModel');
const Meeting = require('../models/meetingModel');
const User = require('../models/userModel');
const Reservation = require('../models/reservationModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverviewBooks = catchAsync(async (req, res) => {
    // Get book data from collection
    const books = await Book.find();

    // Build template
    

    // Render that template using  book data from 1)
    res.status(200).render('overviewBooks', {
        title: 'Library',
        books
    });
});

exports.getOverviewMeetings = catchAsync(async (req, res) => {
    // Get book data from collection
    const meetings = await Meeting.find();
    // Render template using  book data from
    res.status(200).render('overviewMeetings', {
        title: 'Meetings',
        meetings
    });
});

exports.getOverviewUsers = catchAsync(async (req, res) => {
    // Get book data from collection
    const users = await User.find();
    // Render template using  book data from
    res.status(200).render('overviewUsers', {
        title: 'Users',
        users
    });
});

exports.getOverviewReservations = catchAsync(async (req, res) => {
    // Get book data from collection
    const reservations = await Reservation.find();
    // Render template using  book data from
    res.status(200).render('overviewReservations', {
        title: 'Reservations',
        reservations
    });
});

exports.getBook = catchAsync(async (req, res) => {
    // 1) Get the data for the request
    // const book = await Book.findOne({_id: req.params.id});
    const book = await Book.findOne({_id: req.params.id}).populate({
        path:'reservations'
    });
    // 2) render template using data from 1)
    res.status(200).render('oneBook', {
        title: 'The Book',
        book
    });
});

exports.getMeeting = catchAsync(async (req, res) => {
    // 1) Get the data for the request
    const meeting = await Meeting.findOne({_id: req.params.id});
    // 2) render template using data from 1)
    res.status(200).render('oneMeeting', {
        title: 'The Meeting',
        meeting
    });
});

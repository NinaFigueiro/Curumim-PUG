const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
// const APIFeatures = require('./../utils/apiFeatures');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

        // SEND RESPONSE
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
});

exports.approveUser = catchAsync(async (req, res, next) => {
    const approvedUser = await User.findByIdAndUpdate(req.params.id, {approvedUser: true});
    console.log('selectedUser', req.params.id);
    console.log('loggedInUser', req.user.id);
    res.status(200).json({
        status: 'success',
        data: approvedUser
    });
});

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next( new AppError('This route is not for password update. Please use /updateMyPassword', 400));
    }
    // 2) Update user document
    // We are filtering here in order to be sure user only update these properties
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true, 
        runValidators: true
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: 'success',
        data: null
    })
});

exports.getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined'
    });
};
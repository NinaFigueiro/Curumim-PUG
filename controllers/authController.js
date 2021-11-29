const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
// const APIFeatures = require('./../utils/apiFeatures');

const signToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET);
}

const createSendToken = (user, statusCode, res ) => {
    const token = signToken(user._id);
    const cookieOptions = {
        httpOnly: true
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    
    res.cookie('jwt', token, cookieOptions);
    // Remove password from the output
    // user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async(req, res, next) => {
    // const newUser = await User.create(req.body);
    // we do not accect req.body here cause we want to specify which properties can be created
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        // REMOVE IT (have it only in createUser)
        // passwordChangedAt: req.body.passwordChangedAt,
        // role: req.body.role
    });
    
    // createSendToken(newUser, 201, res);    
    res.status(201).json({
        status: 'success',
        data: {
            newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    // 1) Check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2)Check if user exists && password is correct
    const user = await User.findOne({email: email}).select('+password');
    // const correct = await user.correctPassword(password, user.password);

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }

    if(!user.approvedUser) {
        return next(new AppError('This user is not approved yet', 404))
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res); 
    // console.log('req.user', req.user);
    // console.log('user', user);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token)
    if(!token) {
        return next(new AppError('You are not logged in. Please log in to get access', 401))
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        return next(new AppError('The user belonging to this token no longer exist.', 401));
    }

    // 4) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password. Please log in again.', 401));
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// "...roles" is an array
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles 
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perfom this action', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        return next(new AppError('There is no user with this email address', 404));
    };
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    // setting validateBeforeSave to false wont require the required fields for login
    await user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Create a new one here: ${resetURL}\nIf you didn't forget your password, please ignore this email.`

    try {
        await sendEmail({
            email:user.email,
            subject: 'Your password reset token (valid for 10 min!)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('There was an error sending the email. Try again later!', 500))
    }
    
});

exports.resetPassword = catchAsync( async (req, res, next) => {
    // 1) Get user based on token 
    // first we encrypt the token we got from the url 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne(
        {passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()} 
    });

    // 2) If token has not expired, and there is user, set the new password
    if(!user) {
        return next(new AppError('Token is invalid or has expired', 400))
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the current user

    // 4) Log the user in
    createSendToken(user, 200, res); 
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get the user from the collection
    const user = await User.findById(req.user.id).select('+password');
    // 2) Check if POSTed password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password ))) {
        return next(new AppError('Your current password is wrong', 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);

});

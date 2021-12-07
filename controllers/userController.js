const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const sharp = require('sharp');
// const APIFeatures = require('./../utils/apiFeatures');

aws.config.update ({
    secretAccessKey: process.env.AWSSecretKey,
    accessKeyId: process.env.AWSAccessKeyId
});

const s3 = new aws.S3();

const multerMemoryStorage = multer.memoryStorage();

const multerStorage = multerS3({
    s3: s3,
    bucket: 'curumim-v1',
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname});
    },
    key: (req, file, cb) => {
        cb(null, `user-${req.user.id}-${Date.now().toString()}`)
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/img/users');
//     },
//     filename: (req, file, cb) => {
//         // user-415236547dsads-45698745631.jpeg
//         const ext = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

// const multerFilter = (req, file, cb) => {
//     if(file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(new AppError('Not an image! Please upload only images.', 400), false);
//     }
// };


const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter,
    
});
// const awsUpload = multer({ 
//     storage: multerStorage,
//     fileFilter: multerFilter,
    
// });

exports.uploadUserPhoto = upload.single('img');
// exports.uploadAWSUserPhoto = awsUpload.single('img');

exports.resizeUserPhoto = (req, res, next) => {
    if(!req.file) return next();

    sharp(req.file.buffer).resize(500, 500);

    next();
}


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
}

// ONLY IF USING HANDLER FACTORY
exports.getUser = factory.getOne(User);
// exports.createUser = factory.createOne(User);
// exports.updateUser = factory.updateOne(User);
// exports.deleteUser = factory.deleteOne(User);
// 

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
    // console.log('selectedUser', req.params.id);
    // console.log('loggedInUser', req.user.id);
    res.status(200).json({
        status: 'success',
        data: approvedUser
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log(req.file);
    console.log('UpdateMe', req.body);
    // 1) Create error if user POSTs password data
    if(req.body.password || req.body.passwordConfirm) {
        return next( new AppError('This route is not for password update. Please use /updateMyPassword', 400));
    }
    // 2) Update user document
    // We are filtering here in order to be sure user only update these properties
    const filteredBody = filterObj(req.body, 'name', 'email');

    if(req.file) filteredBody.img = req.file.location;
    // console.log(req.file)
    
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
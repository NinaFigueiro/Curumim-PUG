const Meeting = require('./../models/meetingModel');
const APIFeatures = require('./../utils/apiFeatures');
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
        cb(null, `meeting-${req.user.id}-${Date.now().toString()}`)
    }
});

const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({ 
    storage: multerStorage,
    fileFilter: multerFilter,
    
});


// If only one img is to be uploaded:
exports.uploadMeetingPhoto = upload.single('img');

// If both one single img and a group of imgs is to be uploaded
exports.uploadImages = upload.fields([
    {name: 'img', maxCount: 1},
    {name: 'images', maxCount: 20} 
]);

// // If only a group of imgs is to be uploaded:
// upload.array('images', 5)

// ONLY IF USING HANDLER FACTORY
exports.getMeeting = factory.getOne(Meeting);
exports.getAllMeetings = factory.getAll(Meeting);
exports.createMeeting = factory.createOne(Meeting);
exports.updateMeeting = factory.updateOne(Meeting);
exports.deleteMeeting = factory.deleteOne(Meeting);
// 


exports.aliasMeetingsPerMonth = (req, res, next) => {
    req.query.status = 'available';
    // req.query.sort = 'name';
    req.query.fields = 'name,author,img,status';

    next();
};

exports.getMeetingsPerYear = catchAsync(async (req, res, next) => {
    let year = req.params.year * 1;
    if(!req.params.year) year = new Date().getFullYear();
    console.log(year);

    // const month = req.params.month;
    const plan = await Meeting.aggregate([
        {
            $match: {
                date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                }
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: plan.length,
        data: {
            plan
        }
    });
});

exports.getMeetingsPerMonth = catchAsync(async (req, res, next) => {
    let year = req.params.year * 1;
    if(!req.params.year) year = new Date().getFullYear();
    const month = req.params.month;
    const plan = await Meeting.aggregate([
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
        results: plan.length,
        data: {
            plan
        }
    });
});

exports.getNextMeeting = catchAsync(async (req, res, next) => {
    
    const meeting = await Meeting.aggregate([
        {
            $match: { date: {$gte: new Date()}}
        },
        {
            $sort: { date: 1 }
        },
        {
            $limit: 1
        }
    ]);
  
    res.status(200).json({
      status: 'success',
      results: meeting.length,
      data: {
        meeting
      }
    });
  });

// exports.getAllMeetings = catchAsync(async (req, res, next) => {
//     if(!req.query.sort) req.query.sort = 'date';
//         // EXECUTE QUERY
//         const features = new APIFeatures(Meeting.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate(0);
//         const meetings = await features.query;

//         // SEND RESPONSE
//         res.status(200).json({
//             status: 'success',
//             results: meetings.length,
//             data: {
//                 meetings
//             }
//         });
// });
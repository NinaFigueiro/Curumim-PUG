const Meeting = require('./../models/meetingModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

// ONLY IF USING HANDLER FACTORY
// exports.getMeeting = factory.getOne(Meeting);
// exports.getAllMeetings = factory.getAll(Meeting);
// exports.createMeeting = factory.createOne(Meeting);
// exports.updateMeeting = factory.updateOne(Meeting);
// exports.deleteMeeting = factory.deleteOne(Meeting);
// 

exports.getMeetingsPerMonth = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
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
        data: {
            plan
        }
    });
});
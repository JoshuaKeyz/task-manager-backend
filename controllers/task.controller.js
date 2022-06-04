const { default: mongoose } = require("mongoose");
const asyncHandler = require("../middlewares/async-handler");
const TaskSchema = require("../models/TaskSchema");
const ErrorResponse = require("../utils/error-response");

exports.createTask = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    const owner = req.user.id;
    const task = await TaskSchema.create({owner, name, description});
    
    res.status(200).json({
        success: true,
        task
    })
});

exports.deleteTask = asyncHandler(async (req, res, next) => {
    const taskId = req.params.id.trim();
    const owner = req.user.id;

    console.log(taskId.length)

    const task = await TaskSchema.findOneAndDelete({_id: taskId, owner})
    if(!task) {
        return next(new ErrorResponse('Task was not found', 404));
    }
    res.status(200).json({
        success: true,
        task: true
    })
});

exports.getTask = asyncHandler(async (req, res, next) => {
    const id = req.params.id.trim();
    const owner = req.user.id;

    const task = await TaskSchema.find({_id: id, owner});
    if(!task) {
        return next(new ErrorResponse('Task was not found'))
    }
    res.status(200).json({
        success: true,
        task
    })
});

exports.getAllTasks = asyncHandler(async (req, res, next) => {
    const owner = req.user.id;
    const reqQuery = {...req.query};

    // Fields to exclude
    const removeFields = ['select', 'sort'];

    // Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])


    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    let tasks = TaskSchema.find({...JSON.parse(queryStr), owner});

    // select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        tasks = tasks.select(fields);
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        tasks = tasks.sort(sortBy)
    } else {
        tasks = tasks.sort('-createdAt')
    }

    // Execute query
    tasks = await tasks
    
    res.status(200).json({
        success: true,
        tasks
    })
});

exports.updateTask = asyncHandler(async (req, res, next) => {
    const {
        name,
        description
    } = req.body;
    const taskId = req.params.id;
    const owner = req.user.id;

    const fieldsToUpdate = { name, description };
    const task = await TaskSchema.findOneAndUpdate({owner, _id: taskId}, fieldsToUpdate, {
        new: true
    })
    if(!task) {
        return next(new ErrorResponse('Task not found', 404));
    }
    res.status(200).json({
        success: true,
        task
    })
});
const express = require('express');
const { getAllTasks, createTask, updateTask, deleteTask, getTask } = require('../controllers/task.controller');
const protect = require('../middlewares/protect.middleware');
const router = express.Router();

router.route('/')
    .get(protect, getAllTasks)
    .post(protect, createTask)
router.route('/:id')
    .get(protect, getTask)
    .put(protect, updateTask)
    .delete(protect, deleteTask)


module.exports = router;
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    owner: {
        type: mongoose.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'name is required']
    },
    description: {
        type: String,
        required: [true, 'description field is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = Tasks = mongoose.model('task', TaskSchema);
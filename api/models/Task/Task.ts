import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'complete', 'in_progress'],
        required: true,
    }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3
    },
    passwordHash: {
        type: String,
        required: true
    }
});

export default mongoose.model('User', schema);
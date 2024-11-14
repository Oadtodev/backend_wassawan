import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: String,
    room: Number,
    rent: Number,
    tel: String,
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

export default mongoose.model('User', userSchema);
import mongoose from 'mongoose';

const billsSchema = new mongoose.Schema({
    room: Number,
    name: String,
    rent: Number,
    usage: {
        water: Number,
        electricity: Number,
    },
    totalAmount: Number,


    createdAt: {
        type: Date,
        default: () =>
            new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    }
});

export default mongoose.model('bills', billsSchema);
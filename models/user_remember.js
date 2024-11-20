import mongoose from 'mongoose';

const user_rememberSchema = new mongoose.Schema({
    name: String,
    room: Number,
    rent: Number,
    tel: String,
    createdAt: {
        type: Date,
        default: () =>
          new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
      }
}
    
);

export default mongoose.model('users_remember', user_rememberSchema);
import mongoose from "mongoose";
//  const Schema=mongoose.Schema;
//  Schema.ObjectId=ObjectId;
const usages_oldSchema = new mongoose.Schema(
  {

  

  
    room: Number,
    newElectricMeter: Number,
    newWaterMeter: Number,
    createdAt: {
      type: Date,
      default: () =>
        new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }),
    },
  }
  // This will automatically add createdAt and updatedAt fields
);

export default mongoose.model("usages_remembers", usages_oldSchema);

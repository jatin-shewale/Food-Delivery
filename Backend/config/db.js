import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://shewalejatin36:9960422316@cluster0.rxzdc.mongodb.net/food-del"
    )
    .then(() => console.log("Connected to MonogoDB Succesfully!!"));
};

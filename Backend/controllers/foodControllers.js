import foodModel from "../models/foodModel.js";
import fs from "fs"

//Add Food Item:

const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
        });

        await food.save();
        res.status(201).json({ message: "Food item added successfully", food });
    } catch (error) {
        console.error("Error adding food item:", error.message);
        res.status(500).json({ message: "Failed to add food item" });
    }
};

//Add Food List:
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.status(200).json({success : true, data : foods})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to get food list" });
    }
}

//Remove Food Item:
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.status(200).json({ message : "Item Deleted Successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message : "Retry, Internal server error"})
    }
}

export {addFood, listFood, removeFood}
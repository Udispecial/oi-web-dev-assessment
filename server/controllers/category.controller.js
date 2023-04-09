import mongoose from "mongoose";
import Category from "../mongodb/models/category.js";

const getAllCategories = async (req, res) => {
  const query = {};
  try {
    const post = await Category.find(query);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createcategory = async (req, res) => {
  try {
    const { name } = req.body;
    // start a new session

    const session = await mongoose.startSession();
    session.startTransaction();

    const newCategory = await Category.create({
      name,
      created_at: new Date().toISOString(),
    });

    session.commitTransaction();

    res
      .status(200)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await Category.findByIdAndUpdate(
      { _id: id },
      {
        name,
        updated_at: new Date().toISOString(),
      }
    );

    res.status(200).json({ message: "Category updated sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoryToDelete = await Category.findById({ _id: id });

    if (!categoryToDelete) throw new Error("category not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    categoryToDelete.deleteOne({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Category deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllCategories, createcategory, updateCategory, deleteCategory };

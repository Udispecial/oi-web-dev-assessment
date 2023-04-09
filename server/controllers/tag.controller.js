import mongoose from "mongoose";
import Tag from "../mongodb/models/tag.js";

const getAllTags = async (req, res) => {
  const query = {};
  try {
    const post = await Tag.find(query);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    // start a new session

    const session = await mongoose.startSession();
    session.startTransaction();

    const newTag = await Tag.create({
      name,
      created_at: new Date().toISOString(),
    });

    session.commitTransaction();

    res.status(200).json({ message: "Tag created successfully", data: newTag });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await Tag.findByIdAndUpdate(
      { _id: id },
      {
        name,
        updated_at: new Date().toISOString(),
      }
    );

    res.status(200).json({ message: "Tag updated sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tagToDelete = await Tag.findById({ _id: id });

    if (!tagToDelete) throw new Error("Tag not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    tagToDelete.deleteOne({ session });
    await session.commitTransaction();

    res.status(200).json({ message: "Tag deleted sucessfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllTags, createTag, updateTag, deleteTag };

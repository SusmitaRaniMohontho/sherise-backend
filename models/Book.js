import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String },
    pdfLink: { type: String, required: true },
  },
  { timestamps: true }
);

const Book = mongoose.models.Book || mongoose.model("Book", bookSchema);
export default Book;
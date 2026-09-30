import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, required: true },
    summary: { type: String, required: true },
    fullContent: { type: String, required: true },
  },
  { timestamps: true }
);

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export default Article;
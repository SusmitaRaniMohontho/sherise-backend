import Article from "../models/Article.js";
import Book from "../models/Book.js";
import Provider from "../models/Provider.js";
import Faq from "../models/Faq.js";

export const globalSearch = async (req, res) => {
  try {
    const query = req.query.q;
    console.log("🔍 Received Search Query:", query);

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required!",
      });
    }

    // Case-insensitive regex for searching
    const searchRegex = new RegExp(query.trim(), "i");

    // Search in all four collections simultaneously
    const [articles, books, providers, faqs] = await Promise.all([
      Article.find({
        $or: [
          { title: searchRegex },
          { summary: searchRegex },
          { category: searchRegex },
        ],
      }),

      Book.find({
        $or: [
          { title: searchRegex },
          { author: searchRegex },
          { category: searchRegex },
          { description: searchRegex },
        ],
      }),

      Provider.find({
        $or: [
          { name: searchRegex },
          { role: searchRegex },
          { tags: searchRegex },
        ],
      }),

      Faq.find({
        $or: [
          { question: searchRegex },
          { answer: searchRegex },
          { category: searchRegex },
        ],
      }),
    ]);

    // Format and combine all results into a single array with a 'type' field
    const formattedResults = [
      ...articles.map((item) => ({
        ...item.toObject(),
        type: "Article",
      })),

      ...books.map((item) => ({
        ...item.toObject(),
        type: "Book",
      })),

      ...providers.map((item) => ({
        ...item.toObject(),
        type: "Provider",
      })),

      ...faqs.map((item) => ({
        ...item.toObject(),
        type: "FAQ",
      })),
    ];

    // Send response back to frontend
    return res.status(200).json({
      success: true,
      query,
      results: formattedResults,
    });
  } catch (error) {
    console.error("❌ Global search error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during global search",
      error: error.message,
    });
  }
};
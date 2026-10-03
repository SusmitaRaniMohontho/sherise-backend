import Faq from "../models/Faq.js";


// ==========================================
// Fetch FAQs from Database
// ==========================================

export const getFaqs = async (req, res) => {

  try {

    // MongoDB theke sob FAQ niye asbe
    const faqs = await Faq.find();

    // FAQ frontend e pathabe
    res.status(200).json({
      success: true,
      data: faqs,
    });

  } catch (error) {

    // Jodi database/server error hoy
    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
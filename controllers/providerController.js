import Provider from "../models/Provider.js";

// ডাটাবেস থেকে সব প্রভাইডার নিয়ে আসার এপিআই
export const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    res.status(200).json(providers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
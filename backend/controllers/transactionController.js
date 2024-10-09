import Transaction from "../models/Transaction.js";

export const transactions = async (req, res) => {
  try {
    const { page = 1, perPage = 10, search = "", month } = req.query;

    // Regex to search by title, description, or price
    const regex = new RegExp(search, "i");

    // Convert the month input to a numerical value (1-12)
    const monthIndex = month ? parseInt(month) : null;

    let query = {
      $or: [
        { title: regex },
        { description: regex },
        { price: parseFloat(search) || 0 },
      ]
    };

    // Add month filtering if the month parameter is provided
    if (monthIndex) {
      const currentYear = new Date().getFullYear(); // Use current year or a fixed year
      const startDate = new Date(currentYear, monthIndex - 1, 1);
      const endDate = new Date(currentYear, monthIndex, 0);
      query.dateOfSale = { $gte: startDate, $lte: endDate };
    }

    // Fetch transactions with pagination and search
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage))
      .exec();

    // Count the total number of transactions for pagination
    const totalTransactions = await Transaction.countDocuments(query);

    res.status(200).json({
      transactions,
      totalPages: Math.ceil(totalTransactions / perPage),
      currentPage: page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

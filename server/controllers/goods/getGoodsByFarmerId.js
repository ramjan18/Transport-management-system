const Goods = require("../../models/goods");

// Get Goods by Farmer ID
const getGoodsByFarmer = async (req, res) => {
  try {
    const { id } = req.params; // get farmerId from URL params

    const goods = await Goods.find({ farmer: id }).populate(
      "farmer",
      "name email"
    ); // optionally populate farmer data

    res.status(200).json({
      success: true,
      goods,
    });
  } catch (error) {
    console.error("Error fetching goods by farmer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch goods for the farmer",
    });
  }
};


module.exports = { getGoodsByFarmer };
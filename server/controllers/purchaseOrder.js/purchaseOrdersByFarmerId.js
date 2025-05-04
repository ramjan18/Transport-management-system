const Purchase = require("../../models/purchaseOrder"); // Your Purchase model
const Goods = require("../../models/goods"); // Your Goods model

// Controller to fetch purchase orders by farmer ID
const getPurchaseOrdersByFarmer = async (req, res) => {
  try {
    const { id } = req.params; // Assuming farmerId is passed as a route parameter

    console.log(id);
    // Step 1: Find all goods associated with the farmer
    const goods = await Goods.find({ farmer: id }).select("_id");

    if (!goods.length) {
      return res
        .status(404)
        .json({ message: "No goods found for this farmer." });
    }

    // Step 2: Find purchase orders that reference the goods
    const purchaseOrders = await Purchase.find({
      goods: { $in: goods.map((g) => g._id) },
    })
      .populate({
        path: "goods",
        select: "name quantity pricePerUnit",
        populate: {
          path: "farmer",
          select: "name phone", // You can add more fields if needed
        },
      })
      .populate("trader", "name phone")
      .sort({ createdAt: -1 });

    // If no purchase orders found for this farmer
    if (!purchaseOrders.length) {
      return res
        .status(404)
        .json({ message: "No purchase orders found for this farmer." });
    }

    // Return the purchase orders
    return res.status(200).json({
      message: "Purchase orders fetched successfully.",
      purchaseOrders,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

module.exports = { getPurchaseOrdersByFarmer };

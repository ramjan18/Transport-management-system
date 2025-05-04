// controllers/purchaseOrderController.js

const Purchase = require("../../models/purchaseOrder");
const Goods = require("../../models/goods");
const User = require("../../models/user");

// Create a new purchase order
const createPurchaseOrder = async (req, res) => {
  try {
    const {
      goods,
      quantity,
      pricePerUnit,
      deliveryAddress,
      deliveryDate,
      trader,
    } = req.body;

    // Validate required fields
    if (
      !goods ||
      !quantity ||
      !pricePerUnit ||
      !deliveryAddress ||
      !deliveryDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the goods exist
    const goodsDetails = await Goods.findById(goods);
    if (!goodsDetails) {
      return res.status(404).json({ message: "Goods not found." });
    }

    // Calculate total amount
    const totalAmount = quantity * pricePerUnit;

    const newPurchaseOrder = new Purchase({
      // trader: req.user._id, // Assuming the user is authenticated as the trader
      goods,
      trader,
      quantity,
      pricePerUnit,
      totalAmount,
      status: "pending", // Default status
      deliveryAddress,
      deliveryDate,
    });

    await newPurchaseOrder.save();

    res.status(201).json({
      message: "Purchase order created successfully.",
      purchaseOrder: newPurchaseOrder,
    });
  } catch (error) {
    console.error("Create Purchase Order error:", error);
    res
      .status(500)
      .json({ message: "Server error while creating purchase order." });
  }
};

// Get all purchase orders for a trader
const getAllPurchaseOrders = async (req, res) => {
  try {
    const {id} = req.params;
    console.log(id);
   const purchaseOrders = await Purchase.find({ trader: id })
     .populate({
       path: "goods",
       select: "name quantity pricePerUnit farmer", // must select farmer here
       populate: {
         path: "farmer",
         select: "name phone", // what fields you want from Farmer(User)
       },
     })
     .populate("trader", "name phone")
     .sort({ createdAt: -1 });

     console.log(purchaseOrders);

    res.status(200).json({
      message: "All purchase orders fetched successfully.",
      purchaseOrders,
    });
  } catch (error) {
    console.error("Get All Purchase Orders error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching purchase orders." });
  }
};

// Get a specific purchase order by ID
const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseOrder = await Purchase.findById(id)
      .populate("goods", "name quantity pricePerUnit")
      .populate("trader", "name email phone"); // Populate trader details

    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase order not found." });
    }

    res.status(200).json({
      message: "Purchase order fetched successfully.",
      purchaseOrder,
    });
  } catch (error) {
    console.error("Get Purchase Order by ID error:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching purchase order." });
  }
};

// Update the status of a purchase order
const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryAddress, deliveryDate, quantity, pricePerUnit } =
      req.body;

    const purchaseOrder = await Purchase.findById(id);
    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase order not found." });
    }

    // Update fields if provided
    if (status) purchaseOrder.status = status;
    if (deliveryAddress) purchaseOrder.deliveryAddress = deliveryAddress;
    if (deliveryDate) purchaseOrder.deliveryDate = new Date(deliveryDate);
    if (quantity) purchaseOrder.quantity = quantity;
    if (pricePerUnit) purchaseOrder.pricePerUnit = pricePerUnit;

    // Also update totalAmount if quantity or pricePerUnit changes
    if (quantity || pricePerUnit) {
      purchaseOrder.totalAmount =
        purchaseOrder.quantity * purchaseOrder.pricePerUnit;
    }

    const updatedPurchaseOrder = await purchaseOrder.save();

    res.status(200).json({
      message: "Purchase order updated successfully.",
      purchaseOrder: updatedPurchaseOrder,
    });
  } catch (error) {
    console.error("Update Purchase Order error:", error);
    res
      .status(500)
      .json({ message: "Server error while updating purchase order." });
  }
};


// Delete a purchase order
const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const purchaseOrder = await Purchase.findByIdAndDelete(id);

    if (!purchaseOrder) {
      return res.status(404).json({ message: "Purchase order not found." });
    }

    res.status(200).json({ message: "Purchase order deleted successfully." });
  } catch (error) {
    console.error("Delete Purchase Order error:", error);
    res
      .status(500)
      .json({ message: "Server error while deleting purchase order." });
  }
};


module.exports = {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
};

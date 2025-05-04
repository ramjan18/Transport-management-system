const express = require("express");
const router = express.Router();
const {
  createPurchaseOrder,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  updatePurchaseOrder,
  deletePurchaseOrder,
} = require("../controllers/purchaseOrder.js/purchaseOrderSchema");

const {
  getPurchaseOrdersByFarmer,
} = require("../controllers/purchaseOrder.js/purchaseOrdersByFarmerId");

// Routes for purchase orders
router.get("/getPurchaseOrdersByFarmer/:id", getPurchaseOrdersByFarmer);
router.post("/purchase-orders", createPurchaseOrder); // Create a purchase order
router.get("/trader-purchase-orders/:id", getAllPurchaseOrders); // Get all purchase orders for the logged-in trader
router.get("/purchase-orders/:id", getPurchaseOrderById); // Get purchase order by ID
router.patch("/purchase-orders/:id", updatePurchaseOrder); // Update a purchase order
router.delete("/purchase-orders/:id", deletePurchaseOrder); // Delete a purchase order

module.exports = router;

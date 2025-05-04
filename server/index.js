const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const cors = require("cors");
const { connect } = require("./config/db");

const app = express();

const allowedOrigin = ["http://localhost:5173"];

app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin, // Allow only your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Allow credentials like cookies or authorization headers
  })
);


//---------------connection------------------
connect();

app.get("/api", (req, res) => {
  res.send("app Started");
});

const userRoutes = require("./routes/userRoutes");
const transporterRoutes = require("./routes/transporterRoutes");
const purchaseOrderRoutes = require("./routes/purchaseOrderRoutes");
const goodsRoutes = require("./routes/goodsRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

app.use("/api", userRoutes);
app.use("/api", transporterRoutes);
app.use("/api", purchaseOrderRoutes);
app.use("/api", goodsRoutes);
app.use("/api", bookingRoutes);

app.listen(5000, "0.0.0.0", () => {
  console.log("App is running on http://0.0.0.0:5000");
});

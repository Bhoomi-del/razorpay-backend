const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route for basic status and env var check
app.get("/", (req, res) => {
  res.send({
    message: "Backend running",
    key_id: process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing"
  });
});

// Initialize Razorpay with credentials from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY
});

// Route to create a Razorpay order
app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 9900, // ₹99 in paise
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).send("Error creating order");
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env variables
dotenv.config();

console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
console.log("RAZORPAY_SECRET_KEY:", process.env.RAZORPAY_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Check if keys are present before creating Razorpay instance
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET_KEY) {
  console.error("Missing Razorpay environment variables!");
  process.exit(1);  // Stop the app
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

app.get("/", (req, res) => {
  res.send({
    message: "Backend running",
    key_id: process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing",
  });
});

app.post("/create-order", async (req, res) => {
  try {
    const options = {
      amount: 9900,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Error creating order");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

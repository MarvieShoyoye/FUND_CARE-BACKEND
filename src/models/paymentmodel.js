import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  payment_method: {
    type: String,
    enum: ["credit_card", "paypal", "bank_transfer", "payaza"],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  receipt_url: {
    type: String, // URL to the receipt PDF or some other form of payment proof
  },
});

paymentSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

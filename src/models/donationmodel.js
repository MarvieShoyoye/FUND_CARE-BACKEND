import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    frequency: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    }, // Only applicable if recurring
    transactionFee: {
      type: Number,
      required: true,
    },
    netAmount: {
      type: Number,
      required: true,
    }, // amount after transaction fees
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.pre("save", function (next) {
  this.netAmount = this.amount - this.transactionFee;
  next();
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;

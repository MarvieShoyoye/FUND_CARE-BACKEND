import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    walletBalance: {
      type: Number,
      default: 0,
    },
    accountDetails: {
      number: {
        type: String,
        default: "",
      },
      bank: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserWalletModel = mongoose.model("User-Wallet", walletSchema);

export default UserWalletModel;

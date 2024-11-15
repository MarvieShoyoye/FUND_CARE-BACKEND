import Donation from "../models/donationmodel.js";
import { generateReceipt } from "../utility/receiptgenerator.js"; // Assume we have a utility to generate tax-compliant receipts
import { calculateTransactionFee } from "../utility/transactionfee.js";

// CREATE Donation
export const createDonation = async (req, res, next) => {
  try {
    const { donorId, amount, isRecurring, frequency, projectId, campaignId } =
      req.body;

    // Ensure that either projectId or campaignId is provided, not both
    if (!projectId && !campaignId) {
      return res.status(400).json({
        success: false,
        message: "Either projectId or campaignId must be specified.",
      });
    }
    if (projectId && campaignId) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot specify both projectId and campaignId for a single donation.",
      });
    }

    const transactionFee = calculateTransactionFee(amount);
    const donation = new Donation({
      donorId,
      amount,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
      transactionFee,
      netAmount: amount - transactionFee,
      projectId: projectId || undefined,
      campaignId: campaignId || undefined,
    });

    await donation.save();

    // Generate receipt after successful donation
    const receipt = await generateReceipt(donation);
    res.status(201).json({ success: true, donation, receipt });
  } catch (error) {
    next(error);
  }
};

// READ Donations (all donations for an authenticated user)
export const getDonations = async (req, res, next) => {
  try {
    const { projectId, campaignId } = req.query;
    const filter = { donorId: req.user._id };

    if (projectId) {
      filter.projectId = projectId;
    } else if (campaignId) {
      filter.campaignId = campaignId;
    }

    const donations = await Donation.find(filter);
    res.status(200).json({ success: true, donations });
  } catch (error) {
    next(error);
  }
};


export const getDonationById = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error); // Passes the error to error-handling middleware
  }
};


export const getAllDonations = async (req, res, next) => {
  try {
    const { projectId, campaignId } = req.query;
    const filter = {};

    if (projectId) {
      filter.projectId = projectId;
    } else if (campaignId) {
      filter.campaignId = campaignId;
    }

    const donations = await Donation.find(filter);
    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error); // Passes the error to error-handling middleware
  }
};

// UPDATE Donation (e.g., updating payment status)
export const updateDonationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!donation)
      return res
        .status(404)
        .json({ success: false, message: "Donation not found" });

    res.status(200).json({ success: true, donation });
  } catch (error) {
    next(error);
  }
};

// DELETE Donation (for administrative purposes)
export const deleteDonation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByIdAndDelete(id);

    if (!donation)
      return res
        .status(404)
        .json({ success: false, message: "Donation not found" });

    res
      .status(200)
      .json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    next(error);
  }
};

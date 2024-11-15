import Project from "../models/Project.js";
import Donation from "../models/Donation.js";

// Calculate and display overall impact metrics
export const getOverallImpactMetrics = async (req, res, next) => {
  try {
    const totalFunds = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$netAmount" } } },
    ]);

    const activeDonors = await Donation.distinct("donorId").countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalFundsRaised: totalFunds[0]?.total || 0,
        numberOfActiveDonors: activeDonors,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get project-specific metrics
export const getProjectMetrics = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const donations = await Donation.find({ projectId });
    const totalFunds = donations.reduce(
      (acc, donation) => acc + donation.netAmount,
      0
    );
    const donorCount = donations.length;

    res.status(200).json({
      success: true,
      data: {
        projectId,
        projectTitle: project.title,
        totalFundsRaised: totalFunds,
        numberOfDonors: donorCount,
        targetAmount: project.targetAmount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Update project-specific metrics if needed
export const updateProjectMetrics = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { targetAmount } = req.body;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { targetAmount },
      { new: true }
    );
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Project metrics updated",
        data: project,
      });
  } catch (error) {
    next(error);
  }
};

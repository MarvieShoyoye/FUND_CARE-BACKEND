import { Campaign } from "../models/campaignmodel.js";

//CREATE A CAMPAIGNS
export const createCampaign = async (req, res, next) => {
  try {
    const { title, description, goalAmount, timeline, category, campaignType } =
      req.body;

    // Ensure correct ownership field based on campaignType
    let campaignData = {
      title,
      description,
      goalAmount,
      timeline,
      category,
      campaignType,
    };

    if (campaignType === "personal") {
      campaignData.createdBy = req.user._id;
    } else if (campaignType === "organization") {
      if (!req.user.organizationId) {
        return res.status(403).json({
          message: "User not authorized to create organization campaigns",
        });
      }
      campaignData.organizationId = req.user.organizationId;
    } else {
      return res.status(400).json({ message: "Invalid campaign type" });
    }

    const newCampaign = new Campaign(campaignData);
    await newCampaign.save();
    res.status(201).json({
      message: "Campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    next(error);
  }
};

//GET CAMPAIGNS
export const getCampaigns = async (req, res, next) => {
  try {
    const { campaignType } = req.body; // Using req.body instead of req.query
    const query = {};

    if (campaignType) {
      query.campaignType = campaignType;
    }

    const campaigns = await Campaign.find(query).populate(
      campaignType === "personal" ? "createdBy" : "organizationId",
      "name"
    );

    res.status(200).json({ campaigns });
  } catch (error) {
    next(error);
  }
};

//GET CAMPAIGNS BY ID
export const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id).populate("createdBy", "name");

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ campaign });
  } catch (error) {
    next(error);
  }
};


//UPDATE CAMPAIGNS
export const updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      goalAmount,
      timeline,
      category,
      campaignType, // Adding campaign-specific fields if applicable
    } = req.body;

    // Find the campaign by ID
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Update campaign fields
    campaign.title = title || campaign.title;
    campaign.description = description || campaign.description;
    campaign.category = category || campaign.category;
    campaign.goalAmount = goalAmount || campaign.goalAmount;
    campaign.timeline = timeline || campaign.timeline;
    campaign.campaignType = campaignType || campaign.campaignType; // Additional field for campaign type

    await campaign.save();
    res
      .status(200)
      .json({ message: "Campaign updated successfully", campaign });
  } catch (error) {
    next(error);
  }
};

//DELETE CAMPAIGN
export const deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByIdAndDelete(id);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    next(error);
  }
};

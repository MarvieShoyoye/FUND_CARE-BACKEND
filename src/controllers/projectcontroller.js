// controllers/projectController.js
import Project from "../models/projectmodel.js";
import Challenge from "../models/challengemodel.js";
import UserModel from "../models/usermodel.js";
import errorResponse from "../utility/error.js";



//CREATE PROJECT BY INDIVIDUALS, ORGANISATIONS CHARITIES ETC
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      fundingGoal,
      timeline,
      impactObjectives,
      category,
    } = req.body;

    // Assume `req.user` contains the authenticated user's info, including their ID
    const createdBy = req.user.id; // Set this based on your authentication middleware

    // Create a new project instance
    const newProject = new Project({
      title,
      description,
      fundingGoal,
      timeline,
      impactObjectives,
      category,
      createdBy, // Associate this project with the user who created it
    });

    // Save the project
    await newProject.save();

    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    next(error);
  }
};


export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("createdBy", "name");
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("createdBy", "name");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
};


export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      category,
      fundingGoal,
      timeline,
      impactObjectives,
      images,
      video,
    } = req.body;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update project fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.category = category || project.category;
    project.fundingGoal = fundingGoal || project.fundingGoal;
    project.timeline = timeline || project.timeline;
    project.impactObjectives = impactObjectives || project.impactObjectives;
    project.images = images || project.images;
    project.video = video || project.video;

    await project.save();
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    next(error);
  }
};


export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};


export const createChallenge = async (req, res, next) => {
  try {
    const { title, description, duration, projectId } = req.body;

    // Calculate end time based on duration
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + duration);

    const challenge = await Challenge.create({
      title,
      description,
      duration,
      endTime,
      projectId,
    });

    res
      .status(201)
      .json({ message: "Challenge created successfully", challenge });
  } catch (error) {
    next(error);
  }
};



export const getChallengesByProjectId = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const challenges = await Challenge.find({ projectId }).populate(
      "projectId",
      "title description"
    );

    res.status(200).json({ challenges });
  } catch (error) {
    next(error);
  }
};

// Get all challenges
export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find(); // Fetch all challenges
    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    console.error("Error fetching challenges:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch challenges" });
  }
};

// Get a challenge by ID
export const getChallengeById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid challenge ID" });
  }

  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    console.error(`Error fetching challenge with ID ${id}:`, error.message);
    res.status(500).json({ success: false, message: "Failed to fetch the challenge" });
  }
};

// Delete a challenge
 export const deleteChallenge = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid challenge ID" });
  }

  try {
    const challenge = await Challenge.findByIdAndDelete(id);

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    res.status(200).json({ success: true, message: "Challenge deleted successfully" });
  } catch (error) {
    console.error(`Error deleting challenge with ID ${id}:`, error.message);
    res.status(500).json({ success: false, message: "Failed to delete the challenge" });
  }
};


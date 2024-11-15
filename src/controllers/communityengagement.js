import HealthNews from "../models/communityenagagement.js";

// Create a new health news article
export const createHealthNews = async (req, res, next) => {
  try {
    const { title, content, source, tags } = req.body;
    const newHealthNews = new HealthNews({
      title,
      content,
      source,
      tags,
      userId: req.user._id, // Assuming req.user is set after authentication
    });

    const savedNews = await newHealthNews.save();
    res.status(201).json({ success: true, data: savedNews });
  } catch (error) {
    next(error);
  }
};


// Get all health news articles
export const getAllNewsArticles = async (req, res, next) => {
  try {
    const newsArticles = await HealthNews.find().sort({ publishedDate: -1 });
    res.status(200).json({ success: true, data: newsArticles });
  } catch (error) {
    next(error);
  }
};

// Get a single news article by ID
export const getNewsArticleById = async (req, res, next) => {
  try {
    const newsArticle = await HealthNews.findById(req.params.id);

    if (!newsArticle) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.status(200).json({ success: true, data: newsArticle });
  } catch (error) {
    next(error);
  }
};

// Update a health news article
export const updateNewsArticle = async (req, res, next) => {
  try {
    const { title, content, source, tags } = req.body;
    const newsArticle = await HealthNews.findByIdAndUpdate(
      req.params.id,
      { title, content, source, tags },
      { new: true, runValidators: true }
    );

    if (!newsArticle) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.status(200).json({ success: true, data: newsArticle });
  } catch (error) {
    next(error);
  }
};

// Delete a health news article
export const deleteNewsArticle = async (req, res, next) => {
  try {
    const newsArticle = await HealthNews.findByIdAndDelete(req.params.id);

    if (!newsArticle) {
      return res.status(404).json({ success: false, message: 'News article not found' });
    }

    res.status(200).json({ success: true, message: 'News article deleted' });
  } catch (error) {
    next(error);
  }
};


// Add a comment to a health news article
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const news = await HealthNews.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'Health news article not found' });
    }

    const newComment = new Comment({
      userId: req.user._id,
      text,
      healthNewsId: req.params.id,
    });

    await newComment.save();

    // Add the comment to the health news article
    news.comments.push(newComment._id);
    await news.save();

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    next(error);
  }
};

// Get all comments for a health news article
export const getComments = async (req, res, next) => {
  try {
    const news = await HealthNews.findById(req.params.id).populate('comments');

    if (!news) {
      return res.status(404).json({ success: false, message: 'Health news article not found' });
    }

    res.status(200).json({ success: true, comments: news.comments });
  } catch (error) {
    next(error);
  }
};

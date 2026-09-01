import Testimonial from "../models/Testimonial.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";

// Default featured testimonials
const DEFAULT_TESTIMONIALS = [
  {
    _id: "default-1",
    name: "Rahul Sharma",
    title: "Senior Software Engineer",
    image: "",
    feedback:
      "This AI resume builder completely revolutionized my job hunt. The ATS keyword optimization matched my skills with job requirements, and I received 4 interview calls in just 2 weeks!",
    rating: 5,
    createdAt: new Date("2026-08-15"),
  },
  {
    _id: "default-2",
    name: "Priya Verma",
    title: "Product Designer",
    image: "",
    feedback:
      "The Minimal Image template is gorgeously designed! The AI professional summary generator wrote a punchy, crisp opening hook that impressed hiring managers.",
    rating: 5,
    createdAt: new Date("2026-08-18"),
  },
  {
    _id: "default-3",
    name: "Aman Gupta",
    title: "Senior Data Analyst",
    image: "",
    feedback:
      "Exporting clean vector PDFs and Word files without messy page breaks or ugly watermarks is a lifesaver. Easily the best resume tool I have ever used.",
    rating: 5,
    createdAt: new Date("2026-08-20"),
  },
  {
    _id: "default-4",
    name: "Neha Singh",
    title: "Frontend Developer",
    image: "",
    feedback:
      "I uploaded my old clunky 3-page CV, and the AI parsed it into a sleek single-page ATS resume in under a minute. Got hired at an international startup!",
    rating: 5,
    createdAt: new Date("2026-08-22"),
  },
];

/**
 * POST /api/testimonials
 * Create a new user feedback / testimonial
 */
export const addTestimonial = async (req, res) => {
  try {
    const userId = req.userId;
    const { feedback, rating = 5, title: customTitle } = req.body;

    if (!feedback || feedback.trim().length < 5) {
      return res.status(400).json({
        message: "Please provide a feedback description (at least 5 characters).",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    // Auto-detect title from user profile or latest resume if not explicitly sent
    let detectedTitle = customTitle || user.profession;
    if (!detectedTitle) {
      const latestResume = await Resume.findOne({ userId }).sort({ updatedAt: -1 });
      detectedTitle = latestResume?.personal_info?.profession || "Verified Professional";
    }

    const newTestimonial = await Testimonial.create({
      userId,
      name: user.name || "Anonymous",
      image: user.image || "",
      title: detectedTitle || "Verified Professional",
      feedback: feedback.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      isApproved: true,
    });

    return res.status(201).json({
      message: "Thank you! Your feedback has been added to our live testimonials.",
      testimonial: newTestimonial,
    });
  } catch (error) {
    console.error("Add Testimonial Error:", error);
    return res.status(400).json({
      message: error.message || "Failed to submit feedback.",
    });
  }
};

/**
 * GET /api/testimonials
 * Get all testimonials for live infinite marquee
 */
export const getTestimonials = async (req, res) => {
  try {
    const dbTestimonials = await Testimonial.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    // Merge real database testimonials with default seed testimonials
    const allTestimonials = [...dbTestimonials, ...DEFAULT_TESTIMONIALS];

    return res.status(200).json({
      testimonials: allTestimonials,
    });
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    return res.status(200).json({
      testimonials: DEFAULT_TESTIMONIALS,
    });
  }
};

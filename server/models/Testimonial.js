import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "Verified Professional",
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

export default Testimonial;

import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  image: { type: String },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
feedbackSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});
const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;

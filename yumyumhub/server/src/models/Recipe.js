import mongoose, { Schema } from 'mongoose';

const recipeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    ingredients: { type: String, required: true },
    servings: { type: Number, required: true },
    time: { type: String, required: true },
    likes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export const Recipe = mongoose.model('Recipe', recipeSchema);

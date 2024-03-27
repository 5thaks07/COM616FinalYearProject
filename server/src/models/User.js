import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: { type: String },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: true,
        },
        password: { type: String, required: [true, 'password is required'] },
        admin: { type: Boolean, default: false },
        token: { type: String },
        uploadedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
        savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
    },
    { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

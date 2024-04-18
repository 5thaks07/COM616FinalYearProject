import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema(
  {
    // chat members
    members: [{ type: String }],
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);

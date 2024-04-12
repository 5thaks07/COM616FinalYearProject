import mongoose, { Schema } from 'mongoose';

const chatSchema = new Schema(
  {
    // chat members
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export const Chat = mongoose.model('Chat', chatSchema);

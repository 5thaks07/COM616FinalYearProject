// model for messages

import mongoose, { Schema } from 'mongoose';

const messageSchema = new Schema(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat' },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);

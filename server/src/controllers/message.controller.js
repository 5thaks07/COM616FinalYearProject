import { Message } from '../models/Message.js';

// createMessage

export const createMessage = async (req, res) => {
  const senderId = req.user._id;
  const { chatId, text } = req.body;

console.log(req.body);
console.log(req.user);
  try {
    const newMessage = new Message({
      chatId,
      senderId,
      text,
    });

    if (!chatId || !senderId || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const message = await newMessage.save();
    res.status(201).json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// getMessages

export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });

    res.status(200).json({ messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

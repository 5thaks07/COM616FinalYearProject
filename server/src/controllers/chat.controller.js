import { Chat } from '../models/Chat.js';

// createChat

export const createChat = async (req, res) => {
  const firstUserId = req.user._id;
  const { secondUserId } = req.params;

  try {
    let chat;

    chat = await Chat.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });

    if (chat) {
      return res.status(200).json({ chat });
    }

    const newChat = new Chat({
      members: [firstUserId, secondUserId],
    });

    chat = await newChat.save();
    res.status(201).json({ chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// find user chats

export const findUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({ members: { $in: userId } });

    res.status(200).json({ chats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//findChat

export const findChat = async (req, res) => {
  const { firstUserId, secondUserId } = req.params;

  try {
    const chat = await Chat.findOne({
      members: { $all: [firstUserId, secondUserId] },
    });

    res.status(200).json({ chat });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

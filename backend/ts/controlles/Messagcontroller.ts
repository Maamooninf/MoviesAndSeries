import { Request, Response } from "express";
import { Server } from "socket.io";
import { MessageModel } from "../modals/Messages.js";
const creatMessage = async (req: Request, res: Response) => {
  try {
    const newcon = new MessageModel(req.body);

    const saved = await newcon.save();
    const io: Server = req.app.get("socketio");
    console.log();
    io.to(req.params.reciver).emit("newMessage", saved);
    return res.status(200).send(saved);
  } catch (err) {
    return res.status(500).send(err);
  }
};

const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find({ conver: req.params.converId });
    return res.status(200).send(messages);
  } catch (err) {
    return res.status(500).send(err);
  }
};
export { creatMessage, getMessages };

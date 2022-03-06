import { Request, Response } from "express";
import { Server } from "socket.io";
import { ListModel } from "../modals/list.js";
const Creatlist = async (req: Request, res: Response) => {
  try {
    if (req.user.isAdmin) {
      const newList = new ListModel(req.body);

      const savedList = await newList.save();
      return res.status(201).json(savedList);
    } else {
      return res.status(403).json("You are not allowed!");
    }
  } catch (err: any) {
    return res.status(500).json(err);
  }
};

const Deletelist = async (req: Request, res: Response) => {
  try {
    if (req.user.isAdmin) {
      await ListModel.findByIdAndDelete(req.params.id);
      return res.status(201).json("The list has been delete...");
    } else {
      return res.status(402).json("You are not allowed!");
    }
  } catch (err: any) {
    return res.status(500).json(err);
  }
};

const GetList = async (req: Request, res: Response) => {
  try {
    const io: Server = req.app.get("socketio");
    io.emit("message", {
      message: "from get lists",
    });
    let list = [];
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    if (typeQuery) {
      if (genreQuery) {
        //  console.log('second')
        list = await ListModel.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
          {
            $lookup: {
              from: "movies",
              localField: "content",
              foreignField: "_id",
              as: "content",
            },
          },
        ]);
      } else {
        //  console.log('third')
        list = await ListModel.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery } },
          {
            $lookup: {
              from: "movies",
              localField: "content",
              foreignField: "_id",
              as: "content",
            },
          },
        ]);
      }
    } else {
      if (genreQuery) {
        //  console.log('fourth')
        list = await ListModel.aggregate([
          { $sample: { size: 10 } },
          { $match: { genre: genreQuery } },
          {
            $lookup: {
              from: "movies",
              localField: "content",
              foreignField: "_id",
              as: "content",
            },
          },
        ]);
      } else {
        console.log("hii");
        list = await ListModel.find();
      }
    }
    console.log(list);
    return res.status(200).json(list);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export { Creatlist, Deletelist, GetList };

import { Request, Response } from "express";

import { MovieModel } from "../modals/movie.js";

import { CommentModel } from "../modals/comments.js";
import { Server } from "socket.io";
const CreateMovie = async (req: Request, res: Response) => {
  try {
    if (req.user.isAdmin) {
      const newMovie = new MovieModel(req.body);
      newMovie.id = newMovie._id;
      const savedMovie = await newMovie.save();
      return res.status(201).send(savedMovie);
    } else {
      return res.status(403).send({ msg: "You are not allowed!" });
    }
  } catch (err: any) {
    return res.status(403).send(err);
  }
};
const UpdateMovie = async (req: Request, res: Response) => {
  try {
    if (req.user.isAdmin) {
      const updatedMovie = await MovieModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res.status(200).send(updatedMovie);
    } else {
      return res.status(403).send({ msg: "You are not allowed!" });
    }
  } catch (err: any) {
    return res.status(403).send(err);
  }
};
const DeleteMovie = async (req: Request, res: Response) => {
  try {
    if (req.user.isAdmin) {
      await MovieModel.findByIdAndDelete(req.params.id);
      return res.status(200).json("The movie has been deleted...");
    } else {
      return res.status(403).json("You are not allowed!");
    }
  } catch (err: any) {
    return res.status(403).json(err);
  }
};
const FindMovie = async (req: Request, res: Response) => {
  try {
    MovieModel.findOne({ _id: req.params.id })
      .lean()
      .exec((err, result) => {
        if (err) {
          return res.status(404).send(err);
        } else {
          return res.status(200).send(result);
        }
      });
  } catch (err: any) {
    return res.status(500).send(err);
  }
};
const FindRandomMovie = async (req: Request, res: Response) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await MovieModel.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },
      ]);
    } else {
      movie = await MovieModel.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "comments",
          },
        },
      ]);
    }
    return res.status(200).send(movie);
  } catch (err: any) {
    return res.status(500).send(err);
  }
};
const FindAll = async (req: Request, res: Response) => {
  try {
    if (req.user.isAdmin) {
      MovieModel.find()
        .lean()

        .exec((err, result) => {
          if (err) {
            return res.status(404).send(err);
          } else {
            return res.status(200).send(result);
          }
        });
    } else {
      return res.status(403).send({ msg: "You are not allowed!" });
    }
  } catch (err: any) {
    return res.status(500).send(err);
  }
};
const likeMovie = async (req: Request, res: Response) => {
  try {
    MovieModel.findOneAndUpdate(
      { _id: req.body.movieId },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    )
      .lean()
      .exec((err, result) => {
        if (err) {
          return res.status(404).send(err);
        } else {
          return res.status(200).send(result);
        }
      });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const unlikeMovie = async (req: Request, res: Response) => {
  try {
    const updatedMovie = await MovieModel.findOneAndUpdate(
      { _id: req.body.movieId },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    return res.status(200).send(updatedMovie);
  } catch (err) {
    return res.status(500).send(err);
  }
};

const Addcomment = async (req: Request, res: Response) => {
  try {
    const comment = new CommentModel(req.body);
    comment.author = req.user._id;
    const newcomment = await comment.save();
    if (newcomment) {
      var comid = newcomment._id;
      const movie = await MovieModel.findByIdAndUpdate(
        req.body.movieId,
        {
          $push: {
            comments: comid,
          },
        },
        { new: true }
      );
      return res.status(200).send(movie);
    } else {
      return res.status(500).send({ msg: "some thing went wrong" });
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

const Addreply = async (req: Request, res: Response) => {
  try {
    const reply = new CommentModel(req.body);
    reply.author = req.user._id;
    const replyComment = await reply.save();
    if (replyComment) {
      const replyId = replyComment._id;
      const ParentComment = await CommentModel.findByIdAndUpdate(
        req.params.commentId,
        {
          $push: {
            comments: replyId,
          },
        },
        { new: true }
      );
      if (ParentComment) {
        MovieModel.findOne({ _id: req.params.movieId })
          .lean()
          .exec((err, result) => {
            if (err) {
              return res.status(404).send(err);
            } else {
              const io: Server = req.app.get("socketio");
              io.emit("replyAdded", result);
              return res.status(200).send(result);
            }
          });
      } else return res.status(500).send("some thing went wrong");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export {
  CreateMovie,
  UpdateMovie,
  DeleteMovie,
  FindMovie,
  FindRandomMovie,
  FindAll,
  likeMovie,
  unlikeMovie,
  Addcomment,
  Addreply,
};
/*

*/

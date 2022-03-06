import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserModel } from "../modals/User.js";
import { geneerror } from "../errors/userrerrors.js";
import { User } from "../interfaces/userinterface.js";

const Signincont = async (req: Request, res: Response) => {
  try {
    const user = req.body as User;

    let result = (await UserModel.findOne({ email: user.email })) as User;
    if (!result) {
      return res.status(404).send({ msg: "user dose not exits" });
    } else {
      if (user.password === undefined) user.password = "";
      const match = await bcrypt.compare(user.password, result.password);

      if (match && user.password) {
        jwt.sign(
          { _id: result._id, isAdmin: result.isAdmin },
          "somesecret",
          { expiresIn: "24h" },
          (err, token) => {
            if (err) {
              return res.status(402).send({ msg: "error in token" });
            } else {
              return res
                .status(200)
                .send({
                  token,
                  nami: result ? result.name : "",
                  _id: result._id,
                });
            }
          }
        );
      } else {
        return res.status(402).send({ msg: "user not found" });
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

const Signupcont = (req: Request, res: Response) => {
  try {
    var { name, password, confirmpass, email, isAdmin } = req.body;

    var errpass: string = "";
    var errex: string = "";
    if (password !== confirmpass) {
      errpass = "password and confirme are not the same";
      console.log(errpass);
    }
    UserModel.findOne({ email: email })
      .then((saved) => {
        if (saved) {
          errex = "user already exists";
        }
        bcrypt.hash(password, 10, function (err, hashv) {
          if (err) {
            return res.status(402).send({ msg: err });
          } else {
            const user = new UserModel({ name, email, password, isAdmin });

            user.tepassword = password;
            user
              .validate()

              .then(() => {
                if (errex !== "" || errpass !== "") {
                  return res.status(402).send({ errex, errpass });
                } else {
                  user.password = hashv;
                  user.tepassword = "";
                  user
                    .save()
                    .then(() => {
                      return res
                        .status(200)
                        .send({ msg: "Successfully sign up", resu: user });
                    })
                    .catch((err) => {
                      let fields = geneerror(err, "path");
                      let messages = geneerror(err, "message");
                      return res.status(402).send({ fields, messages });
                    });
                }
              })
              .catch((err: any) => {
                let fields = geneerror(err, "path");
                let messages = geneerror(err, "message");
                return res
                  .status(402)
                  .send({ fields, messages, errpass, errex });
              });
          }
        });
      })

      .catch((err) => {
        return res.status(500).send({ msg: "error in network" });
      });
  } catch (err) {
    return res.status(402).send(err);
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  if (req.user._id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      bcrypt.hash(req.body.password, 10, (err: any, hashv: string) => {
        if (!err) req.body.password = hashv;
        else return res.status(402).send({ msg: "error" });
      });
    }

    try {
      const { fullname, name, email, profilePic } = req.body;

      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,

        {
          $set: {
            fullname,
            name,
            email,
            profilePic,
          },
        },
        { new: true }
      ).select("-password");

      return res.status(200).json(updatedUser);
    } catch (err: any) {
      if (err.errors) {
        let fields = geneerror(err, "path");

        let messages = geneerror(err, "message");

        return res.status(500).json({ fields, messages });
      } else res.status(500).json({ err });
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
};
const DeleteUser = async (req: Request, res: Response) => {
  try {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      await UserModel.findByIdAndDelete(req.params.id);
      return res.status(200).send({ msg: "User has been deleted..." });
    } else {
      return res.status(403).send({ msg: "You can delete only your account!" });
    }
  } catch (err) {
    return res.status(403).json(err);
  }
};
const FindUser = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findById(req.params.id).select(
      "-password"
    )) as User;

    if (user) return res.status(200).json(user);
    else {
      return res.status(402).send({ msg: "user not found" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};
const FindAllUser = async (req: Request, res: Response) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await UserModel.find().sort({ _id: -1 }).limit(5)
        : await UserModel.find();

      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You are not allowed to see all users!");
  }
};
const StatsUser = async (req: Request, res: Response) => {
  try {
    const data = await UserModel.aggregate([
      {
        $project: {
          num: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$num",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAdmins = async (req: Request, res: Response) => {
  try {
    const data = await UserModel.find({ isAdmin: true });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};

export {
  Signincont,
  Signupcont,
  UpdateUser,
  DeleteUser,
  FindUser,
  FindAllUser,
  StatsUser,
  getAdmins,
};

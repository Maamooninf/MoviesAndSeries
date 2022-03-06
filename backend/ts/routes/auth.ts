import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../interfaces/userinterface";
const isloggedin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const decoded = jwt.verify(authorization, "somesecret") as User;
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        return res.status(401).json({ msg: "You are not authenticated!" });
      }
    } else {
      return res.status(401).json({ msg: "You are not authenticated!" });
    }
  } catch (err) {
    return res.status(401).json({ msg: "You are not authenticated!" });
  }
};
export { isloggedin };

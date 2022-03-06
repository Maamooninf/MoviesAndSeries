import{Express,Request} from "express";
import { User } from "../../interfaces/userinterface";

declare global {
  namespace Express {
    interface Request {
      user: User,
      io:any
    }
  };

}
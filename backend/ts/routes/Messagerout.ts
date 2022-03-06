import { isloggedin } from './auth.js';
import express from 'express'
import {globaly} from '../interfaces/main.js'
import {creatMessage,getMessages} from '../controlles/Messagcontroller.js'
class MessageController implements globaly{
    public path = '/message';
   public router = express.Router();
   constructor() {
    this.intializeRoutes();
   }

    public intializeRoutes() {
    
        this.router.post("/create/:reciver",isloggedin,creatMessage)   
        this.router.get("/:converId",isloggedin,getMessages)   
    
    }
}
export default MessageController
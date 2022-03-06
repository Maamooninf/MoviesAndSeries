import { isloggedin } from './auth.js';
import express from 'express'
import {globaly} from '../interfaces/main.js'
import {getConversations,creatConversation} from '../controlles/Coverscontroller.js'
class CoversationController implements globaly{
    public path = '/conver';
   public router = express.Router();
   constructor() {
    this.intializeRoutes();
   }

    public intializeRoutes() {
    
        this.router.get("/getAll",isloggedin,getConversations)   
        this.router.post("/create",isloggedin,creatConversation)   
    
    }
}
export default CoversationController
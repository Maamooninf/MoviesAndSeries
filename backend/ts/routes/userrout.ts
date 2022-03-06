import express from 'express'
import { Signincont,FindUser,Signupcont,
  UpdateUser,DeleteUser,FindAllUser,StatsUser,getAdmins } from '../controlles/userControlles.js';
  import { isloggedin } from './auth.js';
  import {globaly} from '../interfaces/main.js'

class UserController implements globaly{
    public path = '/user';
   public router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
      this.router.post('/signin',Signincont)
      this.router.post('/signup',Signupcont)
      this.router.put('/update/:id',isloggedin,UpdateUser)
      this.router.delete("/delete/:id",isloggedin,DeleteUser)
      this.router.get("/find/:id",FindUser)
      this.router.get("/all",isloggedin,FindAllUser)
      this.router.get("/stats",isloggedin,StatsUser)
      this.router.get("/getadmins",isloggedin,getAdmins)
    }
  
   

  }
  export default UserController
  
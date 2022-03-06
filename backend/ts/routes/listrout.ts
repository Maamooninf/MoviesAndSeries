import express from 'express'
import { isloggedin } from './auth.js'
import {globaly} from '../interfaces/main.js'
import {Creatlist,Deletelist,GetList} from '../controlles/listController.js'

class ListController implements globaly{
    public path = '/list';
    public router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
    this.router.post('/creat',isloggedin,Creatlist)
    this.router.delete('/delete/:id',isloggedin,Deletelist)
    this.router.get('/getAll',isloggedin,GetList)
    }
  
   

  }
  export default ListController
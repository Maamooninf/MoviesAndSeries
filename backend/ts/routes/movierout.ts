import express from 'express'

import { CreateMovie,UpdateMovie ,
         DeleteMovie,FindMovie,
         FindRandomMovie,FindAll,
         likeMovie, unlikeMovie,Addcomment
        ,Addreply} from '../controlles/movieControlles.js'

import { isloggedin } from './auth.js'
import {globaly} from '../interfaces/main.js'
class MovieController implements globaly{
    public path = '/movie';
    public router = express.Router();
   
    constructor() {
      this.intializeRoutes();
    }
   
    public intializeRoutes() {
      this.router.post('/create',isloggedin,CreateMovie)
      this.router.post('/addcomment',isloggedin,Addcomment)
      //Addreply
      this.router.post('/addreply/movie/:movieId/comment/:commentId',isloggedin,Addreply)
      this.router.put('/update/:id',isloggedin,UpdateMovie)
      this.router.delete("/delete/:id",isloggedin,DeleteMovie)
      this.router.get("/find/:id",isloggedin,FindMovie)
      this.router.get("/random",isloggedin,FindRandomMovie)
      this.router.get("/findAll",isloggedin,FindAll)
      this.router.put('/like',isloggedin,likeMovie)
      this.router.put('/unlike',isloggedin,unlikeMovie)

    }
  
   

  }
  export default MovieController
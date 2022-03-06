import mongoose from 'mongoose'
interface Comment {
    _id:string;
    content:string,
    author :string,
    comments:mongoose.Schema.Types.ObjectId

  }
 
export {Comment}  
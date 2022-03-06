import mongoose from 'mongoose'
import {Message} from '../interfaces/MessageInter.js'
const MessageSchema = new mongoose.Schema<Message>(
    {
        text: { type: String},
        sender: { type: String ,ref:'User'},
        conver: {type:String,ref:'Conversation'}
      },
      { timestamps: true ,toJSON: { virtuals: true } }
  );
  const MessageModel = mongoose.model<Message>('Message', MessageSchema);
  export {MessageModel}
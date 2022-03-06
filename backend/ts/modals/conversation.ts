import mongoose from 'mongoose'
import {conversation} from '../interfaces/coversationinter'
const ConversationtSchema = new mongoose.Schema<conversation>(
    {
     users:[{type:String,ref:'User'}] 
    },
      { timestamps: true ,toJSON: { virtuals: true } }
  );
  const ConversationModel = mongoose.model<conversation>('Conversation', ConversationtSchema);
  export {ConversationModel}
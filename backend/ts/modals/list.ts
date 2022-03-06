import mongoose from 'mongoose'
import {list} from '../interfaces/listinterface.js'
const ListSchema = new mongoose.Schema<list<mongoose.Schema.Types.ObjectId>>(
    {
        title: { type: String, required: true, unique: true },
        type: { type: String },
        genre: { type: String },
        content:[{type:mongoose.Schema.Types.ObjectId}]
      },
      { timestamps: true ,toJSON: { virtuals: true } }
  );
  const ListModel = mongoose.model<list<mongoose.Schema.Types.ObjectId>>('List', ListSchema);
  export {ListModel}
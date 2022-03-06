import {Movie} from '../interfaces/movieinterface.js'
import mongoose from 'mongoose'
const MovieSchema = new mongoose.Schema<Movie>(
    {
      id:mongoose.Schema.Types.ObjectId,
      title: { type: String, required: true, unique: true },
      desc: { type: String,required:true },
      img: { type: String ,required:true},
      imgTitle: { type: String },
      imgSm: { type: String },
      trailer: { type: String ,required:true},
      video: { type: String,required:true },
      year: { type: String },
      limit: { type: Number },
      genre: { type: String },
      isSeries: { type: Boolean, default: false },
      likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
      comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]
   
    },
    { timestamps: true , toJSON: { virtuals: true } }
  );
  MovieSchema.pre('find', function () {
    // `this` is an instance of mongoose.Query
    this.populate('comments');
});
MovieSchema.pre('findOne', function () {
  // `this` is an instance of mongoose.Query
  this.populate('comments');
});
MovieSchema.pre('findOneAndUpdate', function () {
  // `this` is an instance of mongoose.Query
  this.populate('comments');
});
//findById
  const MovieModel = mongoose.model<Movie>('Movie', MovieSchema);
  export {MovieModel}

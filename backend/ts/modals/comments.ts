import { NextFunction } from 'express';
import mongoose from 'mongoose'
import { Comment } from '../interfaces/CommentsInterface';

const CommentSchema = new mongoose.Schema<Comment>(
    {
        content: { type: String, required: true },
        author : { type: String, ref: 'User', required: true },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
      },
      { timestamps: true ,toJSON: { virtuals: true } }
  );
  CommentSchema.pre('find', function () {
    // `this` is an instance of mongoose.Query
    this.populate('author','name email profilePic');
    this.populate('comments','content _id');
});
CommentSchema.pre('findOne', function () {
    // `this` is an instance of mongoose.Query
    this.populate('author','name email profilePic');
    this.populate('comments','content _id');
});
CommentSchema.pre('findOneAndUpdate', function () {
  // `this` is an instance of mongoose.Query
  this.populate('author','name email profilePic');
  this.populate('comments','content _id');
});
//findOneAndUpdate
  const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
  export {CommentModel}

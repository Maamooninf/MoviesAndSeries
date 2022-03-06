import {Request, Response} from "express";
import {ConversationModel} from '../modals/conversation.js'
import {MessageModel} from '../modals/Messages.js'
const getConversations=async(req:Request,res:Response)=>{
try{

const convens=await ConversationModel.find({users:{$in:[req.user._id]}}).populate("users","name profilePic")
const messages = await Promise.all(
    convens?.map((conv) => {
      return MessageModel.find({conver:conv._id}).sort({createdAt:-1}).limit(1);
    })
  );

return res.status(200).send({convens,messages})
}
catch(err){
return res.status(500).send(err)
}
}
const creatConversation=async(req:Request,res:Response)=>{
    try{
    const check =await ConversationModel.find({users:{$all:req.body.users}})
 
    if (check.length!==0){
      return res.status(200).send({alredy:true});
    }
      const newcon=new ConversationModel(req.body)
      const saved=await newcon.save()
      await ConversationModel.populate(saved, { path: 'users', select: 'name profilePic' });
     return res.status(200).send({saved,alredy:false})
    }
    catch(err){
    return res.status(500).send(err)
    }
    }
export {getConversations,creatConversation}
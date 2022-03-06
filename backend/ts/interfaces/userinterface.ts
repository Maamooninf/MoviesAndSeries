import mongoose from 'mongoose'

interface User {
    _id:string;
    name: string;
    email: string;
    password:string;
    profilePic: string;
    isAdmin: boolean;
    tepassword:string,
    fullname?:string

  }
 
export {User}  
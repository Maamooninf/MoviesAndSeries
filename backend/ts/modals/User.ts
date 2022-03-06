import  mongoose from 'mongoose'
import validator from 'validator'
import { User } from '../interfaces/userinterface.js';
import uniqueValidator from 'mongoose-unique-validator';
  
  export const userSchema = new mongoose.Schema<User>({
    name: { type: String,   required:[true,'name is required'] ,

    minlength:[4,'name should be at least 4 characters']

   ,maxlength:[10,'name should be at most 10 characters']},

    fullname:{type:String,required: false,default:"User"},

    email: { type: String, required:[true,'email is required'],
    validate: [validator.isEmail, 'Enter a valid email address.'],unique:true},

    profilePic: { type: String, required: false },

    isAdmin: { type: Boolean, default: false },

    password: { type: String,   required:[true,'password is required']
  },

  },
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
  );
  userSchema.virtual('tepassword')

  userSchema.path('password').validate(function(){
  if (this.tepassword){
    let x:boolean=validator.isStrongPassword(this.tepassword ,
      { 

      minLength: 4,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1, 
      minSymbols: 1,
      returnScore: false,
      pointsPerUnique: 1,
      pointsPerRepeat: 0.5,
      pointsForContainingLower: 10,
      pointsForContainingUpper: 10,
      pointsForContainingNumber: 10,
      pointsForContainingSymbol: 10 
    
    })

    if (!x){ 
      this.invalidate('password', 'Password is weak');
    } 
  }
  }) 




 userSchema.plugin(uniqueValidator, { message: ' {PATH} Already exists' });
  
  const UserModel = mongoose.model<User>('User', userSchema);
  export   {UserModel}
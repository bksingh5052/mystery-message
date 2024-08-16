
import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {
     content : string,
     createdAt :  Date
}


export interface User extends Document {
    username : string;
    email :  string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}





const MessegeSchema: Schema<Message> = new Schema({
     content : {
         type : String,
         required : true
     },
     createdAt:{
        type : Date,
        required : true ,
        default: Date.now()
     },

})



const UserSchema: Schema<User> = new Schema({
    username : {
        type : String,
        required : [true , "Username is required"],
        unique: true
    },
    email:{
       type : String,
       required : [true, "Email is required"] ,
       unique: true,
       match : [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 'Please use a valid email']
    } ,
    password:{
       type : String,
       required : [true, "Password is required"] ,
    },
    verifyCode:{
       type : String,
       required : [true, "Verify code is required"] ,
    },
    verifyCodeExpiry:{
       type : Date,
       required : [true, "Verify code expiry is required"] ,
    },  
    isVerified:{
       type : Boolean,
       default: false
    },
     isAcceptingMessage:{
       type : Boolean,
       default: true
    },
    messages:[MessegeSchema]
    
})



const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);


export default UserModel;



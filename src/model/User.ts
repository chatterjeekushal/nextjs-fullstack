

import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document{
    content: string;
    createdAt: Date;
    updatedAt: Date;
}


const MessageSchema:Schema<Message> =new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
   
})  


export interface User extends Document{
   
    username: string;
    password: string;
    email: string;
    verified: string;
    verifyexpires: Date;
    isverified: boolean;
    isAcceptedMessage: boolean;
    messages: Message[];
    
}



const UserSchema:Schema<User> =new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"]
    },
    verified: {
        type: String,
        required: [true, "Verified is required"],
    },
    verifyexpires: {
        type: Date,
        required: [true, "Verifyexpires is required"],
    },
    isverified: {
        type: Boolean,
       default: false
    },
    isAcceptedMessage: {
        type: Boolean,
       
    },
    messages: [MessageSchema],
   
})






const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
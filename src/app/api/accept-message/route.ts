
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {

        return Response.json({ error: "Unauthorized user", success: false }, { status: 500 },);

    }

    const userid = user._id;

   try {
     const { acceptmessage } = await request.json();
 
     const updatedUser = await UserModel.findByIdAndUpdate(userid, { isacceptedMessage: acceptmessage }, { new: true });
 
     if (!updatedUser) {
 
         return Response.json({ error: "User not found", success: false }, { status: 500 },);
     }
 
     return Response.json({ success: true, message: "Message accepted status updated successfully", updatedUser }, { status: 200 },);
   } catch (error) {
    
    return Response.json({ error: "error in update accept message", success: false }, { status: 500 },);
   }



}


export async function GET(request: Request) {



    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {

        return Response.json({ error: "Unauthorized user", success: false }, { status: 500 },);

    }

    const userid = user._id;

   try {
     const updatedUser = await UserModel.findById(userid);
 
     if (!updatedUser) {
 
         return Response.json({ error: "User not found", success: false }, { status: 500 },);
     }
 
     return Response.json({
         success: true, isaccptedMessage: updatedUser. isAcceptedMessage
     }, { status: 200 },);
   } catch (error) {
    
    return Response.json({ error: "error in accept message", success: false }, { status: 500 },);
   }



}


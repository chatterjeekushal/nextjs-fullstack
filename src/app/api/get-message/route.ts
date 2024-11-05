
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {

    await dbConnect();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User

    if (!session || !session.user) {

        return Response.json({ error: "Unauthorized user", success: false }, { status: 500 },);

    }

    const userid = new mongoose.Types.ObjectId(user._id);

    try {

        // get message with aggregate Pipeline
        
        const user = await UserModel.aggregate([

            { $match: { _id: userid } },

            {$unwind: "$messages"},

            {$sort: { "messages.createdAt": -1 }},

            {$group:{_id:'$_id',messages:{$push:'$messages'}}},
        ])

        if(!user || user.length === 0) {

            return Response.json({ error: "User not found", success: false }, { status: 500 },);
        }

        return Response.json({ success: true, messages: user[0].messages }, { status: 200 },);



    } catch (error) {
        
        return Response.json({ error: "error in get message", success: false }, { status: 500 },);
    }

}
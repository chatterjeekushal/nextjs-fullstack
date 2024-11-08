
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";

import { Message } from "@/model/User";



export async function POST(request: Request) {

    await dbConnect();

    await request.json();

    const { username, message } = await request.json();
    try {

        const user = await UserModel.findOne({ username })

        if (!user) {

            return Response.json({ error: "User not found", success: false }, { status: 500 },);
        }

        if (!user.isAcceptedMessage) {

            return Response.json({ error: "user is not accepted message", success: false }, { status: 500 },);
        }


        const newMessage = ({ content: message, createdAt: new Date(), updatedAt: new Date() });

        user.messages.push(newMessage as Message);

        await user.save();

        return Response.json({ success: true, message: "Message sent successfully", user }, { status: 200 },);
    } catch (error) {

        console.log("error in sending message", error);
        
        return Response.json({ error: "error in sending message", success: false }, { status: 500 },);
    }
}
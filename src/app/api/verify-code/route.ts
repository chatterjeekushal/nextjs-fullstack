
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/singupSchema";

export async function POST(request: Request) {

    await dbConnect();

    try {

        const body = await request.json();

        const { username, code } = await body; 

        const decodedUsername = decodeURIComponent(username);

        console.log("decodedUsername", decodedUsername);
        
        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {

            return Response.json({ error: "User not found", success: false }, { status: 500 },);

        }

        const iscodevalid = user?.verified === code;

        const iscodenotexpired = new Date(user?.verifyexpires || '') > new Date();

        if (iscodevalid && iscodenotexpired) {


            user.isverified = true;

            await user?.save();

            return Response.json({ success: true, message: "User verified successfully" }, { status: 200 },);
        } else if (iscodevalid && !iscodenotexpired) {

            return Response.json({ error: "Code expired plese singup again", success: false }, { status: 500 },);

        } else {

            return Response.json({ error: "Invalid code", success: false }, { status: 500 },);

        }

    } catch (error) {

        console.error("verify user error", error);

        return Response.json({ error: error, success: false, message: "verify user error" }, { status: 500 },);
    }

}

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import {usernameValidation} from "@/schemas/singupSchema";


const UsernameQueryschema = z.object({
    username: usernameValidation
}) 

export async function GET(request: Request) {

    
    await dbConnect();

    try {

        // find url value
        
        const { searchParams } = new URL(request.url);
        const quaryparam={username:searchParams.get("username")};

        // validate with zod

       const result = UsernameQueryschema.safeParse(quaryparam)

       console.log("result",result);
       
       if(!result.success) {

        const usernameerror= result.error.format().username?._errors || []

        return Response.json({ error: usernameerror, success: false }, { status: 500 },);

       }

       const {username}=result.data;

    const existingUserverifiedbyusername = await  UserModel.findOne({username,isverified:true})


    if(existingUserverifiedbyusername) {

        return Response.json({ error: "User already exists this username", success: false }, { status: 500 },);
    }


    return Response.json({ success: true ,  message: "Username is unique" }, { status: 200 },);


    } catch (error) {
        
        console.error("error in getting username", error);

        return Response.json({ error: "Error in getting username", success: false }, { status: 500 },);
    }

}


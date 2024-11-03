

import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User";

import bcrypt from "bcryptjs";

import { sendVerifyEmail } from "@/helpers/sendverifyemail";


export async function POST(req: Request) {

    await dbConnect();

    try {

        const { username, password, email } = await req.json();

        const existingUserverifiedbyusername = await UserModel.findOne({ username, isverified: true })

        if (existingUserverifiedbyusername) {
            return Response.json({ error: "User already exists", success: false }, { status: 500 },);
        }

        const existingUserverifiedbyemail = await UserModel.findOne({ email })


        const verifycode = Math.floor(100000 + Math.random() * 900000);


        if (existingUserverifiedbyemail) {

            if (existingUserverifiedbyemail.isverified) {
                return Response.json({ error: "User already exists with this email", success: false }, { status: 500 },);
            }
            else {

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const expirydate = new Date();
                expirydate.setHours(expirydate.getHours() + 1);
                existingUserverifiedbyemail.password = hashedPassword;
                existingUserverifiedbyemail.verified = verifycode.toString();
                existingUserverifiedbyemail.verifyexpires = new Date(Date.now() + 3600000);

                await existingUserverifiedbyemail.save();
            }
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const expirydate = new Date();
            expirydate.setHours(expirydate.getHours() + 1);

            const newuser = new UserModel({
                username,
                password: hashedPassword,
                email,
                verified: verifycode,
                verifyexpires: expirydate,
                isverified: false,
                isAcceptedMessage: true,
                messages: [],
            });

            await newuser.save();
        }


        // send verification email
        const emailResponse = await sendVerifyEmail(email, username, verifycode.toString());


        if (!emailResponse.success) {

            return Response.json({ error: "Failed to send verification email", success: false }, { status: 500 },);

        }


        return Response.json({ message: "User registered successfully", success: true }, { status: 200 },);



    } catch (error) {

        console.error("Error registering user", error);

        return Response.json({ error: "Failed to register user", success: false }, { status: 500 },);
    }
}
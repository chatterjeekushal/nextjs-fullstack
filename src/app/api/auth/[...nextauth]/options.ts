

import { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { promises } from "dns";

export const authOptions: NextAuthOptions = {

    providers: [

        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {

                await dbConnect();
                try {

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials?.email },
                            { password: credentials?.password },
                        ]
                    })

                    if (!user) {

                        throw new Error("User not found with this email or username");
                    }

                    if (!user.isverified) {

                        throw new Error("Please verify your email before login");
                    }

                    const ispasswordMatch = await bcrypt.compare(credentials?.password, user.password)

                    if (ispasswordMatch) {

                        return user
                    } else {
                        throw new Error("Invalid password");
                    }

                } catch (error: any) {

                    throw new Error(error);
                }

            }
        })
    ],
    callbacks: {

        async session({ session, token }) {

            if(token){

                session.user._id=token._id;
                session.user.isverified=token.isverified;
                session.user.isacceptedMessage=token.isacceptedMessage;
                session.user.username=token.username;
            }

            return session
        },
        async jwt({ token, user, }) {

            if(user){

                token._id=user._id?.toString();
                token.isverified=user.isverified;
                token.isacceptedMessage=user.isacceptedMessage;
                token.username=user.username;
            }

            return token
        }
    },
    pages: {

        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
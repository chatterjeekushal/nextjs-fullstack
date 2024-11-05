
import NextAuth from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";


const handeler = NextAuth(authOptions);


export { handeler as GET, handeler as POST }
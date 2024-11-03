
import { resend } from '@/lib/resend';

import  VerificationEmail from '../../emails/VerificationEmail';

import {ApiResponce} from '@/types/ApiResponce';

export async function sendVerifyEmail(email:string,username:string,otp:string):Promise<ApiResponce>{

    try {
        
        await resend.emails.send({
            from: ' <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email address by otp ',
            react: VerificationEmail({username,otp}),
        });

        return {
            success:true,
            message:"Verification email sent"
        }

    } catch (emailError) {
        
        console.log("error in sending email",emailError);

        return {
            success:false,
            message:"Failed to send verification email"
        }
    }

}
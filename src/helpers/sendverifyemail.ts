
import { resend } from '@/lib/resend';

import  VerificationEmail from '../../emails/VerificationEmail';

import {ApiResponce} from '@/types/ApiResponce';

export async function sendVerifyEmail(email:string,username:string,otp:string):Promise<ApiResponce>{

    try {
        
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: 'kushalchatterjee943@gmail.com',
            subject: 'Verify your email address by otp ',
            html: `<strong>username ${username}, email : ${email}, yourotp: ${otp}</strong>`, 
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
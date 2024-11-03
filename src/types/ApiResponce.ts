
import { Message } from "@/model/User";
export interface ApiResponce {

    success: boolean;
    message: string;
    isAcceptedMessage?: boolean;
    messages?:Array<Message>; 
}
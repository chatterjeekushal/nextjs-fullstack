
import { z } from "zod";

export const MessageSchema = z.object({
    content:z
    .string()
    .min(10, { message: "Message must be at least 10 character" })
    .max(100, { message: "Message must be less than 100 characters" })

})
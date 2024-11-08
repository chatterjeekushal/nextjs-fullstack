
import { z } from "zod";

export const singupSchema = z.object({
    email: z.string(),
    password: z.string(),
   
});



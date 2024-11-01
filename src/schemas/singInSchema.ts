
import { z } from "zod";

export const singupSchema = z.object({
    username: z.string(),
    password: z.string(),
   
});



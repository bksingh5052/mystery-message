import {z} from "zod";



export const messageSchema = z.object({
    content : z.string().min(10, 'Content must be atleast 10 characters')
    .max(300,'Message content is no longer then 300 characters')
})
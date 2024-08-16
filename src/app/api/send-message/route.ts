import dbConnect from "@/lib/dbConnect";
import  UserModel  from "@/models/User";
import {Message} from '@/models/User'
import { use } from "react";



export async function POST(request:Request){
    await dbConnect()
    const { username,content} = await request.json();
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "user not found",
                },
                {
                  status: 401,
                }
              );
        }
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                  success: false,
                  message: "user is not accepting messages",
                },
                {
                  status: 403,
                }
              );
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
              success: true,
              message: "Message sent succesfully",
            },
            {
              status: 200,
            }
          );
    } catch (error) {
        console.log("Failed to send message", error)
        return Response.json(
            {
              success: false,
              message: "Failed to send message",
            },
            {
              status: 500,
            }
          );
    }
} 
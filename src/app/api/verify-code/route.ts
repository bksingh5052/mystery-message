import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { use } from "react";


export async function POST(request:Request){
    await dbConnect()
    try {
        const {username, code} = await request.json()
        console.log(username,code,"1")
        console.log(typeof code)
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json(
                {
                  success: false,
                  message: "User not found",
                },
                {
                  status: 401,
                }
              );
        }
        if(user.isVerified){
          return Response.json(
              {
                success: false,
                message: "User is already verified",
              },
              {
                status: 405,
              }
            );
      }
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
        if(!isCodeValid){
          return Response.json(
            {
              success: false,
              message: "Invalid OTP",
            },
            {
              status: 400,
            }
          );
        }
        if(!isCodeNotExpired){
          return Response.json(
            {
              success: false,
              message: "Verification has expired, please signup again to get a new code.",
            },
            {
              status: 400,
            }
          );
        };
        user.isVerified = true
        user.save();
        return Response.json(
          {
            success: true,
            message: "Account verified successfully",
          },
          {
            status: 200,
          }
        );
        
    } catch (error) {
        console.log("Error while verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error while verifying user",
      },
      {
        status: 500,
      }
    );
    }
}
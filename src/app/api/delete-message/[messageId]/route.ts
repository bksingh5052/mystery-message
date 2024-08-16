import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function DELETE(request:Request,{params}:{params :{messageId:string}}){
  const messageId = params.messageId
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }

    try {
    const updatedMessageResult = await UserModel.updateOne(
      {_id: user._id},
      {$pull: {messages:{_id: messageId}}}
    )


    if(updatedMessageResult.modifiedCount == 0){
      return Response.json(
        {
          success: false,
          message: "Message not found or already deleted",
        },
        {
          status: 404,
        }
      );
    }

      return Response.json(
          {
            success: true,
            message: "Message Deleted",
          },
          {
            status: 200,
          }
        );

  
      
    } catch (error) {
        console.log('Failed to delete messages')
        return Response.json(
            {
              success: false,
              message: "Failed to delete messages",
            },
            {
              status: 500,
            }
          );
    }
}
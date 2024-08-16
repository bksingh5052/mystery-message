import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { URL } from "url";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    // validate with zod
    const result = usernameQuerySchema.safeParse(queryParams);
    console.log(result,"1");
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(" ,")
              : "Invalid query parameters",
        },
        {
          status: 400,
        }
      );
    }
    const {username } = result.data

    const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
    if(existingVerifiedUser){
        return Response.json(
            {
              success: false,
              message: "Username is alredy taken",
            },
            {
              status: 405,
            }
          );
    }
    return Response.json(
        {
          success: true,
          message: "Username is unique",
        },
        {
          status: 200,
        }
      );
  } catch (error) {
    console.log("Error while cheacking username", error);
    return Response.json(
      {
        success: false,
        message: "Error while checking username",
      },
      {
        status: 500,
      }
    );
  }
}

import UserModel from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextRequest, NextResponse } from "next/server";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { username } = await request.json()
    console.log(username)
    const queryParams = {
      username,
    };

    // Validate with zod
    const result = usernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
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

  
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        {
          status: 405,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Username is unique",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error while checking username", error);
    return NextResponse.json(
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

import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email : string,
    username: string,
    verifyCode: string,
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'support@codedefender.in',
            to: email,
            subject: 'Message Pro | Verification code',
            react: VerificationEmail({username, otp:verifyCode}),
          });
        return { success: true, message: 'Verification email sent successfully'}
    } catch (emailError) {
        console.error('Error while sending verification email')
        return { success: false, message: 'Error while sending verification email'}
    }
}
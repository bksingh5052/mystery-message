import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs'



export const authOptions : NextAuthOptions = {
    providers : [
         CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials:{
                identifier: { label: "Email", type: "text ", placeholder: "Enter your email" },
                password: { label: "Password", type: "Enter your password" }
                },
                async authorize(credentials:any):Promise<any> {
                    await dbConnect()
                    try {
                        const user = await UserModel.findOne({
                            $or: [
                                {email: credentials.identifier},
                                {username: credentials.identifier}
                            ]
                        })
                        if(!user){
                            throw new Error("No user found")
                        }
                        if(!user.isVerified){
                            throw new Error("Please verify your email before login")
                        }
                        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                        if(!isPasswordCorrect){
                            throw new Error("Invalid credentials")
                        }
                        return user
                    } catch (err:any) {
                        throw new Error(err)
                    }
            }
         }),       
        ],
        pages: {
            signIn: '/sign-in',
        },
        session:{
            strategy:'jwt',
        },
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            
            async session({ session,token }) {
                if(token){
                    session.user._id =token._id
                    session.user.isVerified = token.isVerified
                    session.user.isAcceptingMessage = token.isAcceptingMessage
                    session.user.username = token.username
                }
              return session
            },
            async jwt({ token, user}) {
                if(user){
                    token._id = user._id?.toString()
                    token.isVerified = user.isVerified
                    token.isAcceptingMessage = user.isAcceptingMessage
                    token.username = user.username
                }
              return token
            }
        
        }
}

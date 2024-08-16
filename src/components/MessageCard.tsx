"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { X } from "lucide-react";

import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "./ui/use-toast";
import { Message } from "@/models/User";


type MessageCardProps = {
  message: Message;
  onMessageDelete : (messageId:any)=> void

}



const MessageCard = ({message, onMessageDelete}:MessageCardProps) => {
  console.log(message)
  // const date = message.createdAt.toString
  const {toast} = useToast()
  const handleDeleteConfirm = async ()=>{
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    console.log(response)
    toast({
      title: response.data.message
    })
    onMessageDelete(message._id)
  }
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>

        <AlertDialog>
  <AlertDialogTrigger><X className="w-5 h-5 absolute right-2 top-2"/></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

        <CardDescription> {message.createdAt.toString().slice(0,10)}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default MessageCard;

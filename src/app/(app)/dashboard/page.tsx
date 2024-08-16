'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Message, User } from "@/models/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"




const Page = () => {
  const [messages, setMessages]= useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwithchLoading, setIsSwithchLoading] = useState(false)

  const {data:session} = useSession()

  const {toast} = useToast()


  const handleDeleteMessage  = (messageId:string)=>{
    setMessages(messages.filter((message)=>(message._id !== messageId)))
  }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const{register, watch, setValue} = form
  const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessages = useCallback(async()=>{
      setIsSwithchLoading(true)
      
  try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message setting",
        variant: "destructive"
      })
    } finally{
      setIsSwithchLoading(false)
    }
  
    },[setValue])

    const fetchMessages = useCallback(async(refresh: boolean = false)=>{
      setIsLoading(true)
      setIsSwithchLoading(true)
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages')
        setMessages(response.data.messages || [])
        if(refresh){
          toast({
            title: "Refreshed messages",
            description: "Showing refreshed messages"
          })
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data.message || "Failed to fetch messages",
          variant: "destructive"
        })
      } finally{
        setIsLoading(false)
        setIsSwithchLoading(false)
      }
    }, [setIsLoading, setMessages, toast])
 


    useEffect(()=>{

      if(!session || !session.user ) return
      fetchAcceptMessages()
      fetchMessages()
    },[session,setValue, fetchAcceptMessages, fetchMessages])

    const handleSwitchChange = async()=>{
     try {
       const response = await axios.post<ApiResponse>('/api/accept-messages',{
         acceptMessages : !acceptMessages
       })
       setValue('acceptMessages', !acceptMessages)
       toast({
        title: response.data.message
       })
     } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message setting",
        variant: "destructive"
      })
     }
    }
    

    const username = session?.user.username;
    let baseUrl;
    if (typeof window !== 'undefined') {
       baseUrl = window.location.origin;
   }
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = ()=>{
      navigator.clipboard.writeText(profileUrl)
      toast({
        title: "URL copied",
        description: "Profile url has been copied to clipboard"
      })
    }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2>Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
          <Button  onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
       <div className="mb-4">
        <Switch
        {...register('acceptMessages')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwithchLoading}
        />
        <span>Accept Messages: {acceptMessageSchema? 'on':'off' }</span>
       </div>
       <Separator/>
       <Button
       className="mt-4"
       variant="outline"
       onClick={(e)=>{
        e.preventDefault();
        fetchMessages(true)
       }}
       >
        {
        isLoading ? (<Loader2 className="h-4 w-4 animate-spin"/>):(<RefreshCcw className="h-4 w-4"/>)}

       </Button>
       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {
          messages.length > 0 ? (
            messages.map((message,index)=>
             ( <MessageCard
              key={index} 
              message={message}
              onMessageDelete={handleDeleteMessage}
              />
            ))
          ):(
            <p>No messages found</p>
          )
        }
       </div>
    </div>
  )
}

export default Page

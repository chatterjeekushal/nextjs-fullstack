
import React from 'react'
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
import { Button } from "@/components/ui/button"
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { ApiResponce } from '@/types/ApiResponce'

type Messages = {
    message:  Message;
    onmessagedelete: (messageId: string) => void;
}
function MessageCard({message,onmessagedelete}:Messages) {

    console.log("message",message);
    console.log("onmessagedelete",onmessagedelete);
    
    

const {toast}=useToast()

const heldeldeleteconfrom = async () => {

   const response = await axios.delete<ApiResponce>(`/api/delete-message/${message._id}`)

   console.log(message._id,"message._id");
   

   toast({
    title: 'success',
    description: response.data.message,
})

   onmessagedelete(message._id as string)
}

  return (
    <div className="flex w-full p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 my-6">
    <div className="flex items-center gap-4 text-slate-800">
      <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1480&amp;q=80" alt="Tania Andrew" className="relative inline-block h-[58px] w-[58px] !rounded-full  object-cover object-center" />
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-semibold text-slate-800">
            Tania Andrew
          </h5>
          <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={heldeldeleteconfrom}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  
        </div>
        <p className="text-xs uppercase font-bold text-slate-500 mt-0.5">
          Designer @ Google
        </p>
      </div>
    </div>
    <div className="mt-6">
      <p className="text-base text-slate-600 font-light leading-normal">
        &quot;I found solution to all my design needs from Creative Tim. I use
        them as a freelancer in my hobby projects for fun! And its really
        affordable, very humble guys !!!&quot;
      </p>
    </div>
  </div>   
  
  
  )
}

export default MessageCard


'use client'

import React, { use, useCallback, useEffect } from 'react'
import { Message } from "@/model/User"
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useForm, UseFormSetValue } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { AxiosError } from 'axios'
import { ApiResponce } from '@/types/ApiResponce'
import { User } from 'next-auth'
import { Switch } from "@/components/ui/switch"
import { Separator } from '@radix-ui/react-separator'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'
import axios from 'axios'

// Define the types for your form
interface FormValues {
  acceptMessages: boolean
}

function Page() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [isSwitching, setIsSwitching] = React.useState<boolean>(false)

  const { toast } = useToast()
  const { data: session } = useSession()

  const form = useForm<FormValues>({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, handleSubmit, setValue, watch } = form
  const acceptMessages = watch("acceptMessages")

  // Function to handle message deletion
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message: Message) => message._id !== messageId))
  }

  // Function to fetch accepted message status
  const fetchAcceptMessage = useCallback(async () => {
    try {
      setIsSwitching(true)
      const response = await axios.get("/api/accept-message")
      setValue("acceptMessages", response.data.isAcceptedMessage)
      toast({
        title: 'Success',
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>
      const errorMessage = axiosError.response?.data.message || 'Something went wrong'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSwitching(false)
    }
  }, [setValue, toast])

  // Function to fetch messages
  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    setIsSwitching(false)

    try {
      const response = await axios.get("/api/get-message")
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: 'Success',
          description: response.data.message,
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>
      const errorMessage = axiosError.response?.data.message || 'Something went wrong'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSwitching(false)
      setLoading(false)
    }
  }, [toast])

  // Fetch messages and accepted message status on session load
  useEffect(() => {
    if (!session || !session.user) {
      return
    }

    fetchMessages()
    fetchAcceptMessage()
  }, [session, fetchMessages, fetchAcceptMessage])

  // Handle switching accept message status
  const handleSwitch = async () => {
    try {
      const response = await axios.post("/api/accept-message", {
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages)
      toast({
        title: 'Success',
        description: response.data.message,
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>
      const errorMessage = axiosError.response?.data.message || 'Something went wrong'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  // Profile URL handling
  const { username } = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}/`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Success',
      description: "Copied to clipboard",
    })
  }

  if (!session || !session.user) {
    return <div>Please login</div>
  }

  return (
    <div>
      <h1>User Dashboard</h1>

      <div>
        <h2>Copy your profile URL</h2>

        <div>
          <input type="text" value={profileUrl} readOnly />
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      </div>

      <div>
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitch}
          disabled={isSwitching}
        />
        <span>Accept messages: {acceptMessages ? 'On' : 'Off'}</span>
      </div>

      <Separator />

      <Button
        className=""
        variant={'outline'}
        onClick={(e) => { e.preventDefault(); fetchMessages(true) }}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 h-4 w-4" />
        )}
      </Button>

      <div>
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onmessagedelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages</p>
        )}
      </div>
    </div>
  )
}

export default Page

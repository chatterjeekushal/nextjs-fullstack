


'use client'

import React, { useEffect } from 'react'
import * as z from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { singupSchema } from '@/schemas/singupSchema'
import axios, { AxiosError } from 'axios'

import { ApiResponce } from '@/types/ApiResponce'



import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { set } from 'mongoose'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { log } from 'console'

function page() {

  const [username, setUsername] = React.useState('')

  const [usernameMessage, setUsernameMessage] = React.useState('')

  const [ischaking, setIschaking] = React.useState(false)

  const [isSubmiting, setIsSubmiting] = React.useState(false)

  const debounced = useDebounceCallback(setUsername, 500)

  const { toast } = useToast()

  const router = useRouter()

  // zod implementation

  const form = useForm({
    resolver: z.zodResolver(singupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {

    const chackusername = async () => {
      if (username) {
        setIschaking(true)
        setUsernameMessage('')

        try {
          const response = await axios.get(`/api/chak-username-unique?username=${username}`)

          console.log("response", response);

          let errormessage = response.data.message

          console.log("errormessage", errormessage);
          
          setUsernameMessage(errormessage)
        } catch (error) {


            const axiosError = error as AxiosError;

            console.log("axiosError", axiosError);
          
            if (axiosError.response) {
              // Type assertion for the response data structure
              const serverResponse = axiosError.response.data as ApiResponce;
              
              // Check if the error property exists and show the message
              const serverMessage = serverResponse.error?.[0] || serverResponse.message;
              
              if (serverMessage) {
                setUsernameMessage(serverMessage);  // Show the server's error message
              } else {
                setUsernameMessage("An unexpected error occurred");
              }
            } else {
              setUsernameMessage("Network or request error occurred");
            }
          
          

        } finally {

          setIschaking(false)
        }

      }
    }

    chackusername()

  }, [username])


  const onsubmit = async (data: any) => {

    console.log("data",data);
    

    setIsSubmiting(true)

    try {
      const response = await axios.post('/api/singup', data)

      console.log("response", response);


      console.log("onsubmit", data);

      toast({
        title: 'success',
        description: response.data.message,
      })

      router.replace(`/verify/${username}`)

      setIsSubmiting(false)
    } catch (error) {

      console.log("error in singup", error);

      const axiosError = error as AxiosError<ApiResponce>;

      let errormessage = axiosError.response?.data.message || 'something went wrong'

      console.log("errormessage", errormessage);

      toast({
        title: 'error',
        description: errormessage,
        variant: 'destructive',
      })

      setIsSubmiting(false)

    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-800">Join Mistry</h1>
      <p className="text-gray-600 text-lg">Sign up to start your journey</p>
    </div>
  
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              {ischaking && <Loader2 className="animate-spin h-4 w-4 text-indigo-500" />}
              <p
                className={`text-sm mt-2 ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}
              >
                {usernameMessage}
              </p>
              <FormDescription className="text-sm text-gray-500">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
  
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email"
                  {...field}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormDescription className="text-sm text-gray-500">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
  
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="mt-2 p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </FormControl>
              <FormDescription className="text-sm text-gray-500">
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
  
        <Button
          type="submit"
          disabled={isSubmiting}
          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {isSubmiting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  
    <div className="mt-4 text-center">
      <p className="text-gray-600 text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="text-indigo-600 hover:text-indigo-800">
          Sign in
        </Link>
      </p>
    </div>
  </div>
  
  )
}

export default page

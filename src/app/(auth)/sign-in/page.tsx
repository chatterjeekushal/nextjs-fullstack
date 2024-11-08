



'use client'

import React, { useEffect } from 'react'
import * as z from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'
import { singupSchema } from '@/schemas/singInSchema'
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
import { signIn } from 'next-auth/react'

function page() {


  const [isSubmiting, setIsSubmiting] = React.useState(false)



  const { toast } = useToast()

  const router = useRouter()

  // zod implementation

  const form = useForm({
    resolver: z.zodResolver(singupSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })



  const onsubmit = async (data: any) => {

    const result = await signIn('credentials', { email: data.email, password: data.password, redirect: false })

    console.log("result", result);

    if (result?.error) {

      toast({
        title: 'Login failed',
        description: result.error,
        variant: 'destructive'
      })
    }

    if (result?.url) {

      router.replace("/dashboard")

    }

  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Join Mistry</h1>
        <p className="text-gray-600 text-lg">Sign In to start your journey</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">


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
          Signin 
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

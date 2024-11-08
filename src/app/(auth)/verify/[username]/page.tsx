
'use client'

import React from 'react'
import * as z from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from 'next/navigation'
import { verifySchema } from '@/schemas/verifySchema'
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

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"

import { Button } from "@/components/ui/button"
import { Toast } from '@/components/ui/toast'
function Verifyotp() {

    const [isSubmiting, setIsSubmiting] = React.useState(false)

    const params = useParams<{ username: string }>()

    const router = useRouter()

    const { toast } = useToast()

    console.log("username", params.username);

    const form = useForm({
        resolver: z.zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    })



    const onSubmit = async (data: any) => {

        console.log("data", data.code);

        setIsSubmiting(true)
        try {

            const response = await axios.post('/api/verify-code', { username: params.username, code: data.code })

            console.log("response", response);

            router.replace(`/sign-in`)

            toast({
                title: 'success',
                description: response.data.message,
            })

            setIsSubmiting(false)
        } catch (error) {

            console.log("error in verify code", error);

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
       
        <div className="flex justify-center items-center min-h-screen bg-gray-100">

  <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">

    <div className="text-center mb-6">
      <h2 className="text-xl font-semibold text-gray-700">Enter your OTP</h2>
    </div>

    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700">One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="flex justify-between space-x-2">
                      <InputOTPSlot index={0} className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold" />
                      <InputOTPSlot index={1} className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold" />
                      <InputOTPSlot index={2} className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold" />
                      <InputOTPSlot index={3} className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold" />
                      <InputOTPSlot index={4} className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold" />
                      <InputOTPSlot index={5} className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold" />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription className="mt-2 text-sm text-gray-500">
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Submit
          </Button>
        </form>
      </Form>
    </div>

  </div>

</div>

    )
}

export default Verifyotp

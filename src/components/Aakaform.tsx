"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { indianRegions } from "@/utils/IndianStates"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

function RequiredFormLabel({ children }: { children: React.ReactNode }) {
  return (
    <FormLabel>
      {children}
      <span className="text-red-500 ml-1">*</span>
    </FormLabel>
  )
}

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  state: z.string().min(1, { message: "Please select a state." }),
  zipCode: z.string().regex(/^\d{6}$/, { message: "Zip Code must be 6 digits." }),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit mobile number." }),
  alternateMobileNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Please enter a valid 10-digit mobile number." })
    .or(z.literal(""))
    .optional()
})

export function AAKAForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      state: "",
      zipCode: "",
      mobileNumber: "",
      alternateMobileNumber: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      alert("User registered/updated successfully!");
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <Card className="w-full max-w-2xl mx-auto bg-white shadow-lg">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle>Billing Details</CardTitle>
        <CardDescription className="text-primary-foreground/80">
          Please fill out all the required fields below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Full Name</RequiredFormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} className="border-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Address</RequiredFormLabel>
                  <FormControl>
                    <Input placeholder="Enter your address" {...field} className="border-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>State</RequiredFormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-primary/20">
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianRegions.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Zip Code</RequiredFormLabel>
                  <FormControl>
                    <Input placeholder="Enter you zip code" {...field} className="border-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <RequiredFormLabel>Mobile Number</RequiredFormLabel>
                  <FormControl>
                    <Input placeholder="Enter your mobile number" {...field} className="border-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alternateMobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Mobile Number</FormLabel>
                  <FormControl>
                    <Input {...field} className="border-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-sm text-muted-foreground">
              Fields marked with <span className="text-red-500">*</span> are mandatory.
            </p>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

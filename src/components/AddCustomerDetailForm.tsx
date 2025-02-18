"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { indianRegions } from "@/utils/IndianStates"
import { X, User, Package } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useDebouncedValue } from "@/hooks/useDebouncedValue"
import UserOrdersModal from "./UserOrdersModal"
import { motion } from "framer-motion"

function RequiredFormLabel({ children }: { children: React.ReactNode }) {
  return (
    <FormLabel className="flex items-center">
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
    .optional(),
  orderDetails: z.string().min(2, { message: "Order details cannot be empty" }),
  numOfPieces: z.union([z.string().transform((val) => (val === "" ? undefined : Number(val))), z.number()]).optional(),
  numOfParcels: z.union([z.string().transform((val) => (val === "" ? undefined : Number(val))), z.number()]).optional(),
  totalAmount: z.union([z.string().transform((val) => (val === "" ? undefined : Number(val))), z.number()]).optional(),
  orderAddress: z.string().optional(),
  orderState: z.string().optional(),
  orderZipCode: z.string().optional(),
  trackingId: z.string().optional(),
  trackingCompany: z.string().optional(),
  paymentStatus: z.enum(["pending", "paid"]).optional(),
})

function UserSuggestions({ users, onClose, onSelect }: { users: any; onClose: any; onSelect: any }) {
  if (!users?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute z-10 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto mt-1 w-full"
    >
      <div className="flex justify-between bg-white items-center p-2 border-b sticky top-0">
        <span className="text-sm font-medium">Suggestions</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      </div>
      <div className="p-2">
        {users.map((user: any, index: any) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-2 hover:bg-gray-100 rounded-md cursor-pointer border-b border-slate-200"
            onClick={() => onSelect(user)}
          >
            <div className="font-medium">{user.fullName}</div>
            <div className="text-sm text-gray-500">{user.address}</div>
            <div className="text-sm text-gray-500">{user.mobileNumber}</div>
            <div className="flex w-full items-center justify-around mt-2">
              <div className="border border-slate-300 rounded-xl overflow-hidden">
                <UserOrdersModal userId={user.id} userName={user.fullName} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export function AddCustomerDetailForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debouncedSearch = useDebouncedValue(nameValue, 500)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    async function fetchByName() {
      if (debouncedSearch) {
        const response = await axios.get(`/api/users/searchByName?name=${encodeURIComponent(debouncedSearch)}`)
        const users = response.data
        setUsers(users)
        setShowSuggestions(true)
      } else {
        setUsers([])
        setShowSuggestions(false)
      }
    }
    fetchByName()
  }, [debouncedSearch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      address: "",
      state: "",
      zipCode: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      orderDetails: "",
      numOfPieces: undefined,
      numOfParcels: undefined,
      totalAmount: undefined,
      orderAddress: "",
      orderState: undefined,
      orderZipCode: "",
      trackingId: "",
      trackingCompany: "",
      paymentStatus: undefined,
    },
  })

  const handleUserSelect = (user: any) => {
    form.setValue("fullName", user.fullName)
    form.setValue("address", user.address)
    form.setValue("state", user.state)
    form.setValue("zipCode", user.zipCode)
    form.setValue("mobileNumber", user.mobileNumber)
    form.setValue("alternateMobileNumber", user.alternateMobileNumber)
    setShowSuggestions(false)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      form.reset(
        {
          fullName: "",
          address: "",
          state: undefined,
          zipCode: "",
          mobileNumber: "",
          alternateMobileNumber: "",
          orderDetails: "",
          numOfPieces: undefined,
          numOfParcels: undefined,
          totalAmount: undefined,
          orderAddress: "",
          orderState: undefined,
          orderZipCode: "",
          trackingId: "",
          trackingCompany: "",
          paymentStatus: undefined,
        },
        {
          keepDefaultValues: false,
        },
      )

      alert("Customer and order details saved successfully!")
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("An unknown error occurred")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl bg-transparent border-none overflow-hidden shadow-none rounded-none">
      <CardHeader className=" p-6">
        <CardTitle className="text-4xl font-bold">Customer & Order Details</CardTitle>
        {/* <CardDescription className="text-blue-100">
          Please fill out all required fields below. Order details are optional.
        </CardDescription> */}
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold flex items-center">
                <User className="mr-2" /> Customer Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <RequiredFormLabel>Full Name</RequiredFormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e)
                            setNameValue(e.target.value)
                          }}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                      {showSuggestions && (
                        <UserSuggestions
                          users={users}
                          onClose={() => setShowSuggestions(false)}
                          onSelect={handleUserSelect}
                        />
                      )}
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
                        <Input
                          placeholder="Enter mobile number"
                          {...field}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <RequiredFormLabel>Address</RequiredFormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your address"
                        {...field}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <RequiredFormLabel>State</RequiredFormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
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
                        <Input
                          placeholder="Enter zip code"
                          {...field}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
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
                        <Input
                          placeholder="Enter alternate number"
                          {...field}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold flex items-center">
                <Package className="mr-2" /> Order Details (Optional)
              </h3>

              <FormField
                control={form.control}
                name="orderDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter order details"
                        className="min-h-[100px] border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="numOfPieces"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Pieces</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? undefined : Number(value))
                          }}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numOfParcels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Parcels</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? undefined : Number(value))
                          }}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const value = e.target.value
                            field.onChange(value === "" ? undefined : Number(value))
                          }}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="orderAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leave empty if same as user address"
                        {...field}
                        value={field.value}
                        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="orderState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order State (Leave empty if same)</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} defaultValue="">
                        <FormControl>
                          <SelectTrigger className="border-gray-300 focus:ring-blue-500 focus:border-blue-500">
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
                  name="orderZipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Zip Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Leave empty if same"
                          {...field}
                          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="trackingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking ID</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trackingCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tracking Company</FormLabel>
                      <FormControl>
                        <Input {...field} className="border-gray-300 focus:ring-blue-500 focus:border-blue-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)
                        }}
                        value={field.value || ""}
                        defaultValue=""
                        className="flex space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="pending" />
                          </FormControl>
                          <FormLabel className="font-normal">Pending</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="paid" />
                          </FormControl>
                          <FormLabel className="font-normal">Paid</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <p className="text-sm text-gray-500 mb-4">
                Fields marked with <span className="text-red-500">*</span> are mandatory.
              </p>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </motion.div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


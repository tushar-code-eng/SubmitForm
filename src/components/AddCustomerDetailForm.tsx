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
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

function RequiredFormLabel({ children }: { children: React.ReactNode }) {
    return (
        <FormLabel>
            {children}
            <span className="text-red-500 ml-1">*</span>
        </FormLabel>
    )
}

const formSchema = z.object({
    // User details (required)
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

    // Order details (all optional)
    orderDetails: z.string().optional(),
    numOfPieces: z
        .string()
        .transform(value => (value === "" ? 0 : Number(value)))  // Converts to number or 0 if empty
        .refine(value => value >= 0, { message: "Number of pieces cannot be negative." })
        .optional(),

    numOfParcels: z
        .string()
        .transform(value => (value === "" ? 0 : Number(value)))  // Converts to number or 0 if empty
        .refine(value => value >= 0, { message: "Number of parcels cannot be negative." })
        .optional(),

    totalAmount: z
        .string()
        .transform(value => (value === "" ? 0 : Number(value)))  // Converts to number or 0 if empty
        .refine(value => value >= 0, { message: "Total amount cannot be negative." })
        .optional(),
    trackingId: z.string().optional(),
    trackingCompany: z.string().optional(),
    paymentStatus: z.enum(["pending", "paid"]).optional(),
})

export function AddCustomerDetailForm() {
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
            orderDetails: "",
            numOfPieces: 0,
            numOfParcels: 0,
            totalAmount: 0,
            trackingId: "",
            trackingCompany: "",
            paymentStatus: undefined,
        },
    })

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

            alert("Customer and order details saved successfully!")
            form.reset()
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
        <Card className="w-full max-w-3xl mx-auto bg-white shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle>Customer & Order Details</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                    Please fill out all required fields below. Order details are optional.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 mt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Customer Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Customer Details</h3>

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

                            <div className="grid grid-cols-2 gap-4">
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
                                                <Input placeholder="Enter zip code" {...field} className="border-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <RequiredFormLabel>Mobile Number</RequiredFormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter mobile number" {...field} className="border-primary/20" />
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
                                                <Input placeholder="Enter alternate number" {...field} className="border-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Order Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Order Details (Optional)</h3>

                            <FormField
                                control={form.control}
                                name="orderDetails"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Order Details</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter order details"
                                                className="min-h-[100px] border-primary/20"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="numOfPieces"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Number of Pieces</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} className="border-primary/20" />
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
                                                <Input type="number" {...field} className="border-primary/20" />
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
                                                <Input type="number" {...field} className="border-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="trackingId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tracking ID</FormLabel>
                                            <FormControl>
                                                <Input {...field} className="border-primary/20" />
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
                                                <Input {...field} className="border-primary/20" />
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
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
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
                        </div>

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
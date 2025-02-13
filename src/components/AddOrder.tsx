import React, { useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Button } from './ui/button'
import { Input } from './ui/input'

type OrderFormData = {
    orderDetails: string
    numOfPieces: number
    numOfParcels: number
    totalAmount: number
    trackingId: string
    trackingCompany: string
    paymentStatus: 'pending' | 'paid'
}

type User = {
    id: string
    fullName: string
    address: string
    state: string
    zipCode: string
    mobileNumber: string
    alternateMobileNumber?: string
}

const AddOrder = ({user}:{user:any}) => {

    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<OrderFormData>({
        orderDetails: '',
        numOfPieces: 0,
        numOfParcels: 0,
        totalAmount: 0,
        trackingId: '',
        trackingCompany: '',
        paymentStatus: 'pending'
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('num') || name === 'totalAmount' ? parseInt(value) || 0 : value
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleAddOrder = async () => {
        if (!selectedUser) return

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userId: selectedUser
                }),
            })

            if (!response.ok) throw new Error('Failed to create order')

            toast({
                title: "Success",
                description: "Order created successfully"
            })

            // Reset form and close dialog
            setFormData({
                orderDetails: '',
                numOfPieces: 0,
                numOfParcels: 0,
                totalAmount: 0,
                trackingId: '',
                trackingCompany: '',
                paymentStatus: 'paid'
            })
            setIsDialogOpen(false)

        } catch (error) {
            console.error('Error:', error)
            toast({
                title: "Error",
                description: "Failed to create order",
                variant: "destructive"
            })
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => setSelectedUser(user)}
                >
                    Add Order
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Order for {user.fullName}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="orderDetails" className="text-right">
                            Order Details
                        </Label>
                        <Input
                            id="orderDetails"
                            name="orderDetails"
                            value={formData.orderDetails}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numOfPieces" className="text-right">
                            Pieces
                        </Label>
                        <Input
                            id="numOfPieces"
                            name="numOfPieces"
                            type="number"
                            value={formData.numOfPieces}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="numOfParcels" className="text-right">
                            Parcels
                        </Label>
                        <Input
                            id="numOfParcels"
                            name="numOfParcels"
                            type="number"
                            value={formData.numOfParcels}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="totalAmount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="totalAmount"
                            name="totalAmount"
                            type="number"
                            value={formData.totalAmount}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trackingId" className="text-right">
                            Tracking ID
                        </Label>
                        <Input
                            id="trackingId"
                            name="trackingId"
                            value={formData.trackingId}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trackingCompany" className="text-right">
                            Company
                        </Label>
                        <Input
                            id="trackingCompany"
                            name="trackingCompany"
                            value={formData.trackingCompany}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="paymentStatus" className="text-right">
                            Payment
                        </Label>
                        <Select
                            name="paymentStatus"
                            value={formData.paymentStatus}
                            onValueChange={(value) => handleSelectChange('paymentStatus', value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddOrder}>
                        Add Order
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddOrder

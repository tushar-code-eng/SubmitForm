import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import axios from 'axios';
import { format } from "date-fns";
import { toZonedTime } from 'date-fns-tz';
import { indianRegions } from '@/utils/IndianStates';

interface Order {
    id: string;
    orderDetails: string;
    numOfPieces: number;
    numOfParcels: number;
    totalAmount: number;
    orderAddress: string;
    orderState: string;
    orderZipCode: string;
    trackingId: string;
    trackingCompany: string;
    paymentStatus: 'pending' | 'paid';
    orderDate: string;
}

interface UserOrdersModalProps {
    userId: string;
    userName: string;
}

export default function UserOrdersModal({ userId, userName }: UserOrdersModalProps) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [editedOrders, setEditedOrders] = useState<Record<string, Order>>({});
    const [isLoading, setIsLoading] = useState(false);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`/api/orders/${userId}`);
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const handleEdit = (orderId: string, field: keyof Order, value: any) => {
        setEditedOrders(prev => ({
            ...prev,
            [orderId]: {
                ...(prev[orderId] || orders.find(o => o.id === orderId) || {}),
                [field]: value,
            } as Order
        }));
    };

    const handleUpdateOrder = async (orderId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedOrders[orderId]),
            });

            if (!response.ok) throw new Error('Failed to update order');

            toast({
                title: "Success",
                description: "Order updated successfully",
            });

            // Refresh orders
            await fetchOrders();

            // Clear edited state for this order
            setEditedOrders(prev => {
                const newState = { ...prev };
                delete newState[orderId];
                return newState;
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog onOpenChange={(open) => open && fetchOrders()}>
            <DialogTrigger asChild>
                <Button variant="outline">View Orders</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{userName}'s Orders</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    {orders.map((order) => {
                        const editedOrder = editedOrders[order.id];
                        const isEdited = !!editedOrder;

                        return (
                            <Card key={order.id}>
                                <CardHeader>
                                    <CardTitle>Order Date : {(() => {
                                        const [year, month, day] = order.orderDate.split("T")[0].split("-");
                                        return `${day}/${month}/${year}`;
                                    })()}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Order Details</Label>
                                                <Input
                                                    value={editedOrder?.orderDetails ?? order.orderDetails}
                                                    onChange={(e) => handleEdit(order.id, 'orderDetails', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Number of Pieces</Label>
                                                <Input
                                                    type="number"
                                                    value={editedOrder?.numOfPieces ?? order.numOfPieces}
                                                    onChange={(e) => handleEdit(order.id, 'numOfPieces', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Number of Parcels</Label>
                                                <Input
                                                    type="number"
                                                    value={editedOrder?.numOfParcels ?? order.numOfParcels}
                                                    onChange={(e) => handleEdit(order.id, 'numOfParcels', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label>Total Amount</Label>
                                                <Input
                                                    type="number"
                                                    value={editedOrder?.totalAmount ?? order.totalAmount}
                                                    onChange={(e) => handleEdit(order.id, 'totalAmount', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Order Address</Label>
                                                <Input
                                                    value={editedOrder?.orderAddress ?? order.orderAddress}
                                                    onChange={(e) => handleEdit(order.id, 'orderAddress', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <Label>Order ZipCode</Label>
                                                <Input
                                                    type="number"
                                                    value={editedOrder?.orderZipCode ?? order.orderZipCode}
                                                    onChange={(e) => handleEdit(order.id, 'orderZipCode', parseInt(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Tracking ID</Label>
                                                <Input
                                                    value={editedOrder?.trackingId ?? order.trackingId}
                                                    onChange={(e) => handleEdit(order.id, 'trackingId', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Tracking Company</Label>
                                                <Input
                                                    value={editedOrder?.trackingCompany ?? order.trackingCompany}
                                                    onChange={(e) => handleEdit(order.id, 'trackingCompany', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Order State</Label>
                                                <Select
                                                    value={editedOrder?.orderState ?? order.orderState}
                                                    onValueChange={(value) => handleEdit(order.id, 'orderState', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {indianRegions.map((state) => (
                                                            <SelectItem key={state} value={state}>
                                                                {state}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Payment Status</Label>
                                                <Select
                                                    value={editedOrder?.paymentStatus ?? order.paymentStatus}
                                                    onValueChange={(value) => handleEdit(order.id, 'paymentStatus', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Pending</SelectItem>
                                                        <SelectItem value="paid">Paid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    {isEdited && (
                                        <Button
                                            onClick={() => handleUpdateOrder(order.id)}
                                            disabled={isLoading}
                                        >
                                            Update Order
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
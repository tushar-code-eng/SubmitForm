import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Textarea } from './ui/textarea';
import { indianRegions } from '@/utils/IndianStates';

interface User {
    id: string;
    fullName: string;
    address: string;
    state: string;
    zipCode: string;
    mobileNumber: string;
    alternateMobileNumber?: string;
    createdAt: Date;
    printDates: Date[];
}

interface EditUserDetailsProps {
    userId: string;
    userName: string;
}

export default function EditUserDetails({ userId, userName }: EditUserDetailsProps) {
    const [details, setDetails] = useState<User | null>(null);
    const [editedDetails, setEditedDetails] = useState<Partial<User>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const fetchDetails = async () => {
        try {
            const response = await fetch(`/api/users/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user details');
            const data = await response.json();
            setDetails(data);
        } catch (error) {
            console.error('Failed to fetch user details', error);
            toast({
                title: "Error",
                description: "Failed to fetch user details",
                variant: "destructive",
            });
        }
    };

    const handleEdit = (field: keyof User, value: string) => {
        setEditedDetails(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const hasChanges = Object.keys(editedDetails).length > 0;

    const handleUpdateUser = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedDetails),
            });

            if (!response.ok) throw new Error('Failed to update user');

            toast({
                title: "Success",
                description: "User details updated successfully",
            });

            await fetchDetails();
            setEditedDetails({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update user details",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDialogChange = (open: boolean) => {
        setIsOpen(open);
        if (open) {
            fetchDetails();
        } else {
            setEditedDetails({});
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-violet-600 text-white">
                    Edit User
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{userName}</DialogTitle>
                </DialogHeader>
                {details && (
                    <div className="grid gap-4">
                        <Card>
                            <CardContent>
                                <div className="grid gap-4 py-4">
                                    <div>
                                        <Label>Full Name</Label>
                                        <Input
                                            value={editedDetails.fullName ?? details.fullName}
                                            onChange={(e) => handleEdit('fullName', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label>Address</Label>
                                        <Textarea
                                            value={editedDetails.address ?? details.address}
                                            onChange={(e) => handleEdit('address', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>State</Label>
                                            <Select
                                                value={editedDetails.state ?? details.state}
                                                onValueChange={(value) => handleEdit('state', value)}
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
                                            <Label>Zip Code</Label>
                                            <Input
                                                value={editedDetails.zipCode ?? details.zipCode}
                                                onChange={(e) => handleEdit('zipCode', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>Mobile Number</Label>
                                            <Input
                                                value={editedDetails.mobileNumber ?? details.mobileNumber}
                                                onChange={(e) => handleEdit('mobileNumber', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label>Alternate Mobile Number</Label>
                                            <Input
                                                value={editedDetails.alternateMobileNumber ?? details.alternateMobileNumber}
                                                onChange={(e) => handleEdit('alternateMobileNumber', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleUpdateUser}
                                    disabled={isLoading || !hasChanges}
                                >
                                    {isLoading ? 'Updating...' : 'Update User'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
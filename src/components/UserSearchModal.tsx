import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import axios from 'axios';

const UserSearchModal = ({ handleAddAdditionalUser, additionalUser, setAdditionalUserArray }: {
    handleAddAdditionalUser: any,
    additionalUser: any,
    setAdditionalUserArray: any
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);



    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) throw new Error('Failed to fetch users');
                const data = await response.json();
                setAllUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        if (isOpen) {
            fetchAllUsers();
        }
    }, [isOpen]);

    useEffect(() => {
        const filtered = allUsers.filter((user: any) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                user.fullName.toLowerCase().includes(searchLower) ||
                user.mobileNumber.includes(searchLower) ||
                user.address.toLowerCase().includes(searchLower) ||
                user.state.toLowerCase().includes(searchLower) ||
                (user.registrationDate && user.registrationDate.includes(searchTerm))
            );
        });
        setFilteredUsers(filtered);
    }, [searchTerm, allUsers]);

    const handleAddAdditionalUserTemp = (user: any) => {
        setAdditionalUserArray((prevSelectedUsers: any) => {
            if (prevSelectedUsers.some((selected: any) => selected.id === user.id)) {
                return prevSelectedUsers.filter((selected: any) => selected.id !== user.id);
            } else {
                return [...prevSelectedUsers, user];
            }
        });
    };



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="gap-2"
                >
                    <Search className="h-4 w-4" />
                    Add New Order
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Search Users</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Search by name, address, state or date..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                    <ScrollArea className="h-[60vh]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Select</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Mobile Number</TableHead>
                                    <TableHead>Registration Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                // checked={selectedUsers.some((selected: any) => selected.id === user.id)}
                                                onCheckedChange={() => handleAddAdditionalUserTemp(user)}
                                            />
                                        </TableCell>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell>{user.state}</TableCell>
                                        <TableCell>{user.mobileNumber}</TableCell>
                                        <TableCell>{user.registrationDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <DialogClose className='border p-2' onClick={handleAddAdditionalUser}>
                            Add Selected Users
                        </DialogClose>
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserSearchModal;
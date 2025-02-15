"use client"

import { useEffect, useState } from "react"
import { type User } from "@/utils/mockData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import logo from "../../../public/imgaaka.png"
import UserSearchModal from "@/components/UserSearchModal"

import axios from 'axios'
import AddOrder from "@/components/AddOrder"
import UserOrdersModal from "@/components/UserOrdersModal"

export default function UserManagement() {
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


    const [trackingIdUsers, setTrackingIdUsers] = useState<User[]>([])
    const [trackingIdFilter, setTrackingIdFilter] = useState<User[]>([])

    const [additionalUserArray, setAdditionalUserArray] = useState<any[]>([]);
    const [isRequestCompleted, setIsRequestCompleted] = useState<boolean>(false);

    const [editingTrackingIds, setEditingTrackingIds] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/users?date=${selectedDate}`)
                if (!response.ok) throw new Error("Failed to fetch users")

                const data: User[] = await response.json()
                console.log(data)

                // Sort the users alphabetically by fullName
                const sortedUsers = [...data].sort((a, b) =>
                    a.fullName.localeCompare(b.fullName)
                )

                setUsers(sortedUsers)
                setFilteredUsers(sortedUsers)
            } catch (err) {
                console.log("Error fetching users. Please try again later.", err)
            }
        }
        fetchUsers()
    }, [selectedDate, isRequestCompleted])

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value)
        setEditingTrackingIds(false)
    }

    const handleUserSelection = (user: User) => {
        setSelectedUsers((prev) =>
            prev.some((selectedUser) => selectedUser.id === user.id)
                ? prev.filter((selectedUser) => selectedUser.id !== user.id)
                : [...prev, user],
        )
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedUsers(checked ? [...users] : [])
    }


    const handleDeleteSelectedUsers = async () => {
        if (!selectedDate) {
            toast({
                title: "No Date Selected",
                description: "Please select a date to delete print records.",
                variant: "destructive"
            })
            return
        }

        if (selectedUsers.length === 0) {
            toast({
                title: "No Users Selected",
                description: "Please select users to delete print records.",
                variant: "destructive"
            })
            return
        }

        try {
            setIsLoading(true)
            const response = await axios.delete('/api/deletePrint', {
                data: {
                    userIds: selectedUsers.map(user => user.id),
                    printDate: selectedDate
                }
            })

            console.log(response)

            toast({
                title: "Success",
                description: "Print records deleted successfully.",
            })

            setSelectedUsers([])
            setIsRequestCompleted(prev => !prev)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete print records.",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }


    const handlePrintSelectedUsers = () => {
        if (selectedUsers.length === 0) {
            toast({
                title: "No Users Selected",
                description: "Please select users to print.",
            })
            return
        }
        const sendingOrderIdsOnly = users.map((user: any) => user.orders[0].id ?? null)

        const updateBool = async () => {
            const res = await axios.put(`/api/updatePrintBool`, sendingOrderIdsOnly);
            console.log("ranran", res)
        }
        updateBool()

        const printWindow = window.open("", "_blank")
        if (printWindow) {
            printWindow.document.write(`
            <html>
            <head>
              <style>
                @media print {
                  @page {
                    size: A4;
                    margin: 10mm;
                  }
                }
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                //   padding: 15px;
                  box-sizing: border-box;
                }
                .page {
                  display: flex;
                  flex-direction: column;
                  gap: 25px;
                  height: auto;
                  page-break-after: avoid;
                }
                .shipping-label {
                  border: 1px solid #000;
                  padding: 5px;
                  flex: 1;
                  height: calc((277mm - 65px) / 3);
                  box-sizing: border-box;
                }
                .header {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-bottom: 15px;
                  border-bottom: 1px solid #000;
                  padding-bottom: 10px;
                }
                .logo {
                  width: 40px;
                  height: 40px;
                  margin-right: 10px;
                }
                .company-name {
                  font-size: 20px;
                  font-weight: bold;
                }
                .shipping-title {
                  font-weight: bold;
                  margin-bottom: 8px;
                }
                .address-line {
                  margin: 4px 0;
                  max-width:50%;
                }
                .from-address {
                  margin-top: 15px;
                  text-align: right;
                  border-top: 1px solid #000;
                  padding-top: 8px;
                  font-size: 0.9em;
                }
              </style>
            </head>
            <body>
          `)

            const pages = []
            const pageSize = 3;

            for (let i = 0; i < selectedUsers.length; i += pageSize) {
                pages.push(selectedUsers.slice(i, i + pageSize));
            }

            pages.forEach((pageUsers, pageIndex) => {
                const isLastPage = pageIndex === pages.length - 1;
                printWindow.document.write(`<div class="page" style="${!isLastPage ? 'page-break-after: always;' : ''}">`);

                pageUsers.forEach((user: any) => {
                    const addressParts = (user.orders && user.orders.length > 0 && user.orders[0].orderAddress) ? user.orders[0].orderAddress.split(",") : user.address.split(",");
                    const mainAddress = addressParts.slice(0, -1).join(",");
                    const cityState = addressParts[addressParts.length - 1];

                    const userState = (user.orders && user.orders.length > 0 && user.orders[0].orderState) ? user.orders[0].orderState : user.state
                    const userZip = (user.orders && user.orders.length > 0 && user.orders[0].orderZipCode) ? user.orders[0].orderZipCode : user.zipCode

                    printWindow.document.write(`
                    <div class="shipping-label">
                        <div class="header">
                            <img src="https://s3-inventorymanagementwow.s3.ap-south-1.amazonaws.com/imgaaka.png" alt="AAKA Logo" class="logo">
                            <div class="company-name">Night Suits By Aaka</div>
                        </div>
                        <div class="shipping-title">Shipping Address:</div>
                        <div class="address-line">${user.fullName}</div>
                        <div class="address-line">${mainAddress}</div>
                        <div class="address-line">${cityState}, ${userState} ${userZip}</div>
                        <div class="address-line">${user.mobileNumber}${user.alternateMobileNumber ? " / " + user.alternateMobileNumber : ""}</div>
                        <div class="from-address">
                            From Address:<br>
                            Night Suits By Aaka<br>
                            Apoorva<br>
                            7009928110
                        </div>
                    </div>
                    `);
                });

                printWindow.document.write("</div>");
            });

            printWindow.document.write("</body></html>");
            printWindow.document.close();
            printWindow.print();
        }
    }

    // const handleAddAdditionalUserToDb = async () => {
    //     try {
    //         const response = await axios.post('/api/additionalUser', {
    //             users: additionalUserArray.map((user) => ({ mobileNumber: user.mobileNumber })),
    //         });

    //         console.log('Users updated:', response.data);
    //         setIsRequestCompleted(!isRequestCompleted);
    //     } catch (error: any) {
    //         if (error.response) {
    //             console.error('Error response:', error.response.data.message);
    //         } else if (error.request) {
    //             console.error('Error request:', error.request);
    //         } else {
    //             console.error('Error message:', error.message);
    //         }
    //     }
    // };

    const handleEditingTrackingIds = async () => {
        setEditingTrackingIds(!editingTrackingIds)
        const response = await axios.get(`/api/orders?date=${selectedDate}`)
        const orderData = response.data
        const filteredData = await orderData.filter((item: any) =>
            !item.trackingId || !item.trackingCompany
        );
        const uniqueUsers = new Map();

        filteredData.forEach((order: any) => {
            if (!uniqueUsers.has(order.user.id)) {
                uniqueUsers.set(order.user.id, order.user);
            }
        });

        const users = Array.from(uniqueUsers.values());
        // Sort tracking ID users alphabetically
        const sortedUsers = [...users].sort((a, b) =>
            a.fullName.localeCompare(b.fullName)
        );
        setTrackingIdUsers(sortedUsers);
    }

    useEffect(() => {
        if (editingTrackingIds) {
            const filtered = trackingIdUsers
                .filter((user: any) => {
                    const searchLower = searchTerm.toLowerCase();
                    return (
                        user.fullName.toLowerCase().includes(searchLower) ||
                        user.mobileNumber.includes(searchLower) ||
                        user.address.toLowerCase().includes(searchLower) ||
                        user.state.toLowerCase().includes(searchLower) ||
                        (user.registrationDate && user.registrationDate.includes(searchTerm))
                    );
                })
                .sort((a, b) => a.fullName.localeCompare(b.fullName));
            setTrackingIdFilter(filtered);
        } else {
            const filtered = users.filter((user: any) => {
                const searchLower = searchTerm.toLowerCase();
                return (
                    user.fullName.toLowerCase().includes(searchLower) ||
                    user.mobileNumber.includes(searchLower) ||
                    user.address.toLowerCase().includes(searchLower) ||
                    user.state.toLowerCase().includes(searchLower) ||
                    (user.registrationDate && user.registrationDate.includes(searchTerm))
                );
            });
            // No need to sort filtered users as they inherit the sort from users
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users, trackingIdUsers]);

    return (
        <div className="container mx-auto py-10 bg-secondary min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-primary">AAKA User Management</h1>
            <Card className="w-full bg-white shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle>Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Registration Date:
                        </label>
                        <Input
                            type="date"
                            id="dateFilter"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="border-primary/20"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-3" >
                        {/* <UserSearchModal handleAddAdditionalUser={handleAddAdditionalUserToDb} additionalUser={additionalUserArray} setAdditionalUserArray={setAdditionalUserArray} /> */}
                        <Button
                            onClick={handleDeleteSelectedUsers}
                            disabled={selectedUsers.length === 0 || !selectedDate || isLoading}
                            variant="destructive"
                        >
                            Delete Print Records
                        </Button>
                        <Input
                            placeholder="Search by name, address, state or date..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className=""
                        />
                        <div className={`text-center text-sm font-semibold px-2 py-1 rounded-lg cursor-pointer ${editingTrackingIds ? "bg-red-500 text-white" : " text-black"}`} onClick={handleEditingTrackingIds}>
                            Edit TrackingIds
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700">Selected Users: {selectedUsers.length}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={users.length > 0 && selectedUsers.length === users.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="w-[50px]">S.No</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Address</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Zip Code</TableHead>
                                    <TableHead>Mobile Number</TableHead>
                                    <TableHead>Alternate Mobile</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    editingTrackingIds ?
                                        (trackingIdFilter.map((user: any, index) => (
                                            <TableRow key={user.id} className={`${(user.orders && user.orders.length > 0 && user.orders[0].isPrinted) ? 'bg-green-300' : 'bg-transparent'}`}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
                                                        onCheckedChange={() => handleUserSelection(user)}
                                                    />
                                                </TableCell>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{user.fullName}</TableCell>
                                                <TableCell >
                                                    {
                                                        (user.orders && user.orders.length > 0 && user.orders[0].orderAddress) ?
                                                            user.orders[0].orderAddress :
                                                            user.address
                                                    }
                                                </TableCell>
                                                <TableCell>{(user.orders && user.orders.length > 0 && user.orders[0].orderState) ? user.orders[0].orderState : user.state}</TableCell>
                                                <TableCell>{(user.orders && user.orders.length > 0 && user.orders[0].orderZipCode) ? user.orders[0].orderZipCode : user.zipCode}</TableCell>
                                                <TableCell>{user.mobileNumber}</TableCell>
                                                <TableCell>{user.alternateMobileNumber || "-"}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {/* <AddOrder user={user.id} /> */}
                                                        <UserOrdersModal userId={user.id} userName={user.fullName} />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )))
                                        : (
                                            filteredUsers.map((user: any, index) => (
                                                <TableRow key={user.id} className={`${(user.orders && user.orders.length > 0 && user.orders[0].isPrinted) ? 'bg-green-300' : 'bg-transparent'}`}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
                                                            onCheckedChange={() => handleUserSelection(user)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{user.fullName}</TableCell>
                                                    <TableCell >
                                                        {
                                                            (user.orders && user.orders.length > 0 && user.orders[0].orderAddress) ?
                                                                user.orders[0].orderAddress :
                                                                user.address
                                                        }
                                                    </TableCell>
                                                    <TableCell>{(user.orders && user.orders.length > 0 && user.orders[0].orderState) ? user.orders[0].orderState : user.state}</TableCell>
                                                    <TableCell>{(user.orders && user.orders.length > 0 && user.orders[0].orderZipCode) ? user.orders[0].orderZipCode : user.zipCode}</TableCell>
                                                    <TableCell>{user.mobileNumber}</TableCell>
                                                    <TableCell>{user.alternateMobileNumber || "-"}</TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            {/* <AddOrder user={user.id} /> */}
                                                            <UserOrdersModal userId={user.id} userName={user.fullName} />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )
                                }
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-4">
                        <Button onClick={handlePrintSelectedUsers} disabled={selectedUsers.length === 0} className="w-full">
                            Print
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


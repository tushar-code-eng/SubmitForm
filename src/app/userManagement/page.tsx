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

export default function UserManagement() {
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`/api/users?date=${selectedDate}`)
                if (!response.ok) throw new Error("Failed to fetch users")

                const data: User[] = await response.json()
                setUsers(data)
            } catch (err) {
                console.log("Error fetching users. Please try again later.",err)
            }
        }

        fetchUsers()
    }, [selectedDate])

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value)
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

    const handlePrintSelectedUsers = () => {
        if (selectedUsers.length === 0) {
            toast({
                title: "No Users Selected",
                description: "Please select users to print.",
            })
            return
        }
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
                  padding: 15px;
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
                  padding: 15px;
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
    
                pageUsers.forEach((user) => {
                    const addressParts = user.address.split(",");
                    const mainAddress = addressParts.slice(0, -1).join(",");
                    const cityState = addressParts[addressParts.length - 1];
    
                    printWindow.document.write(`
                    <div class="shipping-label">
                        <div class="header">
                            <img src="https://s3-inventorymanagementwow.s3.ap-south-1.amazonaws.com/imgaaka.png" alt="AAKA Logo" class="logo">
                            <div class="company-name">Night Suits By Aaka</div>
                        </div>
                        <div class="shipping-title">Shipping Address:</div>
                        <div class="address-line">${user.fullName}</div>
                        <div class="address-line">${mainAddress}</div>
                        <div class="address-line">${cityState}, ${user.state} ${user.zipCode}</div>
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

    return (
        <div className="container mx-auto py-10 bg-secondary min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-6 text-primary">AAKA User Management</h1>
            <Card className="w-full bg-white shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle>User Details</CardTitle>
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
                                                onCheckedChange={() => handleUserSelection(user)}
                                            />
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.fullName}</TableCell>
                                        <TableCell>{user.address}</TableCell>
                                        <TableCell>{user.state}</TableCell>
                                        <TableCell>{user.zipCode}</TableCell>
                                        <TableCell>{user.mobileNumber}</TableCell>
                                        <TableCell>{user.alternateMobileNumber || "-"}</TableCell>
                                    </TableRow>
                                ))}
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
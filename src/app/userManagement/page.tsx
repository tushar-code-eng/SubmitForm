"use client"

import { useEffect, useState } from "react"
import { mockUsers, type User } from "@/utils/mockData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

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
                console.log("Error fetching users. Please try again later.")
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
            //   <title>Shipping Labels - Night Suits By Aaka</title>
              <style>
                @media print {
                  @page {
                    size: A4;
                    margin: 10mm;
                  }
                  .page-break {
                    break-after: page;
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
                  gap: 15px; /* Space between labels for tearing */
                  page-break-after: always;
                  min-height: calc(297mm - 20mm); /* A4 height minus margins */
                }
                .page:last-child {
                  page-break-after: auto;
                }
                .shipping-label {
                  border: 1px solid #000;
                  padding: 15px;
                  flex: 1;
                  max-height: calc((250mm - 20mm - 30px) / 3); /* Equal height for 3 labels minus gaps */
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
            const pageSize = 3; // number of users per page

            for (let i = 0; i < selectedUsers.length; i += pageSize) {
                pages.push(selectedUsers.slice(i, i + pageSize));
            }

            // Print each page
            pages.forEach((pageUsers, pageIndex) => {
                printWindow.document.write('<div class="page">');

                pageUsers.forEach((user) => {
                    const addressParts = user.address.split(",");
                    const mainAddress = addressParts.slice(0, -1).join(",");
                    const cityState = addressParts[addressParts.length - 1];

                    printWindow.document.write(`
        <div class="shipping-label">
            <div class="header">
                <img src="logo-url" alt="AAKA Logo" class="logo">
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

            // Avoid adding an extra page if there are fewer than 3 labels on the last page
            if (pages.length > 0 && pages[pages.length - 1].length < pageSize) {
                printWindow.document.write('<div class="page"></div>');  // Empty page fix, avoid unnecessary page break
            }

            printWindow.document.write("</body></html>");
            printWindow.document.close();
            printWindow.print();


            // const pages = []
            // for (let i = 0; i < selectedUsers.length; i += 3) {
            //     pages.push(selectedUsers.slice(i, i + 3))
            // }

            // // Print each page
            // pages.forEach((pageUsers, pageIndex) => {
            //     printWindow.document.write('<div class="page">')

            //     // Print users on this page (up to 3)
            //     pageUsers.forEach((user) => {
            //         const addressParts = user.address.split(",")
            //         const mainAddress = addressParts.slice(0, -1).join(",")
            //         const cityState = addressParts[addressParts.length - 1]

            //         printWindow.document.write(`
            //     <div class="shipping-label">
            //       <div class="header">
            //         <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wa.jpg-RspKLoMSFVfhIsY0nTA16Pu1uYL5Y4.jpeg" alt="AAKA Logo" class="logo">
            //         <div class="company-name">Night Suits By Aaka</div>
            //       </div>
            //       <div class="shipping-title">Shipping Address:</div>
            //       <div class="address-line">${user.fullName}</div>
            //       <div class="address-line">${mainAddress}</div>
            //       <div class="address-line">${cityState}, ${user.state} ${user.zipCode}</div>
            //       <div class="address-line">${user.mobileNumber}${user.alternateMobileNumber ? " / " + user.alternateMobileNumber : ""}</div>
            //       <div class="from-address">
            //         From Address:<br>
            //         Night Suits By Aaka<br>
            //         Apoorva<br>
            //         7009928110
            //       </div>
            //     </div>
            //   `)
            //     })

            //     printWindow.document.write("</div>")
            // })

            // printWindow.document.write("</body></html>")
            // printWindow.document.close()
            // printWindow.print()
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
                                    <TableHead className="w-[50px]">Select</TableHead>
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


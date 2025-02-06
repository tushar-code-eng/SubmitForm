// "use client"

// import { useEffect, useState } from "react"
// import { type User } from "@/utils/mockData"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Button } from "@/components/ui/button"
// import { toast } from "@/hooks/use-toast"
// import logo from "../../../public/imgaaka.png"

// export default function UserManagement() {
//     const [selectedDate, setSelectedDate] = useState<string>("")
//     const [selectedUsers, setSelectedUsers] = useState<User[]>([])
//     const [users, setUsers] = useState<User[]>([])

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await fetch(`/api/users?date=${selectedDate}`)
//                 if (!response.ok) throw new Error("Failed to fetch users")

//                 const data: User[] = await response.json()
//                 setUsers(data)
//             } catch (err) {
//                 console.log("Error fetching users. Please try again later.",err)
//             }
//         }

//         fetchUsers()
//     }, [selectedDate])

//     const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSelectedDate(e.target.value)
//     }

//     const handleUserSelection = (user: User) => {
//         setSelectedUsers((prev) =>
//             prev.some((selectedUser) => selectedUser.id === user.id)
//                 ? prev.filter((selectedUser) => selectedUser.id !== user.id)
//                 : [...prev, user],
//         )
//     }

//     const handleSelectAll = (checked: boolean) => {
//         setSelectedUsers(checked ? [...users] : [])
//     }

//     const handlePrintSelectedUsers = () => {
//         if (selectedUsers.length === 0) {
//             toast({
//                 title: "No Users Selected",
//                 description: "Please select users to print.",
//             })
//             return
//         }
//         const printWindow = window.open("", "_blank")
//         if (printWindow) {
//             printWindow.document.write(`
//             <html>
//             <head>
//               <style>
//                 @media print {
//                   @page {
//                     size: A4;
//                     margin: 10mm;
//                   }
//                 }
//                 body {
//                   font-family: Arial, sans-serif;
//                   margin: 0;
//                   padding: 15px;
//                   box-sizing: border-box;
//                 }
//                 .page {
//                   display: flex;
//                   flex-direction: column;
//                   gap: 25px;
//                   height: auto;
//                   page-break-after: avoid;
//                 }
//                 .shipping-label {
//                   border: 1px solid #000;
//                   padding: 15px;
//                   flex: 1;
//                   height: calc((277mm - 65px) / 3);
//                   box-sizing: border-box;
//                 }
//                 .header {
//                   display: flex;
//                   align-items: center;
//                   justify-content: center;
//                   margin-bottom: 15px;
//                   border-bottom: 1px solid #000;
//                   padding-bottom: 10px;
//                 }
//                 .logo {
//                   width: 40px;
//                   height: 40px;
//                   margin-right: 10px;
//                 }
//                 .company-name {
//                   font-size: 20px;
//                   font-weight: bold;
//                 }
//                 .shipping-title {
//                   font-weight: bold;
//                   margin-bottom: 8px;
//                 }
//                 .address-line {
//                   margin: 4px 0;
//                   max-width:50%;
//                 }
//                 .from-address {
//                   margin-top: 15px;
//                   text-align: right;
//                   border-top: 1px solid #000;
//                   padding-top: 8px;
//                   font-size: 0.9em;
//                 }
//               </style>
//             </head>
//             <body>
//           `)

//             const pages = []
//             const pageSize = 3;

//             for (let i = 0; i < selectedUsers.length; i += pageSize) {
//                 pages.push(selectedUsers.slice(i, i + pageSize));
//             }

//             pages.forEach((pageUsers, pageIndex) => {
//                 const isLastPage = pageIndex === pages.length - 1;
//                 printWindow.document.write(`<div class="page" style="${!isLastPage ? 'page-break-after: always;' : ''}">`);

//                 pageUsers.forEach((user) => {
//                     const addressParts = user.address.split(",");
//                     const mainAddress = addressParts.slice(0, -1).join(",");
//                     const cityState = addressParts[addressParts.length - 1];

//                     printWindow.document.write(`
//                     <div class="shipping-label">
//                         <div class="header">
//                             <img src="https://s3-inventorymanagementwow.s3.ap-south-1.amazonaws.com/imgaaka.png" alt="AAKA Logo" class="logo">
//                             <div class="company-name">Night Suits By Aaka</div>
//                         </div>
//                         <div class="shipping-title">Shipping Address:</div>
//                         <div class="address-line">${user.fullName}</div>
//                         <div class="address-line">${mainAddress}</div>
//                         <div class="address-line">${cityState}, ${user.state} ${user.zipCode}</div>
//                         <div class="address-line">${user.mobileNumber}${user.alternateMobileNumber ? " / " + user.alternateMobileNumber : ""}</div>
//                         <div class="from-address">
//                             From Address:<br>
//                             Night Suits By Aaka<br>
//                             Apoorva<br>
//                             7009928110
//                         </div>
//                     </div>
//                     `);
//                 });

//                 printWindow.document.write("</div>");
//             });

//             printWindow.document.write("</body></html>");
//             printWindow.document.close();
//             printWindow.print();
//         }
//     }

//     return (
//         <div className="container mx-auto py-10 bg-secondary min-h-screen">
//             <h1 className="text-3xl font-bold text-center mb-6 text-primary">AAKA User Management</h1>
//             <Card className="w-full bg-white shadow-lg">
//                 <CardHeader className="bg-primary text-primary-foreground">
//                     <CardTitle>User Details</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="mb-4">
//                         <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
//                             Filter by Registration Date:
//                         </label>
//                         <Input
//                             type="date"
//                             id="dateFilter"
//                             value={selectedDate}
//                             onChange={handleDateChange}
//                             className="border-primary/20"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <p className="text-sm font-medium text-gray-700">Selected Users: {selectedUsers.length}</p>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead className="w-[50px]">
//                                         <Checkbox
//                                             checked={users.length > 0 && selectedUsers.length === users.length}
//                                             onCheckedChange={handleSelectAll}
//                                         />
//                                     </TableHead>
//                                     <TableHead className="w-[50px]">S.No</TableHead>
//                                     <TableHead>Full Name</TableHead>
//                                     <TableHead>Address</TableHead>
//                                     <TableHead>State</TableHead>
//                                     <TableHead>Zip Code</TableHead>
//                                     <TableHead>Mobile Number</TableHead>
//                                     <TableHead>Alternate Mobile</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {users.map((user, index) => (
//                                     <TableRow key={user.id}>
//                                         <TableCell>
//                                             <Checkbox
//                                                 checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
//                                                 onCheckedChange={() => handleUserSelection(user)}
//                                             />
//                                         </TableCell>
//                                         <TableCell>{index + 1}</TableCell>
//                                         <TableCell>{user.fullName}</TableCell>
//                                         <TableCell>{user.address}</TableCell>
//                                         <TableCell>{user.state}</TableCell>
//                                         <TableCell>{user.zipCode}</TableCell>
//                                         <TableCell>{user.mobileNumber}</TableCell>
//                                         <TableCell>{user.alternateMobileNumber || "-"}</TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//                     <div className="mt-4">
//                         <Button onClick={handlePrintSelectedUsers} disabled={selectedUsers.length === 0} className="w-full">
//                             Print
//                         </Button>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }




"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

// Define types based on your schema
type User = {
    id: string
    fullName: string
    address: string
    state: string
    zipCode: string
    mobileNumber: string
    alternateMobileNumber?: string
    createdAt: Date
}

type Order = {
    id: string
    orderDetails: string
    numOfPieces: number
    numOfParcels: number
    totalAmount: number
    trackingId: string
    trackingCompany: string
    paymentStatus: 'pending' | 'paid'
    userId: string
    orderDate: Date
    user: User
}

type UserOrderRow = Order & {
    user: User
}

export default function UserManagement() {
    const [selectedDate, setSelectedDate] = useState<string>("")
    const [selectedOrders, setSelectedOrders] = useState<UserOrderRow[]>([])
    const [userOrders, setUserOrders] = useState<UserOrderRow[]>([])

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await fetch(`/api/orders?date=${selectedDate}`)
                if (!response.ok) throw new Error("Failed to fetch orders")

                const data: UserOrderRow[] = await response.json()
                setUserOrders(data)
            } catch (err) {
                console.log("Error fetching orders. Please try again later.")
            }
        }

        fetchUserOrders()
    }, [selectedDate])

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value)
    }

    const handleOrderSelection = (order: UserOrderRow) => {
        setSelectedOrders((prev) =>
            prev.some((selectedOrder) => selectedOrder.id === order.id)
                ? prev.filter((selectedOrder) => selectedOrder.id !== order.id)
                : [...prev, order],
        )
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedOrders(checked ? [...userOrders] : [])
    }

    const handlePrintSelectedUsers = () => {
        if (selectedOrders.length === 0) {
            toast({
                title: "No Orders Selected",
                description: "Please select orders to print.",
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
                .order-details {
                  margin-top: 10px;
                  font-size: 0.9em;
                  border-top: 1px dashed #000;
                  padding-top: 8px;
                }
              </style>
            </head>
            <body>
          `)

            const pages = []
            const pageSize = 3;

            for (let i = 0; i < selectedOrders.length; i += pageSize) {
                pages.push(selectedOrders.slice(i, i + pageSize));
            }

            pages.forEach((pageOrders, pageIndex) => {
                const isLastPage = pageIndex === pages.length - 1;
                printWindow.document.write(`<div class="page" style="${!isLastPage ? 'page-break-after: always;' : ''}">`);

                pageOrders.forEach((order) => {
                    const addressParts = order.user.address.split(",");
                    const mainAddress = addressParts.slice(0, -1).join(",");
                    const cityState = addressParts[addressParts.length - 1];

                    printWindow.document.write(`
                    <div class="shipping-label">
                        <div class="header">
                            <img src="../../../public/imgaaka.png" alt="AAKA Logo" class="logo">
                            <div class="company-name">Night Suits By Aaka</div>
                        </div>
                        <div class="shipping-title">Shipping Address:</div>
                        <div class="address-line">${order.user.fullName}</div>
                        <div class="address-line">${mainAddress}</div>
                        <div class="address-line">${cityState}, ${order.user.state} ${order.user.zipCode}</div>
                        <div class="address-line">${order.user.mobileNumber}${order.user.alternateMobileNumber ? " / " + order.user.alternateMobileNumber : ""}</div>
                        <div class="order-details">
                            Order ID: ${order.id}<br>
                            Pieces: ${order.numOfPieces}<br>
                            Parcels: ${order.numOfParcels}<br>
                            Tracking: ${order.trackingId} (${order.trackingCompany})<br>
                            Payment: ${order.paymentStatus}
                        </div>
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
            <h1 className="text-3xl font-bold text-center mb-6 text-primary">AAKA Order Management</h1>
            <Card className="w-full bg-white shadow-lg">
                <CardHeader className="bg-primary text-primary-foreground">
                    <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Order Date:
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
                        <p className="text-sm font-medium text-gray-700">Selected Orders: {selectedOrders.length}</p>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={userOrders.length > 0 && selectedOrders.length === userOrders.length}
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
                                    <TableHead>Order Details</TableHead>
                                    <TableHead>Pieces</TableHead>
                                    <TableHead>Parcels</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Tracking</TableHead>
                                    <TableHead>Payment</TableHead>
                                    <TableHead>Order Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userOrders.map((order, index) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedOrders.some((selectedOrder) => selectedOrder.id === order.id)}
                                                onCheckedChange={() => handleOrderSelection(order)}
                                            />
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{order.user.fullName}</TableCell>
                                        <TableCell>{order.user.address}</TableCell>
                                        <TableCell>{order.user.state}</TableCell>
                                        <TableCell>{order.user.zipCode}</TableCell>
                                        <TableCell>{order.user.mobileNumber}</TableCell>
                                        <TableCell>{order.user.alternateMobileNumber || "-"}</TableCell>
                                        <TableCell>{order.orderDetails}</TableCell>
                                        <TableCell>{order.numOfPieces}</TableCell>
                                        <TableCell>{order.numOfParcels}</TableCell>
                                        <TableCell>₹{order.totalAmount}</TableCell>
                                        <TableCell>{order.trackingId}<br />({order.trackingCompany})</TableCell>
                                        <TableCell className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}>
                                            {order.paymentStatus}
                                        </TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-4">
                        <Button onClick={handlePrintSelectedUsers} disabled={selectedOrders.length === 0} className="w-full">
                            Print Selected Orders
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
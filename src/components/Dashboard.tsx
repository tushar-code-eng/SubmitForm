"use client"

import { useState } from "react"
import {
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  FileText,
  Home,
  Settings,
  PieChartIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen w-full bg-[#15191A]">
      <div className=" w-full flex flex-col overflow-hidden">
        <header className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSidebarOpen && (
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input type="search" placeholder="Search..." className="w-64 pl-8" />
                <div className="absolute left-2.5 top-2.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <span className="sr-only">Toggle user menu</span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Avatar" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <h3 className="text-2xl font-bold">$45,231.89</h3>
                    <p className="text-xs text-green-500 mt-1">+20.1% from last month</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <h3 className="text-2xl font-bold">2,345</h3>
                    <p className="text-xs text-green-500 mt-1">+15.3% from last month</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                    <h3 className="text-2xl font-bold">1,247</h3>
                    <p className="text-xs text-green-500 mt-1">+5.7% from last month</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                    <h3 className="text-2xl font-bold">$19.29</h3>
                    <p className="text-xs text-red-500 mt-1">-3.2% from last month</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pieces Sold</p>
                    <h3 className="text-2xl font-bold">12,456</h3>
                    <p className="text-xs text-green-500 mt-1">+8.2% from last month</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Parcels Sold</p>
                    <h3 className="text-2xl font-bold">3,789</h3>
                    <p className="text-xs text-green-500 mt-1">+12.5% from last month</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unprinted Orders</p>
                    <h3 className="text-2xl font-bold">42</h3>
                    <p className="text-xs text-red-500 mt-1">+15 from yesterday</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
                    <h3 className="text-2xl font-bold">$5,432.21</h3>
                    <p className="text-xs text-yellow-500 mt-1">23 orders pending</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Line Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                  <p className="font-medium">{`${payload[0].payload.name}`}</p>
                                  <p className="text-primary">{`Revenue: $${(payload[0]?.value ?? 0).toLocaleString()}`}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Orders Over Time</CardTitle>
                  <CardDescription>Monthly orders for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={ordersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                  <p className="font-medium">{`${payload[0].payload.name}`}</p>
                                  <p className="text-primary">{`Orders: ${payload[0].value}`}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line type="monotone" dataKey="orders" stroke="#82ca9d" strokeWidth={2} activeDot={{ r: 8 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bar Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by State</CardTitle>
                  <CardDescription>Top 10 states by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={revenueByState} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="state" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                  <p className="font-medium">{`${payload[0].payload.state}`}</p>
                                  <p className="text-primary">{`Revenue: $${(payload[0]?.value ?? 0).toLocaleString()}`}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers by Revenue</CardTitle>
                  <CardDescription>Top 10 customers by total revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={topCustomers}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="name" type="category" stroke="#888" width={100} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border border-border p-2 rounded-md shadow-md">
                                  <p className="font-medium">{`${payload[0].payload.name}`}</p>
                                  <p className="text-primary">{`Revenue: $${(payload[0]?.value ?? 0).toLocaleString()}`}</p>
                                  <p className="text-muted-foreground">{`Orders: ${payload[0].payload.orders}`}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="revenue" fill="#82ca9d" radius={[0, 4, 4, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 gap-6">
              <Tabs defaultValue="pending-payments">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending-payments">Pending Payments</TabsTrigger>
                  <TabsTrigger value="unprinted-orders">Unprinted Orders</TabsTrigger>
                  <TabsTrigger value="top-customers">Top Customers</TabsTrigger>
                </TabsList>
                <TabsContent value="pending-payments">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Payments</CardTitle>
                      <CardDescription>Orders with pending payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingPayments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">{payment.id}</TableCell>
                                <TableCell>{payment.customer}</TableCell>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>${payment.amount.toLocaleString()}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                  >
                                    {payment.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="unprinted-orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Unprinted Orders</CardTitle>
                      <CardDescription>Orders that need to be printed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Items</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unprintedOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>{order.items}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                                    {order.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    Print
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="top-customers">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Customers</CardTitle>
                      <CardDescription>Detailed breakdown of top customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Customer</TableHead>
                              <TableHead>Total Orders</TableHead>
                              <TableHead>Total Revenue</TableHead>
                              <TableHead>Avg. Order Value</TableHead>
                              <TableHead>Last Order</TableHead>
                              <TableHead>Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {topCustomersDetailed.map((customer) => (
                              <TableRow key={customer.id}>
                                <TableCell className="font-medium">{customer.name}</TableCell>
                                <TableCell>{customer.totalOrders}</TableCell>
                                <TableCell>${customer.totalRevenue.toLocaleString()}</TableCell>
                                <TableCell>${customer.avgOrderValue.toLocaleString()}</TableCell>
                                <TableCell>{customer.lastOrder}</TableCell>
                                <TableCell>
                                  <Button variant="outline" size="sm">
                                    Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Sample data for charts and tables
const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
  { name: "Aug", revenue: 4000 },
  { name: "Sep", revenue: 2780 },
  { name: "Oct", revenue: 1890 },
  { name: "Nov", revenue: 3578 },
  { name: "Dec", revenue: 5200 },
]

const ordersData = [
  { name: "Jan", orders: 120 },
  { name: "Feb", orders: 98 },
  { name: "Mar", orders: 145 },
  { name: "Apr", orders: 87 },
  { name: "May", orders: 65 },
  { name: "Jun", orders: 78 },
  { name: "Jul", orders: 102 },
  { name: "Aug", orders: 110 },
  { name: "Sep", orders: 87 },
  { name: "Oct", orders: 65 },
  { name: "Nov", orders: 112 },
  { name: "Dec", orders: 156 },
]

const revenueByState = [
  { state: "CA", revenue: 12500 },
  { state: "NY", revenue: 9800 },
  { state: "TX", revenue: 8700 },
  { state: "FL", revenue: 7600 },
  { state: "IL", revenue: 6500 },
  { state: "PA", revenue: 5400 },
  { state: "OH", revenue: 4300 },
  { state: "GA", revenue: 3200 },
  { state: "NC", revenue: 2100 },
  { state: "MI", revenue: 1000 },
]

const topCustomers = [
  { name: "John Smith", revenue: 12500, orders: 45 },
  { name: "Jane Doe", revenue: 9800, orders: 32 },
  { name: "Bob Johnson", revenue: 8700, orders: 28 },
  { name: "Alice Brown", revenue: 7600, orders: 25 },
  { name: "Mike Wilson", revenue: 6500, orders: 22 },
  { name: "Sarah Lee", revenue: 5400, orders: 18 },
  { name: "Tom Davis", revenue: 4300, orders: 15 },
  { name: "Emily Clark", revenue: 3200, orders: 12 },
  { name: "David Miller", revenue: 2100, orders: 8 },
  { name: "Lisa White", revenue: 1000, orders: 5 },
]

const pendingPayments = [
  { id: "ORD-1234", customer: "John Smith", date: "2023-06-15", amount: 1250.0, status: "Pending" },
  { id: "ORD-1235", customer: "Jane Doe", date: "2023-06-16", amount: 980.5, status: "Pending" },
  { id: "ORD-1236", customer: "Bob Johnson", date: "2023-06-17", amount: 870.25, status: "Pending" },
  { id: "ORD-1237", customer: "Alice Brown", date: "2023-06-18", amount: 760.75, status: "Pending" },
  { id: "ORD-1238", customer: "Mike Wilson", date: "2023-06-19", amount: 650.0, status: "Pending" },
  { id: "ORD-1239", customer: "Sarah Lee", date: "2023-06-20", amount: 540.5, status: "Pending" },
  { id: "ORD-1240", customer: "Tom Davis", date: "2023-06-21", amount: 430.25, status: "Pending" },
  { id: "ORD-1241", customer: "Emily Clark", date: "2023-06-22", amount: 320.75, status: "Pending" },
  { id: "ORD-1242", customer: "David Miller", date: "2023-06-23", amount: 210.0, status: "Pending" },
  { id: "ORD-1243", customer: "Lisa White", date: "2023-06-24", amount: 100.5, status: "Pending" },
]

const unprintedOrders = [
  { id: "ORD-1244", customer: "John Smith", date: "2023-06-15", items: 5, status: "Unprinted" },
  { id: "ORD-1245", customer: "Jane Doe", date: "2023-06-16", items: 3, status: "Unprinted" },
  { id: "ORD-1246", customer: "Bob Johnson", date: "2023-06-17", items: 7, status: "Unprinted" },
  { id: "ORD-1247", customer: "Alice Brown", date: "2023-06-18", items: 2, status: "Unprinted" },
  { id: "ORD-1248", customer: "Mike Wilson", date: "2023-06-19", items: 4, status: "Unprinted" },
  { id: "ORD-1249", customer: "Sarah Lee", date: "2023-06-20", items: 6, status: "Unprinted" },
  { id: "ORD-1250", customer: "Tom Davis", date: "2023-06-21", items: 1, status: "Unprinted" },
  { id: "ORD-1251", customer: "Emily Clark", date: "2023-06-22", items: 8, status: "Unprinted" },
  { id: "ORD-1252", customer: "David Miller", date: "2023-06-23", items: 3, status: "Unprinted" },
  { id: "ORD-1253", customer: "Lisa White", date: "2023-06-24", items: 5, status: "Unprinted" },
]

const topCustomersDetailed = [
  { id: 1, name: "John Smith", totalOrders: 45, totalRevenue: 12500, avgOrderValue: 277.78, lastOrder: "2023-06-15" },
  { id: 2, name: "Jane Doe", totalOrders: 32, totalRevenue: 9800, avgOrderValue: 306.25, lastOrder: "2023-06-16" },
  { id: 3, name: "Bob Johnson", totalOrders: 28, totalRevenue: 8700, avgOrderValue: 310.71, lastOrder: "2023-06-17" },
  { id: 4, name: "Alice Brown", totalOrders: 25, totalRevenue: 7600, avgOrderValue: 304.0, lastOrder: "2023-06-18" },
  { id: 5, name: "Mike Wilson", totalOrders: 22, totalRevenue: 6500, avgOrderValue: 295.45, lastOrder: "2023-06-19" },
  { id: 6, name: "Sarah Lee", totalOrders: 18, totalRevenue: 5400, avgOrderValue: 300.0, lastOrder: "2023-06-20" },
  { id: 7, name: "Tom Davis", totalOrders: 15, totalRevenue: 4300, avgOrderValue: 286.67, lastOrder: "2023-06-21" },
  { id: 8, name: "Emily Clark", totalOrders: 12, totalRevenue: 3200, avgOrderValue: 266.67, lastOrder: "2023-06-22" },
  { id: 9, name: "David Miller", totalOrders: 8, totalRevenue: 2100, avgOrderValue: 262.5, lastOrder: "2023-06-23" },
  { id: 10, name: "Lisa White", totalOrders: 5, totalRevenue: 1000, avgOrderValue: 200.0, lastOrder: "2023-06-24" },
]


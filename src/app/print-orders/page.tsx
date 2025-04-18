"use client"

import type React from "react"
import { useEffect, useState } from "react"
import type { User } from "@/utils/mockData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Calendar, Search, Trash2, Printer, Edit, UserIcon } from "lucide-react"
import axios from "axios"
import UserOrdersModal from "@/components/UserOrdersModal"
import { cn } from "@/lib/utils"
import EditUserDetails from "@/components/EditUserDetails"
// const AAKA_LOGO = "data:image/png;base64,..."

import { NotebookTabs } from "lucide-react"

export default function UserManagement() {
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [trackingIdUsers, setTrackingIdUsers] = useState<User[]>([])
  const [trackingIdFilter, setTrackingIdFilter] = useState<User[]>([])
  const [additionalUserArray, setAdditionalUserArray] = useState<any[]>([])
  const [isRequestCompleted, setIsRequestCompleted] = useState<boolean>(false)
  const [editingTrackingIds, setEditingTrackingIds] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/users?date=${selectedDate}`)
        if (!response.ok) throw new Error("Failed to fetch users")
        const data: User[] = await response.json()
        const sortedUsers = [...data].sort((a, b) => a.fullName.localeCompare(b.fullName))
        setUsers(sortedUsers)
        setFilteredUsers(sortedUsers)
      } catch (err) {
        console.log("Error fetching users. Please try again later.", err)
      }
    }
    fetchUsers()
  }, [selectedDate])

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
    setSelectedUsers(checked ? (editingTrackingIds ? trackingIdFilter : filteredUsers) : [])
  }

  const handleDeleteSelectedUsers = async () => {
    if (!selectedDate) {
      toast({
        title: "No Date Selected",
        description: "Please select a date to delete print records.",
        variant: "destructive",
      })
      return
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "No Users Selected",
        description: "Please select users to delete print records.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.delete("/api/deletePrint", {
        data: {
          userIds: selectedUsers.map((user) => user.id),
          printDate: selectedDate,
        },
      })

      console.log(response)

      toast({
        title: "Success",
        description: "Print records deleted successfully.",
      })

      setSelectedUsers([])
      setIsRequestCompleted((prev) => !prev)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete print records.",
        variant: "destructive",
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

    const sendingOrderIdsOnly = users.map((user: User) => user.orders[0]?.id ?? null)

    const updateBool = async () => {
      const res = await axios.put(`/api/updatePrintBool`, sendingOrderIdsOnly)
      console.log("ranran", res)
    }
    updateBool()

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const imageUrl = window.location.origin + '/imgaaka.png'
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
      const pageSize = 3

      for (let i = 0; i < selectedUsers.length; i += pageSize) {
        pages.push(selectedUsers.slice(i, i + pageSize))
      }

      pages.forEach((pageUsers, pageIndex) => {
        const isLastPage = pageIndex === pages.length - 1
        printWindow.document.write(`<div class="page" style="${!isLastPage ? "page-break-after: always;" : ""}">`)

        pageUsers.forEach((user: any) => {
          const addressParts =
            user.orders && user.orders.length > 0 && user.orders[0].orderAddress
              ? user.orders[0].orderAddress.split(",")
              : user.address.split(",")
          const mainAddress = addressParts.slice(0, -1).join(",")
          const cityState = addressParts[addressParts.length - 1]

          const userState =
            user.orders && user.orders.length > 0 && user.orders[0].orderState ? user.orders[0].orderState : user.state
          const userZip =
            user.orders && user.orders.length > 0 && user.orders[0].orderZipCode
              ? user.orders[0].orderZipCode
              : user.zipCode

          printWindow.document.write(`
                    <div class="shipping-label">
                        <div class="header">
                            <img src="${imageUrl}" alt="AAKA Logo" class="logo">
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
                    `)
        })

        printWindow.document.write("</div>")
      })

      printWindow.document.write("</body></html>")
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleEditingTrackingIds = async () => {
    setEditingTrackingIds(!editingTrackingIds)
    const response = await axios.get(`/api/orders?date=${selectedDate}`)
    const orderData = response.data
    const filteredData = await orderData.filter((item: any) => !item.trackingId || !item.trackingCompany)
    const uniqueUsers = new Map()

    filteredData.forEach((order: any) => {
      if (!uniqueUsers.has(order.user.id)) {
        uniqueUsers.set(order.user.id, order.user)
      }
    })

    const users = Array.from(uniqueUsers.values())
    const sortedUsers = [...users].sort((a, b) => a.fullName.localeCompare(b.fullName))
    setTrackingIdUsers(sortedUsers)
  }

  const handleCardClick = (user: User) => {
    handleUserSelection(user)
  }

  useEffect(() => {
    if (editingTrackingIds) {
      const filtered = trackingIdUsers
        .filter((user: any) => {
          const searchLower = searchTerm.toLowerCase()
          return (
            user.fullName.toLowerCase().includes(searchLower) ||
            user.mobileNumber.includes(searchLower) ||
            user.address.toLowerCase().includes(searchLower) ||
            user.state.toLowerCase().includes(searchLower) ||
            (user.registrationDate && user.registrationDate.includes(searchTerm))
          )
        })
        .sort((a, b) => a.fullName.localeCompare(b.fullName))
      setTrackingIdFilter(filtered)
    } else {
      const filtered = users.filter((user: any) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          user.fullName.toLowerCase().includes(searchLower) ||
          user.mobileNumber.includes(searchLower) ||
          user.address.toLowerCase().includes(searchLower) ||
          user.state.toLowerCase().includes(searchLower) ||
          (user.registrationDate && user.registrationDate.includes(searchTerm))
        )
      })
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users, trackingIdUsers, editingTrackingIds])

  return (
    <div className="overflow-y-auto w-full p-3">
      <Card className="w-full bg-[#15191A] border border-neutral-800 rounded-xl shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-xl flex w-full items-center justify-between font-light gap-2 text-[#F4F4F6]">
            <div className="flex items-center gap-2">
              <NotebookTabs className="text-green-500" />
              <p> <span className="text-[#575D60]">Customer </span>Details</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="dateFilter" className="block text-sm font-thin text-[#F4F4F6] mb-1">
                Filter by Registration Date:
              </label>
              <div className="relative">
                <Input
                  type="date"
                  id="dateFilter"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="pl-10 bg-[#1D2328] border-none focus:border-green-500"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F4F4F6]" size={18} />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="search" className="block text-sm font-thin text-[#F4F4F6] mb-1">
                Search:
              </label>
              <div className="relative">
                <Input
                  id="search"
                  placeholder="Search by name, address, state or date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10  bg-[#1D2328] border-none focus:border-green-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Button
              onClick={handleDeleteSelectedUsers}
              disabled={selectedUsers.length === 0 || !selectedDate || isLoading}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600"
            >
              <Trash2 size={18} />
              Delete Print Records
            </Button>
            <Button
              onClick={handleEditingTrackingIds}
              className={`flex items-center gap-2  bg-transparent hover:bg-transparent border-neutral-700 border `}
            >
              <Edit size={18} />
              {editingTrackingIds ? "Cancel Editing" : "Edit Tracking IDs"}
            </Button>
            <Button
              onClick={() => handleSelectAll(!selectedUsers.length)}
              className="flex items-center gap-2 bg-transparent hover:bg-transparent border-neutral-700 border "
            >
              <Checkbox
                checked={selectedUsers.length === (editingTrackingIds ? trackingIdFilter : filteredUsers).length}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
              />
              Select All
            </Button>
            <p className="text-sm font-medium text-[#F4F4F6]">
              Selected Users: <span className="font-bold">{selectedUsers.length}</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(editingTrackingIds ? trackingIdFilter : filteredUsers).map((user: any, index) => (
              <Card
                key={user.id}
                className={cn(
                  user.orders && user.orders.length > 0 && user.orders[0].isPrinted ? "border border-green-500" : "border border-neutral-800",
                  "hover:border-blue-500 cursor-pointer transition-colors  bg-[#15191A]",
                  selectedUsers.some((selectedUser) => selectedUser.id === user.id) && "ring-2 ring-blue-500",
                )}
                onClick={() => handleCardClick(user)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Checkbox
                      checked={selectedUsers.some((selectedUser) => selectedUser.id === user.id)}
                      onCheckedChange={() => handleUserSelection(user)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-gray-400 ">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg">{user.fullName}</h3>
                  </div>
                  <p className="text-sm text-gray-300 mb-1">
                    {user.orders && user.orders.length > 0 && user.orders[0].orderAddress
                      ? user.orders[0].orderAddress
                      : user.address}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    {user.orders && user.orders.length > 0 && user.orders[0].orderState
                      ? user.orders[0].orderState
                      : user.state}
                    ,{" "}
                    {user.orders && user.orders.length > 0 && user.orders[0].orderZipCode
                      ? user.orders[0].orderZipCode
                      : user.zipCode}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">{user.mobileNumber}</p>
                  <p className="text-sm text-gray-300 mb-2">{user.alternateMobileNumber || "No alternate number"}</p>
                  <div className="mt-2 flex items-center w-full justify-between">
                    <UserOrdersModal userId={user.id} userName={user.fullName} />
                    <EditUserDetails userId={user.id} userName={user.fullName} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Button
              onClick={handlePrintSelectedUsers}
              disabled={selectedUsers.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer size={18} />
              Print Selected Users
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


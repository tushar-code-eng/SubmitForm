export interface User {
    id: string
    fullName: string
    address: string
    state: string
    zipCode: string
    mobileNumber: string
    alternateMobileNumber?: string
    registrationDate: string
  }
  
  export const mockUsers: User[] = [
    {
      id: "1",
      fullName: "Rahul Sharma",
      address: "123 MG Road, Bangalore",
      state: "Karnataka",
      zipCode: "560001",
      mobileNumber: "9876543210",
      registrationDate: "2023-05-15",
    },
    {
      id: "2",
      fullName: "Priya Patel",
      address: "456 Park Street, Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      mobileNumber: "8765432109",
      alternateMobileNumber: "7654321098",
      registrationDate: "2023-05-16",
    },
    {
      id: "3",
      fullName: "Amit Singh",
      address: "789 Rajpath, New Delhi",
      state: "Delhi",
      zipCode: "110001",
      mobileNumber: "7654321098",
      registrationDate: "2023-05-17",
    },
    {
      id: "4",
      fullName: "Sneha Reddy",
      address: "321 Necklace Road, Hyderabad",
      state: "Telangana",
      zipCode: "500001",
      mobileNumber: "6543210987",
      registrationDate: "2023-05-17",
    },
    {
      id: "5",
      fullName: "Vikram Mehta",
      address: "654 FC Road, Pune",
      state: "Maharashtra",
      zipCode: "411001",
      mobileNumber: "5432109876",
      alternateMobileNumber: "4321098765",
      registrationDate: "2023-05-18",
    },
  ]
  
  
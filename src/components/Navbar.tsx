import React from 'react'
import logo from '../../public/imgaaka.png'
import Link from 'next/link'

const Navbar = () => {
    return (
        <div className="flex items-center justify-between py-4 px-10 shadow-sm">
            <div className='text-xl font-semibold italic font-sans text-black flex items-center gap-3'>
                <div>
                    <img className="w-10 " src={logo.src} alt="" />
                </div>
                <div>
                    Aaka-Official
                </div>
            </div>
            <div className='flex gap-10 items-center font-semibold'>
                <Link href={"/addCustomerDetails"}>
                    <div className='hover:bg-blue-600 p-2 rounded-md hover:text-white'>
                        Add Details
                    </div>
                </Link>
                <Link href={"/print-orders"}>
                    <div className='hover:bg-blue-600 p-2 rounded-md hover:text-white'>
                        Print Orders
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Navbar

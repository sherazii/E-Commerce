'use client'
import WebsiteBreadcrumb from '@/components/application/website/WebsiteBreadcrumb'
import React from 'react'
import UserPanelLayout from '../UserPanelLayout'
import { HiOutlineShoppingBag } from 'react-icons/hi2'
import { IoCartOutline } from 'react-icons/io5'
import useFetch from '@/hooks/useFetch'

const breadCrumbData = {
  title: 'Dashboard',
  links: [{label: 'Dashboard'}]
}
const MyAccount = () => {
  const {data: dashboardData} = useFetch('/api/dashboard/user')
  console.log(dashboardData);
  

  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData}/>
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border-b">Dashboard</div>
          <div className="p-5">

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="flex items-center justify-center gap-5 border rounded p-3">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Total Orders</h4>
                    <span className="font-semibold text-gray-500">0</span>
                  </div>
                  <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                    <HiOutlineShoppingBag className='text-white' size={25}/>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 border rounded p-3">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Items In Cart</h4>
                    <span className="font-semibold text-gray-500">0</span>
                  </div>
                  <div className="w-16 h-16 bg-primary rounded-full flex justify-center items-center">
                    <IoCartOutline className='text-white' size={25}/>
                  </div>
                </div>
              </div>
              {/* Table of orders  */}
              <div className="mt-5">
                <h4 className="text-lg font-semibold mb-3">Recent Orders</h4>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">Sr.No.</th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">Order id</th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">Total item</th>
                      <th className="text-start p-2 text-sm border-b text-nowrap text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody></tbody>
                </table>
              </div>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default MyAccount
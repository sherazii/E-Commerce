import BreadCrumb from "@/components/application/admin/BreadCrumb";
import React from "react";
import AdminDashboard from "../dashboard/page";

const breadCrumbData = [
  {
    href: '/admin/dashboard',
    label: "Home",
  },
  {
    href: '',
    label: "Media",
  },
];
const MediaPage = () => {
  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData}/>
    </div>
  );
};

export default MediaPage;

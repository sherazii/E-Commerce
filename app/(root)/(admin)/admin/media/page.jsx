import BreadCrumb from "@/components/application/admin/BreadCrumb";
import UploadMedia from "@/components/application/admin/UploadMedia";
import React from "react";

const breadCrumbData = [
  {
    href: "/admin/dashboard",
    label: "Home",
  },
  {
    href: "",
    label: "Media",
  },
];
const MediaPage = () => {
  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <UploadMedia />
    </div>
  );
};

export default MediaPage;

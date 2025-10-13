"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";
import axios from "axios";
import { useEffect, useState } from "react";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_CATEGORY_SHOW,
    label: "Category",
  },
  {
    href: ADMIN_CATEGORY_ADD,
    label: "Add Category",
  },
];

function ShowCategory() {
  const [fetchedData, setFetchedData] = useState();

useEffect(() => {
  const fetchData = async () => {
    try {
      const { data: response } = await axios.get("/api/category"); // ✅ No body in GET
      
      if (!response.success) {
        showToast("error", response.message || "Something went wrong!");
        return;
      }

      setFetchedData(response);
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || error?.message || "Failed to fetch categories"
      );
    }
  };

  fetchData();
}, []);

console.log(fetchedData?.data);

  

  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <div className="w-full h-full flex  justify-center"></div>
    </div>
  );
}

export default ShowCategory;

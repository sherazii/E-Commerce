"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import DatatableWrapper from "@/components/application/admin/DatatableWrapper";
import DeleteAction from "@/components/application/admin/DeleteAction";
import EditAction from "@/components/application/admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import { showToast } from "@/lib/showToast";
import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

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
  const columns = useMemo(() => {
    return columnConfig(DT_CATEGORY_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <EditAction href={ADMIN_CATEGORY_EDIT(row.original._id)} key="edit" />
    );
    actionMenu.push(
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />
    );
    return actionMenu;
  }, []);
  // const [fetchedData, setFetchedData] = useState();
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data: response } = await axios.get("/api/category"); // ✅ No body in GET

  //       if (!response.success) {
  //         showToast("error", response.message || "Something went wrong!");
  //         return;
  //       }

  //       setFetchedData(response);
  //     } catch (error) {
  //       showToast(
  //         "error",
  //         error?.response?.data?.message ||
  //           error?.message ||
  //           "Failed to fetch categories"
  //       );
  //     }
  //   };

  //   fetchData();
  // }, []);
  // console.log(fetchedData?.data);

  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Categories Details</h4>
            <Button>
              <FiPlus />
              <Link href={ADMIN_CATEGORY_ADD}>New Category</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DatatableWrapper
            queryKey="category-data"
            fetchUrl="/api/category"
            columnConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/category/export"
            deleteEndpoint="/api/category/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowCategory;

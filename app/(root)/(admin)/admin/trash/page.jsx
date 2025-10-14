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
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_TRASH,
    label: "Trash",
  },
];

const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
};
function Trash() {
  const searchParams = useSearchParams();
  const trashof = searchParams.get("trashof");
  const config = TRASH_CONFIG[trashof];

  if (!config) {
    showToast("error", "Invalid or missing trash type.");
    return;
  }

  const columns = useMemo(() => {
    return columnConfig(config.columns, false, false, true);
  }, [config]);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <DeleteAction
        key="delete"
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);

  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">{config.title}</h4>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DatatableWrapper
            queryKey={`${trashof}-data-deleted`}
            fetchUrl={config.fetchUrl}
            columnConfig={columns}
            initialPageSize={10}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Trash;

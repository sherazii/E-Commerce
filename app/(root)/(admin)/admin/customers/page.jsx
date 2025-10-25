"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import DatatableWrapper from "@/components/application/admin/DatatableWrapper";
import DeleteAction from "@/components/application/admin/DeleteAction";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {  DT_CUSTOMERS_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

import { useCallback,  useMemo } from "react";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Cutomers",
  },
];

function ShowCustomers() {
  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];

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

  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Customers</h4>
          </div>
        </CardHeader>
        <CardContent className="pb-5">
          <DatatableWrapper
            queryKey="customers-data"
            fetchUrl="/api/customers"
            columnConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/customers/export"
            deleteEndpoint="/api/customers/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowCustomers;

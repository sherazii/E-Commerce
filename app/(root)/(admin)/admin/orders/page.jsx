"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import DatatableWrapper from "@/components/application/admin/DatatableWrapper";
import DeleteAction from "@/components/application/admin/DeleteAction";
import EditAction from "@/components/application/admin/EditAction";
import ViewAction from "@/components/application/admin/View";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { DT_COUPON_COLUMN, DT_ORDERS_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_ORDERS_DETAILS,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Orders",
  },
];

function ShowOrders() {
  const columns = useMemo(() => {
    return columnConfig(DT_ORDERS_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <ViewAction href={ADMIN_ORDERS_DETAILS(row.original._id)} key="view" />
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


  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Orders</h4>
          </div>
        </CardHeader>
        <CardContent className="pb-5 w-100 md:w-full">
          <DatatableWrapper
            queryKey="order-data"
            fetchUrl="/api/order"
            columnConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/order/export"
            deleteEndpoint="/api/order/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=order`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowOrders;

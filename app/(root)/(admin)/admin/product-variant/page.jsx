"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import DatatableWrapper from "@/components/application/admin/DatatableWrapper";
import DeleteAction from "@/components/application/admin/DeleteAction";
import EditAction from "@/components/application/admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_PRODUCT_VARIANT_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_EDIT,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_PRODUCT_VARIANT_SHOW,
    label: "Product variant",
  },
  {
    href: ADMIN_PRODUCT_VARIANT_ADD,
    label: "Add Product variant",
  },
];

function ShowProductVariant() {
  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_VARIANT_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    let actionMenu = [];
    actionMenu.push(
      <EditAction
        href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}
        key="edit"
      />
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
    <div className="md:mb-10 mb-100">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold">Product Variant Details</h4>
            <Button>
              <FiPlus />
              <Link href={ADMIN_PRODUCT_VARIANT_ADD}>New Product Variant</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5   w-90 md:w-full">
          <DatatableWrapper
            queryKey="product-variant-data"
            fetchUrl="/api/product-variant"
            columnConfig={columns}
            initialPageSize={10}
            exportEndpoint="/api/product-variant/export"
            deleteEndpoint="/api/product-variant/delete"
            deleteType="SD"
            trashView={`${ADMIN_TRASH}?trashof=productVariant`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShowProductVariant;

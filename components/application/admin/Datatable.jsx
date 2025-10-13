import { Box, IconButton, Tooltip } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
    MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";
import Link from "next/link";
import React, { useState } from "react";
import RecyclingIcon from "@mui/icons-material/Recycling";
import {
  DeleteForever,
  DeleteOutlineOutlined,
  RestoreFromTrash,
  SaveAlt,
} from "@mui/icons-material";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";

const Datatable = ({
  queryKey,
  fetchUrl,
  columnConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteEndpoint,
  deleteType,
  trashView,
  createAction,
}) => {
  //manage our own state for stuff we want to pass to the API
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  // Delete handler (keeps your mutate signature)
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);

  //Delete method
  const deleteHandler = (selectedIds, type) => {
    let confirmed = true;
    if (type === "PD") {
      confirmed = confirm( 
        "Are you sure you want to delete this data permanently?"
      );
    }

    if (confirmed) {
      // keep your deleteMutation API usage untouched
      deleteMutation.mutate({ ids: selectedIds, deleteType: type });
      setRowSelection({});
    }

    // reset selections after action
    setSelectAll(false);
    setSelectedMedia([]);
  };
  //Export method
  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: "CSV-Data",
      });

      let csv;
      if(Object.keys(rowSelection).length  > 0){
        // export only selected rows 
        const rowData = selectedRows.map((row) => row.original)
        csv = generateCsv(csvConfig)(rowData)

      }else{
        // Export all data
        const {data: response } = await axios.get(exportEndpoint)
        if(!response.success){throw new Error(response.message)}

        const rowData = response.data 
        csv = generateCsv(csvConfig)(rowData)
      }
      download(csvConfig)(csv)
    } catch (error) {
      console.log(error);
      showToast("error", error.message);
    } finally {
      setExportLoading(false);
    }
  };
  //consider storing this code in a custom hook (i.e useFetchUsers)
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      queryKey,
      {
        columnFilters, //refetch when columnFilters changes
        globalFilter, //refetch when globalFilter changes
        pagination, //refetch when pagination changes
        sorting, //refetch when sorting changes
      },
    ],

    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);

      //read our state and pass it to the API as query params
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page
  });

  //Table initialization
  const table = useMaterialReactTable({
    columns: columnConfig,
    data,
    enableRowSelection: true,
    columnsFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdring: true,
    enableStickyHeader: true,
    enableStickyFooter: true,

    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    rowCount: data?.meta?.totalRowCount ?? 0,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
      rowSelection,
    },
    getRowId: (originalRow) => originalRow._id,
    //customize built-in buttons in the top-right of top toolbar
    renderToolbarInternalActions: ({ table }) => (
      <Box>
        {/* along-side built-in buttons in whatever order you want them */}
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        {/* add custom button to print table  */}
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
        {deleteType === "SD" && (
          <Tooltip title="Delete all">
            <IconButton
              disabled={
                !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
              }
              onClick={() => {
                deleteHandler(Object.keys.rowSelection, deleteType);
              }}
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </Tooltip>
        )}
        {deleteType === "PD" && (
          <>
            {" "}
            (
            <Tooltip title="Restore Data">
              <Link href={trashView}>
                <IconButton
                  disabled={
                    !table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  onClick={() => {
                    deleteHandler(Object.keys.rowSelection, "RSD");
                  }}
                >
                  <RestoreFromTrash />
                </IconButton>
              </Link>
            </Tooltip>
            <Tooltip title="Permanentaly Delete">
              <Link href={trashView}>
                <IconButton
                  disabled={
                    !table.getIsSomeRowsSelected() &&
                    !table.getIsAllRowsSelected()
                  }
                  onClick={() => {
                    deleteHandler(Object.keys.rowSelection, deleteType);
                  }}
                >
                  <DeleteForever />
                </IconButton>
              </Link>
            </Tooltip>
            )
          </>
        )}
      </Box>
    ),
    enableRowActions: true,
    positionActionsColumn: "last", 
    renderRowActionMenuItems: ({ row }) =>
      createAction(row, deleteType, deleteHandler),
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip>
        <ButtonLoading
          type="button"
          text={
            <>
              <SaveAlt /> Export
            </>
          }
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel)}
        />
      </Tooltip>
    ),
  });

  return <MaterialReactTable table={table}/>
};

export default Datatable;

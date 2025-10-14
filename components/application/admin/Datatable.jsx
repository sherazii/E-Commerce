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
  DeleteOutline,
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
  // === Table State Management ===
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  // === Deletion Hook ===
  const deleteMutation = useDeleteMutation(queryKey, deleteEndpoint);

  // === Delete Handler (Safely deferring selection reset) ===
  const handleDelete = (selectedIds, type) => {
    const confirmed =
      type === "PD"
        ? confirm("Are you sure you want to delete this data permanently?")
        : true;

    if (confirmed) {
      deleteMutation.mutate({ ids: selectedIds, deleteType: type });

      // ✅ Avoid React warning by deferring state update
      setTimeout(() => {
        setRowSelection({});
      }, 0);
    }
  };

  // === CSV Export ===
  const handleExport = async (selectedRows) => {
    setExportLoading(true);
    try {
      const csvConfig = mkConfig({
        fieldSeparator: ",",
        decimalSeparator: ".",
        useKeysAsHeaders: true,
        filename: `${queryKey}-data`,
      });

      let csv;
      if (Object.keys(rowSelection).length > 0) {
        const rowData = selectedRows.map((row) => row.original);
        csv = generateCsv(csvConfig)(rowData);
      } else {
        const { data: response } = await axios.get(exportEndpoint);
        if (!response.success) throw new Error(response.message);
        csv = generateCsv(csvConfig)(response.data);
      }
      download(csvConfig)(csv);
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setExportLoading(false);
    }
  };

  // === Data Fetching with React Query ===
  const {
    data: { data = [], meta } = {},
    isError,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: [queryKey, { columnFilters, globalFilter, pagination, sorting }],
    queryFn: async () => {
      const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
      url.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      url.searchParams.set("size", `${pagination.pageSize}`);
      url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      url.searchParams.set("globalFilter", globalFilter ?? "");
      url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
      url.searchParams.set("deleteType", deleteType);
      const { data: response } = await axios.get(url.href);
      return response;
    },
    placeholderData: keepPreviousData,
  });

  // === Table Config ===
  const table = useMaterialReactTable({
    columns: columnConfig,
    data,
    enableRowSelection: true,
    columnsFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    enableColumnOrdering: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
    initialState: { showColumnFilters: true },
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,

    muiToolbarAlertBannerProps: isError
      ? { color: "error", children: "Error loading data" }
      : undefined,

    // ✅ Guarded setters (prevents infinite re-renders)
    onColumnFiltersChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(columnFilters) : updater;
      if (JSON.stringify(next) !== JSON.stringify(columnFilters)) {
        setColumnFilters(next);
      }
    },

    onGlobalFilterChange: (val) => {
      if (val !== globalFilter) {
        setGlobalFilter(val);
      }
    },

    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(pagination) : updater;
      if (
        next.pageIndex !== pagination.pageIndex ||
        next.pageSize !== pagination.pageSize
      ) {
        setPagination(next);
      }
    },

    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      if (JSON.stringify(next) !== JSON.stringify(sorting)) {
        setSorting(next);
      }
    },

    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      if (JSON.stringify(next) !== JSON.stringify(rowSelection)) {
        setRowSelection(next);
      }
    },

    rowCount: meta?.totalRowCount ?? 0,

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

    // ✅ Must be stable or selection will loop forever
    getRowId: (row) => row._id,

    renderToolbarInternalActions: ({ table }) => (
      <Box>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />
        {deleteType !== "PD" && (
          <Tooltip title="Recycle Bin">
            <Link href={trashView}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}
      </Box>
    ),

    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActionMenuItems: ({ row }) =>
      typeof createAction === "function"
        ? createAction(row, deleteType, handleDelete)
        : [],

    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip title="Export Data">
        <ButtonLoading
          type="button"
          text={
            <>
              <SaveAlt /> Export
            </>
          }
          loading={exportLoading}
          onClick={() => handleExport(table.getSelectedRowModel().rows)}
        />
      </Tooltip>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default Datatable;

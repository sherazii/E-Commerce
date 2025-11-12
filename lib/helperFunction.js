import { NextResponse } from "next/server";

export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    { status: statusCode }
  );
};

export const catchError = (error, customMessage) => {
  let statusCode = 500;
  let message = customMessage || "Internal server error";

  if (error.code === 11000) {
    const keys =
      (error.keyPattern && Object.keys(error.keyPattern)) ||
      (error.keyValue && Object.keys(error.keyValue)) ||
      [];

    const keysText = keys.length > 0 ? keys.join(", ") : "unknown field(s)";

    message = `Duplicate fields: ${keysText}. These values must be unique.`;
    statusCode = 409;
  } else if (error.name === "ValidationError") {
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  } else if (error.name === "MongoServerError" && error.message) {
    message = error.message;
  }

  const data =
    process.env.NODE_ENV === "development"
      ? { error: error.message, stack: error.stack }
      : {};

  return response(false, statusCode, message, data);
};

export const genrateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const columnConfig = (
  column,
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) => {
  const newColumn = [...column];
  if (isCreatedAt) {
    newColumn.push({
      accessorKey: "createdAt", //access nested data with dot notation
      header: "Created At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }
  if (isUpdatedAt) {
    newColumn.push({
      accessorKey: "updatedAt", //access nested data with dot notation
      header: "Updated At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }
  if (isDeletedAt) {
    newColumn.push({
      accessorKey: "deletedAt", //access nested data with dot notation
      header: "Deleted At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }
  return newColumn;
};

export const statusBadge = (status) => {
  const statusColorConfig = {
    pending: "bg-blue-500",
    processing: "bg-yellow-500",
    shipped: "bg-cyan-500",
    delivered: "bg-green-500",
    cancelled: "bg-red-500",
    unverified: "bg-orange-500",
  };
  return <span className={`${statusColorConfig[status]} capitalize px-3 py-1 rounded-full text-xs`}>{status}</span>
};

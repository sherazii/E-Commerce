import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import userIcon from "@/public/assets/images/user.png";

export const DT_CATEGORY_COLUMN = [
  {
    accessorKey: "name", //access nested data with dot notation
    header: "Category Name",
  },
  {
    accessorKey: "slug", //access nested data with dot notation
    header: "Slug",
  },
];
export const DT_COUPON_COLUMN = [
  {
    accessorKey: "code", //access nested data with dot notation
    header: "Code Name",
  },
  {
    accessorKey: "discountPercentage", //access nested data with dot notation
    header: "Discount Percentage",
  },
  {
    accessorKey: "minShoppingAmount", //access nested data with dot notation
    header: "Min Shopping Amount",
  },
  {
    accessorKey: "validity", //access nested data with dot notation
    header: "Validity",
    Cell: ({ renderedCellValue }) =>
      new Date() > new Date(renderedCellValue) ? (
        <Chip
          color="error"
          label={dayjs(renderedCellValue).format("DD/MM/YYYY")}
        />
      ) : (
        <Chip
          color="success"
          label={dayjs(renderedCellValue).format("DD/MM/YYYY")}
        />
      ),
  },
];
export const DT_PRODUCT_COLUMN = [
  {
    accessorKey: "name", //access nested data with dot notation
    header: "Product Name",
  },
  {
    accessorKey: "slug", //access nested data with dot notation
    header: "Slug",
  },
  {
    accessorKey: "category", //access nested data with dot notation
    header: "Category",
  },
  {
    accessorKey: "mrp", //access nested data with dot notation
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice", //access nested data with dot notation
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage", //access nested data with dot notation
    header: "Discount Percentage",
  },
];
export const DT_PRODUCT_VARIANT_COLUMN = [
  {
    accessorKey: "product", //access nested data with dot notation
    header: "Product Name",
  },
  {
    accessorKey: "color", //access nested data with dot notation
    header: "Color",
  },
  {
    accessorKey: "sku", //access nested data with dot notation
    header: "SKU",
  },
  {
    accessorKey: "size", //access nested data with dot notation
    header: "Size",
  },
  {
    accessorKey: "mrp", //access nested data with dot notation
    header: "MRP",
  },
  {
    accessorKey: "sellingPrice", //access nested data with dot notation
    header: "Selling Price",
  },
  {
    accessorKey: "discountPercentage", //access nested data with dot notation
    header: "Discount Percentage",
  },
];

export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avatar", //access nested data with dot notation
    header: "Avatar",
    Cell: ({ renderedCellValue }) => (
      <Avatar>
        <AvatarImage src={renderedCellValue?.url || userIcon.src} />
      </Avatar>
    ),
  },
  {
    accessorKey: "name", //access nested data with dot notation
    header: "Name",
  },
  {
    accessorKey: "email", //access nested data with dot notation
    header: "Email",
  },
  {
    accessorKey: "phoneNumber", //access nested data with dot notation
    header: "Phone Number",
  },
  {
    accessorKey: "address", //access nested data with dot notation
    header: "Address",
  },
  {
    accessorKey: "isEmailVerified", //access nested data with dot notation
    header: "Is Email Verified",
    Cell: ({ renderedCellValue }) =>
      renderedCellValue ? (
        <Chip color="success" label="Verified" />
      ) : (
        <Chip color="error" label="Not verified" />
      ),
  },
];
export const DT_REVIEW_COLUMN = [
  {
    accessorKey: "product", //access nested data with dot notation
    header: "Product",
  },
  {
    accessorKey: "user", //access nested data with dot notation
    header: "User",
  },
  {
    accessorKey: "title", //access nested data with dot notation
    header: "Title",
  },
  {
    accessorKey: "rating", //access nested data with dot notation
    header: "Rating",
  },
  {
    accessorKey: "review", //access nested data with dot notation
    header: "Review",
  },
];

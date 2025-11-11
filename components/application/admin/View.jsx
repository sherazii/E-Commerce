import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";
import React from "react";
import { IoEye } from "react-icons/io5";

const ViewAction = ({ href }) => {
  return (
    <MenuItem key="edit">
      <Link className="flex items-center" href={href}>
        <ListItemIcon>
          <IoEye/>
        </ListItemIcon>
        View
      </Link>
    </MenuItem>
  );
};

export default ViewAction;

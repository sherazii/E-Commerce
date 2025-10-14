import { DeleteOutlineSharp } from "@mui/icons-material";
import { ListItemIcon, MenuItem } from "@mui/material";
import React from "react";

const DeleteAction = ({ handleDelete, row, deleteType }) => {
  return (
    <MenuItem key="delete" onClick={() => handleDelete([row.original._id], deleteType)}>
      <ListItemIcon>
        <DeleteOutlineSharp />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

export default DeleteAction;

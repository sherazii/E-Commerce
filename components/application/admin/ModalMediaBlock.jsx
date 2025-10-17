import { Checkbox } from "@mui/material";
import React from "react";

const ModalMediaBlock = ({
  media,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  return (
    <label
      htmlFor={media._id}
      className="border-gray-200 border dark:border-gray-900 relative group rounded-xl overflow-hidden"
    >
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          id={media._id}
          checked={
            selectedMedia.find((m) => m._id === media._id) ? true : false
          }
        />{" "}
      </div>
    </label>
  );
};

export default ModalMediaBlock;

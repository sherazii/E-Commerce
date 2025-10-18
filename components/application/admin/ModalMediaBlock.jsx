import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import React from "react";

const ModalMediaBlock = ({
  media,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  // ✅ Normalize selected IDs for consistent comparison
  const selectedIds = selectedMedia.map((m) =>
    typeof m === "string" ? m : m._id
  );
  const isSelected = selectedIds.includes(media._id);

  const handleCheck = () => {
    let newSelectedMedia = [];

    if (isMultiple) {
      if (isSelected) {
        // ✅ Remove if already selected
        newSelectedMedia = selectedMedia.filter(
          (m) => (typeof m === "string" ? m : m._id) !== media._id
        );
      } else {
        // ✅ Add new selection
        newSelectedMedia = [
          ...selectedMedia,
          { _id: media._id, url: media.secure_url },
        ];
      }
    } else {
      // ✅ Single selection mode
      newSelectedMedia = [{ _id: media._id, url: media.secure_url }];
    }

    setSelectedMedia(newSelectedMedia);
  };

  return (
    <label
      htmlFor={media._id}
      className={`relative group rounded-xl overflow-hidden border-2 cursor-pointer transition-all
      ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-300"
          : "border-gray-200 dark:border-gray-900"
      }`}
    >
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox id={media._id} checked={isSelected} onCheckedChange={handleCheck} />
      </div>

      {/* Image */}
      <div className="size-full relative">
        <Image
          src={media.secure_url}
          alt={media.alt || ""}
          width={300}
          height={300}
          className="object-cover md:h-[150px] h-[100px] w-full"
        />

        {/* Overlay for selected */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 transition-all duration-150"></div>
        )}
      </div>
    </label>
  );
};

export default ModalMediaBlock;

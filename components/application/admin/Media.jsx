import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia,
}) => {
  // ✅ Toggle selection on checkbox
  const handleCheck = (checked) => {
    if (checked) {
      // Add to selected list
      setSelectedMedia((prev) => [...prev, media._id]);
    } else {
      // Remove from selected list
      setSelectedMedia((prev) => prev.filter((id) => id !== media._id));
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleCheck}
        />
      </div>

      {/* Image Preview */}
      <div>
        <Image
          src={media?.secure_url}
          alt={media?.alt || "Image"}
          width={300}
          height={300}
          className="object-cover w-full sm:h-[200px] h-[150px]"
          priority
        />
      </div>
    </div>
  );
};

export default Media;

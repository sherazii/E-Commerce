import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaEllipsisVertical } from "react-icons/fa6";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ADMIN_MEDIA_EDIT } from "@/routes/AdminPanelRoute";
import { CiEdit } from "react-icons/ci";
import { IoIosLink } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { showToast } from "@/lib/showToast";

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

  const copyLinkHandler = async (url) => {
    await navigator.clipboard.writeText(url);
    showToast('success', 'Link Copied')
  };
  return (
    <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleCheck}
          className={"border-primary cursor-pointer"}
        />
      </div>
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/50 transition-all duration-100 cursor-pointer ">
              <FaEllipsisVertical className="text-white" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild className={"cursor-pointer"}>
                  <Link href={ADMIN_MEDIA_EDIT(media._id)}>
                    <span>
                      <CiEdit /> Edit
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className={"cursor-pointer"}
                  onClick={() => copyLinkHandler(media.secure_url)}
                >
                  <span>
                    <IoIosLink /> Copy Link
                  </span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild className={"cursor-pointer"} onClick={() => {handleDelete([media._id], deleteType)}}>
              <span>
                <FaTrashAlt color="red" />{" "}
                {deleteType === "SD"
                  ? "Move Into Trash"
                  : "Delete Permanentaly"}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full h-full absolute z-10 transition duration-150 ease-in group-hover:bg-black/20" />

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

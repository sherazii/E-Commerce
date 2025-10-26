"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const UploadMedia = ({ isMultiple, queryClient }) => {
  // 🔹 Handle Cloudinary upload errors
  const errorHandler = (error) => {
    showToast("error", error?.statusText || "Upload failed");
  };

  // 🔹 Handle queue completion (when all uploads are done)
  const queuedHandler = async (results) => {
    const files = results?.info?.files || [];

    const uploadedFiles = files
      .filter((file) => file.uploadInfo)
      .map((file) => ({
        asset_id: file.uploadInfo.asset_id,
        public_id: file.uploadInfo.public_id,
        secure_url: file.uploadInfo.secure_url,
        path: file.uploadInfo.path,
        thumbnail_url: file.uploadInfo.thumbnail_url,
      }));

    if (uploadedFiles.length > 0) {
      try {
        const { data: mediaUploadResponse } = await axios.post(
          "/api/media/create",
          uploadedFiles
        );

        if (!mediaUploadResponse.success) {
          throw new Error(mediaUploadResponse.message);
        }

        queryClient.invalidateQueries("media-data");
        showToast("success", mediaUploadResponse.message);
      } catch (error) {
        showToast("error", error.message);
      }
    }
  };

  return (
    <div className=" ">
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary-signature"
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onError={errorHandler}
        onQueuesEnd={queuedHandler}
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          sources: ["local", "url", "unsplash", "google_drive"],
          multiple: isMultiple,
          maxFiles: 20,
        }}
      > 
        {({ open }) => (
          <Button
            type="button"
            onClick={() => open?.()}
            className="flex items-center gap-2"
          >
            <FiPlus />
            Upload Media
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
};

export default UploadMedia;

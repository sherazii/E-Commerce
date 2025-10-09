"use client";
import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { showToast } from "@/lib/showToast";
const UploadMedia = ({ isMultiple }) => {
  const errorHandler = (error) => {
    showToast("error", error.statusText);
  };
  const QueuendHandler = async (results) => {
    const files = results.info.files;
    const uploadedFiles = files
      .filter((file) => file.uploadInfo)
      .map((file) => ({
        asset_id: file.uploadInfo.asset_id,
        public_id: file.uploadInfo.public_id,
        secure_url: file.uploadInfo.secure_url,
        path: file.uploadInfo.path,
        thumbnail_url: file.uploadInfo.thumbnail_url,
      }));
      if(uploadedFiles.length > 0){
        
      }
  };
  return (
    <CldUploadWidget
      signatureEndpoint="/api/cloudinary-signature"
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onError={errorHandler}
      onQueuesEnd={QueuendHandler}
      config={{
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      }}
      options={{
        sources: ["local", "url", "unsplash", "google_drive"],
        multiple: isMultiple,
        maxFiles: 5,
      }}
    >
      {({ open }) => {
        return (
          <Button className="button" onClick={() => open()}>
            <FiPlus />
            Upload Media
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default UploadMedia;

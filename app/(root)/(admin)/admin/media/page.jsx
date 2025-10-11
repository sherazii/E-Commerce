"use client";

import BreadCrumb from "@/components/application/admin/BreadCrumb";
import Media from "@/components/application/admin/Media";
import UploadMedia from "@/components/application/admin/UploadMedia";
import Loading from "@/components/application/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import { Label } from "@/components/ui/label"; // switched to your UI label
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const breadCrumbData = [
  { href: "/admin/dashboard", label: "Home" },
  { href: "", label: "Media" },
];

const MediaPage = () => {
  // deleteType: "SD" = normal media view, "PD" = trash view
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const searchParams = useSearchParams();
  // keep your custom delete hook usage unchanged
  const deleteMutation = useDeleteMutation("media-data", "/api/media/delete");

  // If the URL has ?trashof=media, switch to trash (PD). Reset selections on change.
  useEffect(() => {
    const trashof = searchParams.get("trashof");
    setSelectedMedia([]);
    setSelectAll(false);
    if (trashof) setDeleteType("PD");
    else setDeleteType("SD");
  }, [searchParams]);

  // API fetch helper
  const fetchMedia = async (page, deleteType) => {
    // fixed query string: single & separators
    const { data: response } = await axios.get(
      `/api/media?page=${page}&limit=10&deleteType=${deleteType}`
    );
    return response;
  };

  // useInfiniteQuery kept exactly as you had it
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-data", deleteType],
    queryFn: async ({ pageParam = 0 }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // lastPage.hasMore should be provided by your API (true/false)
      return lastPage.hasMore ? pages.length : undefined;
    },
  });

  // Delete handler (keeps your mutate signature)
  const handleDelete = (selectedIds, type) => {
    let confirmed = true;
    if (type === "PD") {
      confirmed = confirm("Are you sure you want to delete this data permanently?");
    }

    if (confirmed) {
      // keep your deleteMutation API usage untouched
      deleteMutation.mutate({ids:selectedIds, deleteType:type});
    }

    // reset selections after action
    setSelectAll(false);
    setSelectedMedia([]);
  };

  // Toggle selectAll flag
  const selectAllHandler = () => setSelectAll((prev) => !prev);

  // When selectAll toggles on, collect all visible IDs. When toggled off, clear selection.
  useEffect(() => {
    if (selectAll && data) {
      // flatten pages and map ids
      const ids = data.pages.flatMap((page) =>
        page.mediaData.map((media) => media._id)
      );
      setSelectedMedia(ids);
    } else if (!selectAll) {
      setSelectedMedia([]);
    }
  }, [selectAll, data]);

  return (
    <div className="mb-5">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="py-0 rounded shadow-md">
        <CardHeader className="p-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? "Media" : "Media Trash"}
            </h4>

            <div className="flex items-center gap-5">
              {deleteType === "SD" && <UploadMedia />}

              <div className="flex gap-3">
                {deleteType === "SD" ? (
                  <Button type="button" variant="destructive">
                    <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
                  </Button>
                ) : (
                  <Button type="button">
                    <Link href={`${ADMIN_MEDIA_SHOW}`}>Back To Media</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Action bar shown only when at least one media is selected */}
          {selectedMedia.length > 0 && (
            <div className="p-3 bg-violet-200 mb-2 rounded flex items-center justify-between">
              <Label className="flex items-center gap-3">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={selectAllHandler}
                  className="border-primary"
                />
                Select All
              </Label>

              <div>
                {deleteType === "SD" ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMedia, "SD")}
                  >
                    Move Into Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-700 mr-2"
                      onClick={() => handleDelete(selectedMedia, "RSD")}
                    >
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedMedia, "PD")}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Content area: loading / error / grid */}
          {status === "pending" ? (
            <Loading />
          ) : status === "error" ? (
            <p>Error: {error?.message || "Something went wrong"}</p>
          ) : (
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
              {/* map pages and media items directly (no unnecessary Fragment) */}
              {data?.pages?.map((page, pageIndex) =>
                page.mediaData.map((media) => (
                  <Media
                    key={media._id}
                    media={media}
                    handleDelete={handleDelete}
                    deleteType={deleteType}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                  />
                ))
              )}
            </div>
          )}

          {/* Optionally trigger fetchNextPage from UI or on scroll — left as-is */}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;

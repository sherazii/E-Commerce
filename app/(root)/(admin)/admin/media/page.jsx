"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import Media from "@/components/application/admin/Media";
import UploadMedia from "@/components/application/admin/UploadMedia";
import Loading from "@/components/application/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Fragment, useState } from "react";

const breadCrumbData = [
  {
    href: "/admin/dashboard",
    label: "Home",
  },
  {
    href: "",
    label: "Media",
  },
];
const MediaPage = () => {
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`
    );
    return response;
  };

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
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      return lastPage.hasMore ? nextPage : undefined;
    },
  });

  const handleDelete = () => {};

  return (
    <div className="mb-5">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className=" py-0 rounded shadow-md">
        <CardHeader className="p-3 border-b [.border-b]:pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">Media</h4>
            <div className="flex items-center gap-5">
              <UploadMedia />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {status === "pending" ? (
            <Loading />
          ) : status === "error" ? (
            <p>Error: {error.message}</p>
          ) : (
            <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
              {data?.pages?.map((page, index) => (
                <Fragment key={index}>
                  {page.mediaData.map((media) => (
                    <Media
                      className=""
                      key={media._id}
                      media={media}
                      handleDelete={handleDelete}
                      deleteType={deleteType}
                      selectedMedia={selectedMedia}
                      setSelectedMedia={setSelectedMedia}
                    />
                  ))}
                </Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaPage;

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import loading from "@/public/assets/images/loading.svg";
import Media from "./Media";
import ModalMediaBlock from "./ModalMediaBlock";
import { showToast } from "@/lib/showToast";
import ButtonLoading from "../ButtonLoading";

const MediaModal = ({
  open,
  setOpen,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
  const [prevSelected, setPrevSelected] = useState([]);
  const fetchMedia = async (page) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&&limit=18&&deleteType=SD`
    );
    return response;
  };

  // useInfiniteQuery kept exactly as you had it
  const {
    data,
    error,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["media-modal"],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam),
    placeholderData: keepPreviousData,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // lastPage.hasMore should be provided by your API (true/false)
      return lastPage.hasMore ? pages.length : undefined;
    },
  });

  const handleClear = () => {
    setSelectedMedia([]);
    setPrevSelected([]);
    showToast("success", "Media Selection cleared.");
  };
  const handleClose = () => {
    setSelectedMedia(prevSelected);
    setOpen(false);
  };
  const handleSelect = () => {
    if (selectedMedia.length <= 0) {
      return showToast("error", "Please select a media");
    }
    setPrevSelected(selectedMedia);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[80%] h-screen p-0 py-10 bg-transparent border-0 shadow-none"
      >
        <DialogDescription className="hidden" />
        <div className="h-[90vh] bg-white p-3 rounded  shadow">
          <DialogHeader className="border-b pb-3">
            <DialogTitle>Media Selection</DialogTitle>
          </DialogHeader>
          <div className="h-[calc(100%-80px)] overflow-auto py-2 ">
            {isPending ? (
              <>
                <div className="size-full flex items-center justify-center">
                  <Image src={loading} alt="loading" height={80} width={80} />
                </div>
              </>
            ) : isError ? (
              <>
                <div className="size-full flex items-center justify-center">
                  <span className="text-red-500">{error.message}</span>
                </div>
              </>
            ) : (
              <>
                <div className="grid lg:grid-cols-6 grid-cols-3 gap-2">
                  {data?.pages
                    ?.flatMap((page) => page.mediaData || [])
                    .map((media, idx) => (
                      <ModalMediaBlock
                        key={media._id}
                        media={media}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                        isMultiple={isMultiple}
                      />
                    ))}
                  {/* Optionally trigger fetchNextPage from UI or on scroll — left as-is */}
                  <div className="flex items-center justify-center my-10 col-span-6">
                    {hasNextPage && (
                        <ButtonLoading
                          type="button"
                          loading={isFetching}
                          onClick={() => fetchNextPage()}
                          text="Load More"
                        />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="h-10 pt-3 border-t flex justify-between">
            <div>
              <Button type="button" variant="destructive" onClick={handleClear}>
                Clear All
              </Button>
            </div>
            <div className="flex gap-5">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="button" onClick={handleSelect}>
                Select
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaModal;

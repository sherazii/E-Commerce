"use client";
import Filter from "@/components/application/website/Filter";
import Sorting from "@/components/application/website/Sorting";
import WebsiteBreadcrumb from "@/components/application/website/WebsiteBreadcrumb";
import { WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/useWindowSIze";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "@/components/application/Loading";
import FeatureProductBox from "@/components/application/website/FeatureProductBox";
import ButtonLoading from "@/components/application/ButtonLoading";

const breadcrumb = {
  title: "Shop",
  links: [
    {
      label: "Shop",
      href: WEBSITE_SHOP,
    },
  ],
};

const Shop = () => {
  const searchParams = useSearchParams().toString();
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const windowSize = useWindowSize();

  const fetchProduct = async (pageParam) => {
    const { data: getProduct } = await axios.get(
      `/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`
    );
    if (!getProduct.success) return;
    return getProduct.data;
  };

  // ✅ 2️⃣ Fix useInfiniteQuery setup
  const { data, error, isFetching, fetchNextPage, hasNextPage } =
  useInfiniteQuery({
    queryKey: ["products", limit, sorting, searchParams],
    queryFn: async ({ pageParam = 0 }) => await fetchProduct(pageParam),
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    initialPageParam: 0,
  });


  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <section className="lg:flex lg:px-32 px-4 my-20">
        {windowSize.width > 1024 ? (
          <div className="w-72 me-4">
            <div className="sticky top-0 bg-gray-50 p-4 rounded">
              <Filter />
            </div>
          </div>
        ) : (
          <Sheet
            open={mobileFilterOpen}
            onOpenChange={() => setMobileFilterOpen(!mobileFilterOpen)}
          >
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="py-2 px-4 overflow-auto h-[calc(100vh - 80px)]">
                <Filter />
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="lg:w-[calc(100%-18rem)] me-4 ">
          <div className=" bg-gray-50 p-4 rounded">
            <Sorting
              limit={limit}
              setLimit={setLimit}
              sorting={sorting}
              setSorting={setSorting}
              mobileFilterOpen={mobileFilterOpen}
              setMobileFilterOpen={setMobileFilterOpen}
            />
          </div>
          {isFetching && (
            <>
              <div className="text-xl font-bold text-center mt-10">Loading...</div>
            </>
          )}
          {error && (
            <>
              <div className="text-xl font-bold">{error.message}</div>
            </>
          )}
          <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5 mt-5">
            {data &&
              data.pages.map((page) =>
                page.products.map((product) => (
                  <FeatureProductBox key={product._id} product={product} />
                ))
              )}
          </div>
          <div className="flex justify-center mt-10">
            {hasNextPage ? (
              <ButtonLoading type="button" loading={isFetching} text="Load more" onClick={fetchNextPage} />
            ) : (
              <>{!isFetching && <span>No more data to load.</span>}</>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

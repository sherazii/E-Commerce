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
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const windowSize = useWindowSize();
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
          <div className="sticky top-0 bg-gray-50 p-4 rounded">
            <Sorting
              limit={limit}
              setLimit={setLimit}
              sorting={sorting}
              setSorting={setSorting}
              mobileFilterOpen={mobileFilterOpen}
              setMobileFilterOpen={setMobileFilterOpen}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

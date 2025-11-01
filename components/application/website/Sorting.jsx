import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortings } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { IoFilter } from "react-icons/io5";

const Sorting = ({
  sorting,
  setSorting,
  limit,
  setLimit,
  mobileFilterOpen,
  setMobileFilterOpen,
}) => {
  return (
    <div className="flex justify-between items-center flex-wrap gap-2 p-4 bg-gray-50">
      {/* Toggle filter drawer in mobile */}
      <Button
        type="button"
        onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
        variant={"outline"}
        className={"lg:hidden"}
      >
        <IoFilter /> Filter
      </Button>

      {/* Limit selector (show number of products per page) */}
      <ul className="flex gap-4 items-center">
        <li className={"font-semibold"}>Show</li>
        {[9, 12, 18, 24].map((limitNumber) => (
          <li key={limitNumber}>
            <button
              onClick={() => setLimit(limitNumber)} // Set product listing limit
              type="button"
              className={`${
                limitNumber === limit
                  ? "w-8 h-8 flex justify-center items-center rounded-full bg-primary text-white text-sm cursor-pointer"
                  : "cursor-pointer"
              }`}
            >
              {limitNumber}
            </button>
          </li>
        ))}
      </ul>

      {/* Sorting dropdown */}
      <Select value={sorting} onValueChange={(value) => setSorting(value)}>
        <SelectTrigger className="w-full md:w-[180px] bg-white">
          <SelectValue placeholder="Default Sorting" />
        </SelectTrigger>
        <SelectContent>
          {sortings.map((item, idx) => (
            <SelectItem value={item.value} key={idx}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sorting;

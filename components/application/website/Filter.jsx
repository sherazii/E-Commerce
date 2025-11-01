"use client";

import useFetch from "@/hooks/useFetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import ButtonLoading from "../ButtonLoading";
import { useRouter, useSearchParams } from "next/navigation";
import { WEBSITE_HOME, WEBSITE_SHOP } from "@/routes/WebsiteRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch category list
  const { data: categoryData } = useFetch("/api/category/get-category");

  // Fetch available colors
  const { data: colorData } = useFetch("/api/product-variant/color");

  // Fetch available sizes
  const { data: sizeData } = useFetch("/api/product-variant/size");

  // Price range state
  const [priceFilter, setPriceFilter] = useState({ minPrice: 0, maxPrice: 0 });

  // Selected filter states
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);

  // Copy URL parameters for updating
  const urlSearchParams = new URLSearchParams(searchParams.toString());

  useEffect(() => {
    // Restore selected category from URL on page load
    searchParams.get("category")
      ? setSelectedCategory(searchParams.get("category").split(","))
      : setSelectedCategory([]);

    // Restore selected color from URL on page load
    searchParams.get("color")
      ? setSelectedColor(searchParams.get("color").split(","))
      : setSelectedColor([]);

    // Restore selected size from URL on page load
    searchParams.get("size")
      ? setSelectedSize(searchParams.get("size").split(","))
      : setSelectedSize([]);
  }, [searchParams]);

  // Handle price slider update
  const priceChangeHandler = (value) => {
    setPriceFilter({ minPrice: value[0], maxPrice: value[1] });
  };

  // Handle category filter click
  const handleCategoryFilter = (categorySlug) => {
    let newSelectedCategory = [...selectedCategory];

    newSelectedCategory.includes(categorySlug)
      ? (newSelectedCategory = newSelectedCategory.filter(
          (cat) => cat !== categorySlug
        ))
      : newSelectedCategory.push(categorySlug);

    setSelectedCategory(newSelectedCategory);

    // Update URL based on selection
    newSelectedCategory.length > 0
      ? urlSearchParams.set("category", newSelectedCategory.join(","))
      : urlSearchParams.delete("category");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  // Handle color filter click
  const handleColorFilter = (color) => {
    let newSelectedColor = [...selectedColor];

    newSelectedColor.includes(color)
      ? (newSelectedColor = newSelectedColor.filter((col) => col !== color))
      : newSelectedColor.push(color);

    setSelectedColor(newSelectedColor);

    // Update URL based on selection
    newSelectedColor.length > 0
      ? urlSearchParams.set("color", newSelectedColor.join(","))
      : urlSearchParams.delete("color");

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };

  // Handle size filter click
const handleSizeFilter = (size) => {
  let newSelectedSize = [...selectedSize];

  newSelectedSize.includes(size)
    ? (newSelectedSize = newSelectedSize.filter((s) => s !== size))
    : newSelectedSize.push(size);

  setSelectedSize(newSelectedSize);

  // Update URL based on selection
  newSelectedSize.length > 0
    ? urlSearchParams.set("size", newSelectedSize.join(","))
    : urlSearchParams.delete("size");

  router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
};


  //Handle price filter
  const handlePriceFilter = () => {
    urlSearchParams.set("minPrice", priceFilter.minPrice);
    urlSearchParams.set("maxPrice", priceFilter.maxPrice);

    router.push(`${WEBSITE_SHOP}?${urlSearchParams}`);
  };
  return (
    <div className="">
      <Button type="button" variant='destructive' className="w-full cursor-pointer" asChild><Link href={WEBSITE_SHOP}>Clear Filters</Link></Button>
      <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
        {/* Category Filter */}
        <AccordionItem value="1">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {categoryData?.success &&
                  categoryData?.data?.map((category) => (
                    <li key={category._id}>
                      <label className="flex items-center space-x-3 mt-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() =>
                            handleCategoryFilter(category.slug)
                          }
                          checked={selectedCategory.includes(category.slug)}
                        />
                        <span>{category.name}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="2">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {sizeData?.success &&
                  sizeData?.data?.map((size) => (
                    <li key={size}>
                      <label className="flex items-center space-x-3 mt-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() => handleSizeFilter(size)}
                          checked={selectedSize.includes(size)}
                        />
                        <span>{size}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="3">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Color
          </AccordionTrigger>
          <AccordionContent>
            <div className="max-h-48 overflow-auto">
              <ul>
                {colorData?.success &&
                  colorData?.data?.map((color) => (
                    <li key={color}>
                      <label className="flex items-center space-x-3 mt-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={() => handleColorFilter(color)}
                          checked={selectedColor.includes(color)}
                        />
                        <span>{color}</span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Filter */}
        <AccordionItem value="4">
          <AccordionTrigger className="uppercase font-semibold hover:no-underline">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <Slider
              defaultValue={[0, 3000]}
              max={3000}
              step={1}
              onValueChange={priceChangeHandler}
              className="my-2"
            />

            {/* Showing selected min & max price */}
            <div className="flex justify-between items-center pt-2">
              <span>
                {priceFilter.minPrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "PKR",
                })}
              </span>
              <span>
                {priceFilter.maxPrice.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "PKR",
                })}
              </span>
            </div>

            <div className="mt-4">
              <ButtonLoading
                type="button"
                text="Filter price"
                className="rounded-full cursor-pointer"
                onClick={handlePriceFilter}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Filter;

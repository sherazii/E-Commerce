"use client";
import useFetch from "@/hooks/useFetch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider"

const Filter = () => {
  const { data: categoryData } = useFetch("/api/category/get-category");
  const { data: colorData } = useFetch("/api/product-variant/color");
  const { data: sizeData } = useFetch("/api/product-variant/size");

  return (
    <Accordion type="multiple" defaultValue={["1", "2", "3", "4"]}>
      <AccordionItem value="1">
        <AccordionTrigger
          className={"uppercase font-semibold hover:no-underline"}
        >
          Category
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <ul>
              {categoryData &&
                categoryData?.success &&
                categoryData?.data?.map((category) => <li key={category._id}>
                    <label  className="flex items-center space-x-3 mt-2 cursor-pointer"><Checkbox/> <span>{category.name}</span></label>
                </li>)}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="2">
        <AccordionTrigger
          className={"uppercase font-semibold hover:no-underline"}
        >
          Size
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <ul>
              {sizeData &&
                sizeData?.success &&
                sizeData?.data?.map((size) => <li key={size}>
                    <label  className="flex items-center space-x-3 mt-2 cursor-pointer"><Checkbox/> <span>{size}</span></label>
                </li>)}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="3">
        <AccordionTrigger
          className={"uppercase font-semibold hover:no-underline"}
        >
          Color
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <ul>
              {colorData &&
                colorData?.success &&
                colorData?.data?.map((color) => <li key={color}>
                    <label  className="flex items-center space-x-3 mt-2 cursor-pointer"><Checkbox/> <span>{color}</span></label>
                </li>)}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="4">
        <AccordionTrigger
          className={"uppercase font-semibold hover:no-underline"}
        >
          Price Range
        </AccordionTrigger>
        <AccordionContent>
          <div className="max-h-48 overflow-auto">
            <Slider defaultValue={[33]} max={100} step={1} />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Filter;

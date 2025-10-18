"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/showToast";
import slugify from "slugify";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import {  ADMIN_DASHBOARD, ADMIN_PRODUCT_VARIANT_SHOW } from "@/routes/AdminPanelRoute";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/application/Select";
import Editor from "@/components/application/admin/Editor";
import MediaModal from "@/components/application/admin/MediaModal";
import Image from "next/image";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_PRODUCT_VARIANT_SHOW,
    label: "Product Variants",
  },
  {
    href: "",
    label: "Add Product variant",
  },
];

const formSchema = zSchema.pick({
  name: true,
  slug: true,
  category: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
  description: true,
});

function AddProduct() {
  const [productOption, setProductOption] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  //Fetching categories
  const { data: productData } = useFetch(`/api/category?deleteType=SD&&size=10000`);
  useEffect(() => {
    if (productData && productData.success) {
      const options = productData?.data?.map((product) => ({
        label: product.name,
        value: product._id,
      }));
      setProductOption(options);
    }
  }, [productData]);

  // initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      description: "",
    },
  });

  // Calculate discount percentage
  const mrp = form.watch("mrp");
  const sellingPrice = form.watch("sellingPrice");

  useEffect(() => {
    const mrpValue = parseFloat(form.getValues("mrp")) || 0;
    const sellingPriceValue = parseFloat(form.getValues("sellingPrice")) || 0;

    const discount = mrpValue - sellingPriceValue;
    const discountPercentage = (discount / mrpValue) * 100;

    // If discountPercentage is NaN or infinite, set 0 instead
    const validDiscount =
      isNaN(discountPercentage) || !isFinite(discountPercentage)
        ? 0
        : parseFloat(discountPercentage).toFixed(2);

    form.setValue("discountPercentage", validDiscount);
  }, [mrp, sellingPrice]);

  // 2. Define a submit handler.
  async function onSubmit(data) {
    
    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select media");
      }
      const mediaIds = selectedMedia.map((media) => media._id);
      data.media = mediaIds;

      const { data: response } = await axios.post("/api/product-variant/create", data);

      // Axios auto-parses response JSON → available in response.data
      if (!response.success) {
        showToast("error", response.data.message || "Something went wrong!");
        return;
      }

      showToast("success", response.message || "Product added successfully!");
      form.reset();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong adding product";
      showToast("error", errorMessage);
    }
  }


  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <div className="w-full h-full flex  justify-center">
        <Card className={`w-[75%] h-[45%] shadow-2xl my-5`}>
          <CardHeader>
            <CardTitle
              className={`w-full text-3xl font-bold font-[Pacifico] text-primary`}
            >
              Add Product Variant{" "}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 grid md:grid-cols-2 gap-5"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Product Slug <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Product slug"
                          type={"text"}
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Select Category <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={categoryOptions}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        MRP<span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Mrp"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Original Price<span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Selling Price"
                          type="number"
                          {...field}
                          step={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter discount %"
                          type="number"
                          readOnly
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product Description
                          <span className="text-red-500 ">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-[99%]">
                            <Editor
                              onChange={handleEditorChange}
                              initialData={field.value}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                  <MediaModal
                    open={open}
                    setOpen={setOpen}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple={true}
                  />
                  {selectedMedia.length > 0 && (
                    <>
                      <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                        {selectedMedia.map((media) => (
                          <div className="h-24 w-24 border" key={media._id}>
                            {
                              <div className="size-full flex items-center justify-center">
                                <Image
                                  src={media.url}
                                  alt=""
                                  className="size-full object-cover"
                                  height={100}
                                  width={100}
                                />
                              </div>
                            }
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <div
                    className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer"
                    onClick={() => setOpen(true)}
                  >
                    <span className="">Select Media</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className={`md:col-span-2 w-50 rounded-full mt-4 block cursor-pointer`}
                >
                  Add Product
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddProduct;

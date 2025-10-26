"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/showToast";
import slugify from "slugify";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_SHOW,
} from "@/routes/AdminPanelRoute";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import MediaModal from "@/components/application/admin/MediaModal";
import Select from "@/components/application/Select";
import Editor from "@/components/application/admin/Editor";
import Image from "next/image";
import { useParams } from "next/navigation";
import { sizes } from "@/lib/utils";
import ButtonLoading from "@/components/application/ButtonLoading";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product variant" },
  { href: "", label: "Edit Product variant" },
];

const formSchema = zSchema.pick({
  _id: true,
  product: true,
  sku: true,
  color: true,
  size: true,
  mrp: true,
  sellingPrice: true,
  discountPercentage: true,
});

function EditProductVariant() {
  const { id } = useParams(); // ✅ Correct way to get dynamic param

  const [productOptions, setProductOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: productData } = useFetch(`/api/product`);
  const { data: productVariantData } = useFetch(
    `/api/product-variant/get/${id}`
  );

  // ✅ Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      product: "",
      sku: "",
      color: "",
      size: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      media: [],
    },
  });

  // ✅ Populate category dropdown
  useEffect(() => {
    if (productData?.success) {
      const options = productData.data.map((product) => ({
        label: product.name,
        value: product._id,
      }));
      setProductOptions(options);
    }
  }, [productData]);

  // ✅ Pre-fill form when product data loads
  useEffect(() => {
    if (productVariantData?.success) {
      const data = productVariantData.data;

      form.reset({
        _id: data?._id,
        product: data?.product,
        sku: data?.sku,
        color: data?.color,
        size: data?.size,
        mrp: data?.mrp,
        sellingPrice: data?.sellingPrice,
        discountPercentage: data?.discountPercentage,
      });

      setSelectedMedia(data.media || []);
    }
  }, [productVariantData]);

  // ✅ Auto-calculate discount
  const mrp = form.watch("mrp");
  const sellingPrice = form.watch("sellingPrice");
  useEffect(() => {
    const mrpVal = parseFloat(mrp) || 0;
    const sellVal = parseFloat(sellingPrice) || 0;
    const discount = mrpVal
      ? (((mrpVal - sellVal) / mrpVal) * 100).toFixed(2)
      : 0;
    form.setValue("discountPercentage", discount);
  }, [mrp, sellingPrice]);

  // ✅ Update product handler
  const productVariantUpdateHandler = async (data) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        media: selectedMedia.map((m) => m._id || m),
      };

      const { data: response } = await axios.put(
        `/api/product-variant/update`,
        payload
      );

      if (!response.success) {
        showToast("error", response.message || "Something went wrong!");
      } else {
        showToast(
          "success",
          response.message || "Product updated successfully!"
        );
      }
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || "Error updating product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:mb-5 mb-100">
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="w-full flex justify-center">
        <Card className="md:w-[75%] w-full shadow-2xl md:mt-20 mt-5">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-[Pacifico] text-primary">
              Update Product Variant
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(productVariantUpdateHandler)}
                className="space-y-2 grid md:grid-cols-2 gap-5"
              >
                <FormField
                  control={form.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Select Product Variant{" "}
                        <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={productOptions}
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
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SKU <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sku" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Variant Color <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Variant color"
                          type={"text"}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Size <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          options={sizes}
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
                                {media?.length > 0 &&
                                  media.map((m) => (
                                    <Image
                                      src={m.path}
                                      alt={m.alt || ""}
                                      className="size-full object-cover"
                                      height={100}
                                      width={100}
                                    />
                                  ))}
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

                <ButtonLoading type="submit" loading={loading} text="Update Variant"/>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EditProductVariant;

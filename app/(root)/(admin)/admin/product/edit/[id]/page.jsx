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
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoute";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import MediaModal from "@/components/application/admin/MediaModal";
import Select from "@/components/application/Select";
import Editor from "@/components/application/admin/Editor";
import Image from "next/image";
import { useParams } from "next/navigation";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Product" },
  { href: "", label: "Edit Product" },
];

const formSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  mrp: z.coerce.number().positive("MRP must be positive"),
  sellingPrice: z.coerce.number().positive("Selling price must be positive"),
  discountPercentage: z.coerce.number().min(0).max(100),
  description: z.string().min(3, "Description is required"),
  category: z.string().optional(),
  media: z.array(
    z.object({
      _id: z.string(),
      url: z.string().optional(),
    })
  ),
});


function EditProduct() {
  const { id } = useParams(); // ✅ Correct way to get dynamic param
  
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const { data: categoryData } = useFetch(`/api/category`);
  const { data: productData } = useFetch(`/api/product/get/${id}`);

  // ✅ Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "",
      description: "",
      media: [],
      category: "",
    },
  });

  // ✅ Populate category dropdown
  useEffect(() => {
    if (categoryData?.success) {
      const options = categoryData.data.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      setCategoryOptions(options);
    }
  }, [categoryData]);

  // ✅ Pre-fill form when product data loads
  useEffect(() => {
    if (productData?.success) {
      const data = productData.data;

      form.reset({
        name: data.name || "",
        slug: data.slug || "",
        mrp: data.mrp || "",
        sellingPrice: data.sellingPrice || "",
        discountPercentage: data.discountPercentage || "",
        description: data.description || "",
        category: data.category?._id || "",
        media: data.media || [],
        _id: id,
      });

      setSelectedMedia(data.media || []);
    }
  }, [productData]);

  // ✅ Auto-generate slug
  const productName = form.watch("name");
  useEffect(() => {
    if (productName) {
      form.setValue(
        "slug",
        slugify(productName, { lower: true, strict: true })
      );
    }
  }, [productName]);

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
  const productUpdateHandler = async (data) => {
    console.log("trigger"); // should now appear in console
    setLoading(true);

    try {
      const payload = {
        ...data,
        media: selectedMedia.map((m) => m._id || m),
      };

      const { data: response } = await axios.put(`/api/product/update`, payload);

      if (!response.success) {
        showToast("error", response.message || "Something went wrong!");
      } else {
        showToast("success", response.message || "Product updated successfully!");
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

  // ✅ Editor content sync
  const handleEditorChange = (_, editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="w-full flex justify-center">
        <Card className="w-[75%] shadow-2xl mt-20">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-[Pacifico] text-primary">
              Edit Product
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(productUpdateHandler)}
                className="space-y-2 grid md:grid-cols-2 gap-5"
              >
                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Slug */}
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <FormControl>
                        <Select
                          options={categoryOptions}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* MRP */}
                <FormField
                  control={form.control}
                  name="mrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MRP *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Selling Price */}
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Discount */}
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount %</FormLabel>
                      <FormControl>
                        <Input readOnly {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Description */}
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <div className="w-[99%]">
                            <Editor
                              key={field.value}
                              onChange={handleEditorChange}
                              initialData={field.value || ""}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Media Section */}
                <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                  <MediaModal
                    open={open}
                    setOpen={setOpen}
                    selectedMedia={selectedMedia}
                    setSelectedMedia={setSelectedMedia}
                    isMultiple={true}
                  />

                  {selectedMedia.length > 0 && (
                    <div className="flex justify-center items-center flex-wrap gap-2 mt-3">
                      {selectedMedia.map((media, idx) => (
                        <div
                          key={idx}
                          className="h-24 w-24 border rounded overflow-hidden"
                        >
                          <Image
                            src={
                              media.secure_url ||
                              media.url ||
                              "/placeholder.png"
                            }
                            alt={media.alt || "Media Image"}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer mt-3"
                    onClick={() => setOpen(true)}
                  >
                    Select Media
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="md:col-span-2 w-50 rounded-full mt-4 cursor-pointer"
                >
                  {loading ? "Updating..." : "Update Product"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EditProduct;

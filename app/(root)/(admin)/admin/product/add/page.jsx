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
import { ADMIN_PRODUCT_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/application/Select";
import Editor from "@/components/application/admin/Editor";
import MediaModal from "@/components/application/admin/MediaModal";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_PRODUCT_SHOW,
    label: "Product",
  },
  {
    href: "",
    label: "Add Product",
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
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(false);
  //Fetching categories
  const { data: categoryData } = useFetch(`/api/category`);
  useEffect(() => {
    if (categoryData && categoryData.success) {
      const options = categoryData?.data?.map((cat) => ({
        label: cat.name,
        value: cat._id,
      }));
      setCategoryOptions(options);
    }
  }, [categoryData]);

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

  //   use slugify pkj
  const categoryName = form.watch("name");
  useEffect(() => {
    if (categoryName) {
      const slug = slugify(categoryName, {
        lower: true,
        strict: true,
      });
      form.setValue("slug", slug);
    }
  }, [categoryName]);

  // 2. Define a submit handler.
  async function onSubmit(data) {
    try {
      const { data: response } = await axios.post("/api/product/create", data);

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

  //Editor
  const editor = (editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };

  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <div className="w-full h-full flex  justify-center">
        <Card className={`w-[75%] h-[45%] shadow-2xl my-5`}>
          <CardHeader>
            <CardTitle
              className={`w-full text-3xl font-bold font-[Pacifico] text-primary`}
            >
              Add Product{" "}
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
                              onChange={editor}
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
                  <div className="bg-gray-50 dark:bg-card border w-[200px] mx-auto p-5 cursor-pointer" onClick={() => setOpen(true)}>
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

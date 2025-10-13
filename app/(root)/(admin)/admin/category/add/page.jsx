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
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { zSchema } from "@/lib/zodSchema";
import axios from "axios";
import { useEffect } from "react";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_CATEGORY_SHOW,
    label: "Category",
  },
  {
    href: "",
    label: "Add Category",
  },
];

const formSchema = zSchema.pick({
  name: true,
  slug: true,
});

function AddCategory() {
  // initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
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
    const {data: response} = await axios.post("/api/category/create", data, {
      headers: { "Content-Type": "application/json" },
    });

    // Axios auto-parses response JSON → available in response.data
    if (!response.success) {
      showToast("error", response.data.message || "Something went wrong!");
      return;
    }

    showToast("success", response.message || "Category added successfully!");
    form.reset();
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message || error?.message || "Something went wrong adding category";
    showToast("error", errorMessage);
  }
}


  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <div className="w-full h-full flex  justify-center">
        <Card className={`w-[75%] h-[45%] shadow-2xl mt-20`}>
          <CardHeader>
            <CardTitle
              className={`w-full text-center text-3xl font-bold font-[Pacifico] text-primary`}
            >
              AddCategory{" "}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter Category name" {...field} />
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
                      <FormControl>
                        <Input placeholder="Your Slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className={`w-[50%] rounded-full mt-4 mx-auto block cursor-pointer`}
                >
                  Add Category
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddCategory;

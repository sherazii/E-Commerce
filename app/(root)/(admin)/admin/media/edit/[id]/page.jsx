"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/useFetch";
import { zSchema } from "@/lib/zodSchema";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/routes/AdminPanelRoute";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import imgPlaceHolder from "@/public/assets/images/img-placeholder.webp";
import axios from "axios";
import { response } from "@/lib/helperFunction";
import { showToast } from "@/lib/showToast";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: "Media",
  },
  {
    href: "",
    label: "Edit Media",
  },
];

const EditMedia = ({ params }) => {
  const { id } = use(params);
  const [loading, setLoading] = useState(false);
  const { data: mediaData } = useFetch(`/api/media/get/${id}`);
  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  useEffect(() => {
    if (mediaData && mediaData.success) {
      const data = mediaData.data;
      form.reset({
        _id: data._id,
        alt: data.alt,
        title: data.title,
      });
    }
  }, [mediaData]);
  const EditSubmitHandler = async (values) => {
    try {
      setLoading(true);
      const { data: mediaResponse } = await axios.put(
        "/api/media/update",
        values
      );
      if (!mediaResponse) {
        throw new Error(response.message);
      }

      showToast("success", "Media updated successfully");
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-md">
        <CardHeader className="p-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Media</h4>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(EditSubmitHandler)}
              className="space-y-8"
            >
              <div className="">
                <Image
                  src={mediaData?.data?.secure_url || imgPlaceHolder}
                  height={150}
                  width={150}
                  alt="Image"
                  className="h-40 w-40"
                  priority
                />
              </div>
              <FormField
                control={form.control}
                name="alt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Alt" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Title" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                type="submit"
                className="w-full rounded-full my-5 cursor-pointer"
                text="Update Media"
                loading={loading}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMedia;

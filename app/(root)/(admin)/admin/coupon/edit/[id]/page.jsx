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
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import {
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
} from "@/routes/AdminPanelRoute";
import axios from "axios";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useParams } from "next/navigation";
import { couponSchema } from "@/lib/zodSchema";
import ButtonLoading from "@/components/application/ButtonLoading";
import dayjs from "dayjs";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupon" },
  { href: "", label: "Edit Coupon" },
];

function EditProduct() {
  const { id } = useParams(); // ✅ Correct way to get dynamic param

  const [loading, setLoading] = useState(false);

  const { data: couponData } = useFetch(
    `/api/coupon/get/${id}`
  );
  
  //Form schema
  const schema = couponSchema
    .pick({
      _id:true,
      code: true,
      discountPercentage: true,
      minShoppingAmount: true,
      validity: true,
    })
    .extend({
      validity: z.string(), // accept date as string instead of coercing
    });
  // initialize form
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      _id: id,
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: "",
    },
  });
  
  

  // ✅ Pre-fill form when coupon data loads
  useEffect(() => {
    if (couponData?.success) {
      const data = couponData.data;
      

      form.reset({
        _id: data._id,
        code: data.code,
        discountPercentage: data.discountPercentage,
        minShoppingAmount: data.minShoppingAmount,
        validity: dayjs(data.validity).format('YYYY/MM/DD'),
      });
    }
  }, [couponData]);

  // ✅ Update coupon handler
  const couponUpdateHandler = async (data) => {
    setLoading(true);
    
 
    try {

      const { data: response } = await axios.put(`/api/coupon/update`, data);

      if (!response.success) {
        showToast("error", response.message || "Something went wrong!");
      } else {
        showToast(
          "success",
          response.message || "Coupon updated successfully!"
        );
      }
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || "Error updating coupon"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <div className="w-full flex justify-center">
        <Card className="md:w-[75%] w-full shadow-2xl md:mt-20 mt-5 ">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold font-[Pacifico] text-primary">
              Edit Coupon
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(couponUpdateHandler)}
                className="space-y-2 grid md:grid-cols-2 gap-5"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code <span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Code" {...field} />
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

                <FormField
                  control={form.control}
                  name="minShoppingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min. Shopping Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter min Shopping Amount"
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
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter min Shopping Amount"
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ButtonLoading type="submit" text="Update Coupon" loading={loading}/>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EditProduct;

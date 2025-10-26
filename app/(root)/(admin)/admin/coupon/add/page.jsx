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
import { ADMIN_DASHBOARD, ADMIN_COUPON_SHOW, ADMIN_COUPON_ADD } from "@/routes/AdminPanelRoute";
import { couponSchema, zSchema } from "@/lib/zodSchema";
import axios from "axios";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_COUPON_SHOW,
    label: "Coupon",
  },
  {
    href: ADMIN_COUPON_ADD,
    label: "Add Coupon",
  },
];

function AddCounpon() {
  //Form schema
  const schema = couponSchema
    .pick({
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
      code: "",
      discountPercentage: "",
      minShoppingAmount: "",
      validity: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(data) {
    try {
      const { data: response } = await axios.post("/api/coupon/create", data);

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
    <div className="md:mb-10 mb-100">
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <div className="w-full h-full flex  justify-center">
        <Card className={`md:w-[75%] w-full h-[45%] shadow-2xl my-5`}>
          <CardHeader>
            <CardTitle
              className={`w-full text-3xl font-bold font-[Pacifico] text-primary`}
            >
              Add Coupon{" "}
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

                <Button
                  type="submit"
                  className={`md:col-span-2 w-50 rounded-full mt-4 block cursor-pointer`}
                >
                  Add Coupon
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddCounpon;

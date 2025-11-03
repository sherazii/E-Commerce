import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { IoStar } from "react-icons/io5";
import ButtonLoading from "../ButtonLoading";
import { useSelector } from "react-redux";
import { FormLabel, Rating } from "@mui/material";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { reviewSchema } from "@/lib/zodSchema";

const ProductReview = ({ productId }) => {
  const auth = useSelector((state) => state.auth);
  const userId = auth?.auth?._id;

  const [loading, setLoading] = useState(false);
  const formSchema = reviewSchema.pick({
    product: true,
    userid: true,
    rating: true,
    title: true,
    review: true,
  });
  // initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: productId,
      userid: userId,
      rating: 1,
      title: "",
      review: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(data) {
    setLoading(true);
    try {
      const { data: response } = await axios.post("/api/reviews/create", data);
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
      showToast("success", response.message);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong adding review";
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="shadow rounded border">
      <div className="p-3 bg-gray-50 border-b">
        <h2 className="font-semibold text-2xl">Rating & Reviews</h2>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center flex-wrap">
          {/* Rating & Reviews */}
          <div className="md:w-1/2 w-full md:flex md:gap-10 md:mb-0 mb-5">
            <div className="md:w-[200px] w-full md:mb-0 mb-5">
              <h4 className="text-center text-8xl font-semibold">0.0</h4>
              <div className="flex justify-center gap-2">
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
                <IoStar />
              </div>
              <p className="text-center mt-3">(0 Rating & Reviews)</p>
            </div>
            <div className="md:w-[calc(100%-200px)] flex items-center">
              <div className="w-full">
                {[5, 4, 3, 2, 1].map((rating, idx) => (
                  <div className="flex items-center mb-2 gap-2" key={idx}>
                    <div className="flex items-center gap-1">
                      <p className="w-3">{rating}</p>
                      <IoStar />
                    </div>
                    <Progress value={20 * rating} />
                    <span className="text-sm">{20 * rating}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Review button */}
          <div className="md:w-1/2 w-full md:text-end text-center">
            <Button
              type="button"
              className="md:w-fit w-full py-6 px-10 cursor-pointer"
              variant={"outline"}
            >
              Write Review
            </Button>
          </div>
        </div>
        {/* form */}
        <div className="my-10">
          <h4 className="text-xl font-semibold mb-3">Write a review</h4>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Rating value={field.value} size="large" {...field} />
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
                      <Input placeholder="Enter Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your comment here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ButtonLoading
                type="submit"
                text="Add Review"
                loading={loading}
                className={`w-32 cursor-pointer`}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;

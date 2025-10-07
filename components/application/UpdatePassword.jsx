"use client"; // 👈 Important: makes this a Client Component
import React, { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import ButtonLoading from "@/components/application/ButtonLoading";
import z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const UpdatePassword = ({ email }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);

  // ✅ Add confirmPassword to schema and refine
  const formSchema = zSchema
    .pick({
      email: true,
      password: true,
    })
    .extend({
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      password: "",
      confirmPassword: "",
    },
  });

  // Registration form submit handler
  const UpdatePasswordHandler = async (values) => {
    try {
      // Exclude confirmPassword before sending to backend
      const { confirmPassword, ...data } = values;

      setLoading(true);
      

      // ✅ Call backend API to register new user
      const { data: passwordUpdate } = await axios.put(
        "/api/auth/reset-password/update-password",
        data
      );

      // ✅ If backend reports failure, throw an error to be caught below
      if (!passwordUpdate.success) {
        throw new Error(passwordUpdate.message || "Registration failed");
      }

      // ✅ Reset the form after successful registration
      form.reset();

      // Show success message
      alert(passwordUpdate.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      // ✅ Handle both backend and network errors gracefully
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      // ✅ Always stop loading state (success or error)
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] mx-auto justify-between">
      <div>
        <h2 className="w-full text-center text-3xl font-bold font-[Pacifico] text-orange-500">
          Update Password
        </h2>
        <p className="my-4">Update password by filling out the form below.</p>
      </div>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(UpdatePasswordHandler)}
            className="space-y-8"
          >
            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="************"
                      type={isTypePassword ? "password" : "text"}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute top-1/2 right-4 cursor-pointer"
                    onClick={() => setIsTypePassword(!isTypePassword)}
                  >
                    {isTypePassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword" // ✅ must match schema key
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="************"
                      type={isTypePassword ? "password" : "text"}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute top-1/2 right-4 cursor-pointer"
                    onClick={() => setIsTypePassword(!isTypePassword)}
                  >
                    {isTypePassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonLoading
              type="submit"
              className="w-full rounded-full mt-2 cursor-pointer"
              text="Update Password"
              loading={loading}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdatePassword;

"use client"; // 👈 Important: makes this a Client Component
import React, { useState } from "react";
import Image from "next/image";
import Logo from "@/public/assets/images/logo-black.png";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import ButtonLoading from "@/components/application/ButtonLoading";
import z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isTypePassword, setIsTypePassword] = useState(true);

  // ✅ Add confirmPassword to schema and refine
  const formSchema = zSchema
    .pick({
      name: true,
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Registration form submit handler
const RegisterSubmitHandler = async (values) => {
  try {
    // Exclude confirmPassword before sending to backend
    const { confirmPassword, ...data } = values;

    setLoading(true);

    // ✅ Call backend API to register new user
    const { data: registerResponse } = await axios.post(
      "/api/auth/register",
      data
    );

    // ✅ If backend reports failure, throw an error to be caught below
    if (!registerResponse.success) {
      throw new Error(registerResponse.message || "Registration failed");
    }

    // ✅ Reset the form after successful registration
    form.reset();

    // Show success message
    alert(registerResponse.message);

  } catch (error) {
    // ✅ Handle both backend and network errors gracefully
    alert(error?.response?.data?.message || error.message || "Something went wrong");
  } finally {
    // ✅ Always stop loading state (success or error)
    setLoading(false);
  }
};


  return (
    <Card className="w-120 text-center">
      <CardHeader>
        <div className="flex justify-center">
          <Image
            src={Logo}
            className="max-w-[150px] h-auto"
            alt="logoImg"
            priority
          />
        </div>
        <CardTitle className="w-full text-center text-3xl font-bold font-[Pacifico] text-orange-500">
          Signup
        </CardTitle>
        <p>Create an account by filling out the form below.</p>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(RegisterSubmitHandler)}
            className="space-y-8"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Your Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              className="w-full rounded-full mt-4 cursor-pointer"
              text="Signup"
              loading={loading}
            />

            <div className="flex items-center justify-center gap-2">
              <span>Already have an account?</span>
              <Link href={WEBSITE_LOGIN} className="text-blue-600 underline">
                Login into your Account
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
import ButtonLoading from "@/components/application/ButtonLoading";
import OTPVerification from "@/components/application/OTPVerification";
import { zSchema } from "@/lib/zodSchema";
import { showToast } from "@/lib/showToast";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoute";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState();
  const [isTypePassword, setIsTypePassword] = useState(true);
  const formSchema = zSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min(3, "password is required"),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ✅ Login submit handler
  const LoginSubmitHandler = async (data) => {
    try {
      setLoading(true);

      // ✅ Call backend API to log in the user
      const { data: loginResponse } = await axios.post("/api/auth/login", data);

      // ✅ If backend reports failure, throw an error to trigger catch block
      if (!loginResponse.success) {
        throw new Error(loginResponse.message || "Login failed");
      }

      setOtpEmail(data.email);
      // ✅ Reset the form after successful login
      form.reset();

      // ✅ Show success message
      showToast("success", loginResponse.message);
    } catch (error) {
      // ✅ Handle both backend and network errors gracefully
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showToast("error", errorMessage);
    } finally {
      // ✅ Always stop loading state (whether success or error)
      setLoading(false);
    }
  };

  //OTP Verification handler
  const OtpVerficationHandler = async (data) => {
    try {
      setOtpVerificationLoading(true);

      // ✅ Call backend API to log in the user
      const { data: otpResponse } = await axios.post(
        "/api/auth/verify-otp",
        data
      );

      // ✅ If backend reports failure, throw an error to trigger catch block
      if (!otpResponse.success) {
        throw new Error(otpResponse.message || "Login failed");
      }

      setOtpEmail("");

      // ✅ Show success message
      showToast("success", otpResponse.message);
    } catch (error) {
      // ✅ Handle both backend and network errors gracefully
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showToast("error", errorMessage);
    } finally {
      // ✅ Always stop loading state (whether success or error)
      setOtpVerificationLoading(false);
    }
  };

  return (
    <Card className="w-120 text-center">
      {!otpEmail ? (
        <>
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
              Login Into Account
            </CardTitle>
            <p>Login into your account by filling out the form below.</p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(LoginSubmitHandler)}
                className="space-y-8"
              >
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
                        className="absolute right-4 top-[38px] cursor-pointer"
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
                  text="Login"
                  loading={loading}
                />

                <div className="flex items-center justify-center gap-2">
                  <span>Don't have an account?</span>
                  <Link
                    href={WEBSITE_REGISTER}
                    className="text-blue-600 underline"
                  >
                    Create an Account
                  </Link>
                </div>
              </form>
              <div className="mt-3">
                <Link href={""} className="text-blue-600 underline">
                  Forgot password?
                </Link>
              </div>
            </Form>
          </CardContent>
        </>
      ) : (
        <OTPVerification
          email={otpEmail}
          onSubmit={OtpVerficationHandler}
          loading={otpVerificationLoading}
        />
      )}
    </Card>
  );
};

export default LoginPage;

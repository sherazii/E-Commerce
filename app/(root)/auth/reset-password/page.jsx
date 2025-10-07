"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import ButtonLoading from "@/components/application/ButtonLoading";
import OTPVerification from "@/components/application/OTPVerification";
import UpdatePassword from "@/components/application/UpdatePassword";

import { zSchema } from "@/lib/zodSchema";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const ResetPassword = () => {
  // 🔹 UI state management
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // 🔹 Define validation schema
  const formSchema = zSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // ✅ Step 1: Send OTP to email
  const handleSendOtp = async (data) => {
    try {
      setIsSendingOtp(true);

      const response = await axios.post("/api/auth/reset-password/send-otp", data);
      const { success, message } = response.data;

      if (!success) throw new Error(message || "Failed to send OTP");

      setEmailForOtp(data.email);
      showToast("success", message || "OTP sent successfully!");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to send OTP. Please try again.";
      showToast("error", message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleOtpVerification = async (data) => {
    try {
      setIsVerifyingOtp(true);

      const response = await axios.post("/api/auth/reset-password/verify-otp", data);
      const { success, message } = response.data;

      if (!success) throw new Error(message || "Invalid OTP");

      showToast("success", message || "OTP verified successfully!");
      setIsOtpVerified(true);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify OTP. Try again.";
      showToast("error", message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ✅ Step 3: Update password UI (handled inside <UpdatePassword />)

  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-lg rounded-2xl">
      {!emailForOtp ? (
        <>
          <CardHeader>
            <div className="flex justify-center">
              <Image
                src={Logo}
                alt="Logo"
                className="w-36 h-auto"
                priority
              />
            </div>
            <CardTitle className="text-3xl font-bold text-orange-500 font-[Pacifico] mt-2">
              Reset Password
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Enter your email to receive a reset code.
            </p>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSendOtp)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ButtonLoading
                  type="submit"
                  className="w-full rounded-full mt-4"
                  text="Send OTP"
                  loading={isSendingOtp}
                />

                <div className="text-sm mt-3">
                  <Link
                    href={WEBSITE_LOGIN}
                    className="text-blue-600 hover:underline"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </>
      ) : (
        <>
          {!isOtpVerified ? (
            <OTPVerification
              email={emailForOtp}
              onSubmit={handleOtpVerification}
              loading={isVerifyingOtp}
            />
          ) : (
            <UpdatePassword email={emailForOtp} />
          )}
        </>
      )}
    </Card>
  );
};

export default ResetPassword;

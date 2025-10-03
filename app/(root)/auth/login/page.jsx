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

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
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

  // Login submit handler
  const LoginSubmitHandler = async (values) => {
    console.log(values);
    form.reset();
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="************"
                      type="password"
                      {...field}
                    />
                  </FormControl>
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

            <div className="flex gap-5">
              <span>Don't have an account?</span>
              {/* <Link to={RouteSignup} className="text-blue-600 underline">Signup</Link> */}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

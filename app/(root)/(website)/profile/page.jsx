"use client";
import WebsiteBreadcrumb from "@/components/application/website/WebsiteBreadcrumb";
import React, { useEffect, useState } from "react";
import UserPanelLayout from "../UserPanelLayout";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import userIcon from "@/public/assets/images/user.png";
import { FaCamera } from "react-icons/fa";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authSlice";
const breadCrumbData = {
  title: "Profile",
  links: [{ label: "Profile" }],
};
const UserProfile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState();
  const [file, setFile] = useState();

  // Fetch user data
  const { data: user } = useFetch("/api/profile/get");
  useEffect(() => {
    if (user && user.success) {
      const userData = user.data;
      form.reset({
        name: userData?.name,
        phone: userData?.phone,
        address: userData?.address,
      });
      setPreview(userData?.avatar?.url)
    }

  }, [user]);

  // 🔹 Define validation schema
  const formSchema = zSchema.pick({
    name: true,
    address: true,
    phone: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
    },
  });

  // ✅ Step 1: Send OTP to email
  const handleUpdateProfile = async (data) => {
    setLoading(true);
    try {
      let formData = new FormData()
      if(file){
        formData.set('file', file)
      }
      formData.set('name', data.name)
      formData.set('phone', data.phone)
      formData.set('address', data.address)

      const {data: response} = await axios.put('/api/profile/update', formData)
      if(!response.success){
        throw new Error(response.message)
      }
      showToast('success', response.message)
      dispatch(login(response.data))
    } catch (error) {
      showToast('error', error.message)
    }finally{
      setLoading(false)
    }
  };
  const handleFileSelection = async (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setPreview(preview);
    setFile(file);
  };
  return (
    <div>
      <WebsiteBreadcrumb props={breadCrumbData} />
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border-b">Profile</div>
          <div className="p-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdateProfile)}
                className="grid md:grid-cols-2 grid-cols-1 gap-5"
              >
                <div className="md:col-span-2 col-span-1 flex justify-center items-center">
                  <Dropzone
                    onDrop={(acceptedFiles) =>
                      handleFileSelection(acceptedFiles)
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Avatar
                          className={
                            "w-28 h-28 relative group border border-gray-400"
                          }
                        >
                          <div className="absolute w-full h-full top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2  place-items-center border-2 border-violet-500 rounded-full hidden cursor-pointer group-hover:grid bg-black/30">
                            <FaCamera color="#7c3aed" size={25} />
                          </div>
                          <AvatarImage src={preview ? preview : userIcon.src} />
                        </Avatar>
                      </div>
                    )}
                  </Dropzone>
                </div>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-3 md:col-span-2 col-span-1">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <ButtonLoading
                  type="submit"
                  className="md:w-1/4 cursor-pointer md:col-span-2 col-span-1"
                  text="Update Profile"
                  loading={loading}
                />
              </form>
            </Form>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default UserProfile;

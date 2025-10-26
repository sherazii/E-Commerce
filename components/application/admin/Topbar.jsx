"use client";
import React, { useState } from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";
import AdminSearch from "./AdminSearch";

import LogoBlack from "@/public/assets/images/logo-black.svg";
import LogoWhite from "@/public/assets/images/logo-white.svg";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import SearchModel from "./SearchModel";

const Topbar = () => {
  
    const [open, setOpen] = useState(false);
  const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed border-b h-14  pr-5 ps-5 w-full dark:md:w-[calc(100vw-16rem)] md:w-[calc(100vw-18rem)] top-0 right-0 z-30  flex justify-between items-center bg-[var(--card)] dark:bg-[var(--card)]">
      <div className="flex items-center md:hidden justify-center ">
        <Image
          src={LogoBlack}
          width={50}
          className="block dark:hidden h-[60px] w-[8rem]"
          alt="logo dark"
        />

        <Image
          src={LogoWhite}
          width={50}
          className="hidden dark:block h-[60px] w-[8rem]"
          alt="logo white"
        />
        
      </div>
      <div className="md:block hidden">
        <AdminSearch />
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="cursor-default md:hidden block">
          <IoIosSearch size={25} onClick={() => {setOpen(true)}}/>
        </button>
        <SearchModel open={open} setOpen={setOpen}/>
        <ThemeSwitch />
        <UserDropdown />
        <Button
          type="button"
          size="icon"
          className={`ms-2 md:hidden`}
          onClick={toggleSidebar}
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;

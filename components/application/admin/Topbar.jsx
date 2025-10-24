"use client";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed border-b h-14 ps-6 pr-5 w-full md:w-[calc(100vw-16rem)] top-0 right-0 z-30  flex justify-between items-center bg-[var(--card)] dark:bg-[var(--card)]">
      <div className="">Search component</div>
      <div className="flex items-center gap-4">
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

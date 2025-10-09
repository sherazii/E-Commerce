"use client";

import { IoMdClose } from "react-icons/io";
import { LuChevronRight } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import LogoBlack from "@/public/assets/images/logo-black.png";
import LogoWhite from "@/public/assets/images/logo-white.png";

const AppSidebar = () => {
  return (
    <Sidebar>
      {/* ─── Sidebar Header ─────────────────────────────── */}
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-4">
          <Image
            src={LogoBlack}
            width={50}
            className="block dark:hidden h-[50px] w-auto" 
            alt="logo dark"
          />

          <Image
            src={LogoWhite}
            width={50}
            className="hidden dark:block h-[50px] w-auto"
            alt="logo white"
          />
          <Button type="button" size="icon">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      {/* ─── Sidebar Content ────────────────────────────── */}
      <SidebarContent className="p-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminAppSidebarMenu.map((menu, index) => (
                <Collapsible key={index} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex gap-2 items-center cursor-pointer font-semibold px-2 py-5" >
                        <menu.icon />
                        {menu.title}
                        {/* Dropdown arrow rotates on open */}
                        {menu.submenu && menu.submenu.length > 0 && (
                          <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </SidebarMenuButton>
                    </CollapsibleTrigger>

                    {/* Render submenu only if exists */}
                    {menu.submenu && menu.submenu.length > 0 && (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {menu.submenu.map((item, subIndex) => (
                            <SidebarMenuSubItem key={subIndex}>
                              <SidebarMenuSubButton asChild className="cursor-pointer px-2 py-5">
                                {/* ✅ Submenu uses Link correctly now */}
                                <Link href={item.url}>{item.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    )}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

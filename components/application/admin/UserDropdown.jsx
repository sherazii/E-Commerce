import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminLogo from "@/public/assets/images/admin-logo.png";
import { useSelector } from "react-redux";
import Link from "next/link";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";
import LogoutButton from "./LogoutButton";
const UserDropdown = () => {
  const auth = useSelector((state) => state.auth.auth);

  return (
    <DropdownMenu className="mr-4">
      <DropdownMenuTrigger >
        <Avatar>
          <AvatarImage src={AdminLogo.src} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-4 w-44 mt-2">
        <DropdownMenuLabel>{auth?.name}</DropdownMenuLabel>
        <p className="text-[12px] ml-2">({auth?.role})</p>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="" className="cursor-pointer flex gap-2 " >
            <IoShirtOutline /> New Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="" className="cursor-pointer flex gap-2 " >
            <MdOutlineShoppingBag /> Orders
          </Link>
        </DropdownMenuItem>
        <LogoutButton/>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { showToast } from "@/lib/showToast";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import { logout } from "@/store/reducer/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const LogoutHandler = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");
      if (!logoutResponse.success) {
        throw new Error(logoutResponse.message);
      }
      showToast("success", logoutResponse.message);
      dispatch(logout());
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error.message);
    }
  };
  return (
    <DropdownMenuItem className="cursor-pointer" onClick={LogoutHandler}>
      <RiLogoutCircleLine className="text-red-500" />
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;

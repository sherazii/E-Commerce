import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/assets/images/logo-black.svg";
import {
  WEBSITE_HOME,
  WEBSITE_LOGIN,
  WEBSITE_REGISTER,
} from "@/routes/WebsiteRoute";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdCall } from "react-icons/io";
import { MdOutlineMail } from "react-icons/md";
import { FiYoutube } from "react-icons/fi";
import { FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { CiFacebook, CiGlobe } from "react-icons/ci";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-10 py-10 lg:px-24 px-4">
        <div className="">
          <Link href={WEBSITE_HOME}>
            <Image
              src={logo}
              width={683}
              height={246}
              alt="logo"
              className="lg:w-42 w-full "
            />
            <p className="text-gray-500 text-sm text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente
              rerum quis modi vel cumque fuga incidunt at recusandae error amet,
              aspernatur libero. Sint itaque suscipit quae ipsum. Voluptate,
              magni debitis!
            </p>
          </Link>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Categories</h4>
          <ul className="flex flex-col ">
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                T-Shirt
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                Hoodies
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                Oversized
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                Full sleeves
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                Polo
              </Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Usefull Links</h4>
          <ul className="flex flex-col ">
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_HOME}>
                Home
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                About
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={""}>
                Shop
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_REGISTER}>
                Register
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_LOGIN}>
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Help Center</h4>
          <ul className="flex flex-col ">
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_REGISTER}>
                Register
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_LOGIN}>
                Login
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_HOME}>
                My Account
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_HOME}>
                Privacy Policy
              </Link>
            </li>
            <li className="text-gray-600 hover:text-primary hover:font-semibold">
              <Link className="block py-1" href={WEBSITE_HOME}>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h4 className="text-xl font-bold uppercase mb-5">Contact Us</h4>
          <ul className="flex flex-col gap-2">
            <li className="text-gray-500  flex gap-2 items-start ">
              <FaLocationDot size={20} className="h-6" />
              <span className="">E-Store market Gujranwala, Pakistan 22215</span>
            </li>
            <li className="text-gray-500  flex gap-2 items-start ">
              <IoMdCall size={20} className="h-6" />
              <span className="">+92 305 522 88089</span>
            </li>
            <li className="text-gray-500  flex gap-2 items-start ">
              <MdOutlineMail size={20} className="h-6" />
              <span className="">sherazhashmi111@gmail.com</span>
            </li>
            <li className="text-gray-500  flex items-center justify-evenly mt-3 ">
              <FiYoutube
                size={25}
                className="text-foreground hover:text-primary cursor-pointer"
              />
              <FaInstagram
                size={25}
                className="text-foreground hover:text-primary cursor-pointer"
              />
              <CiFacebook
                size={25}
                className="text-foreground hover:text-primary cursor-pointer"
              />
              <FaTwitter
                size={25}
                className="text-foreground hover:text-primary cursor-pointer"
              />
              <FaWhatsapp
                size={25}
                className="text-foreground hover:text-primary cursor-pointer"
              />
              <Link
                className="block py-1"
                href={"https://www.hashmitech.site/"}
                target="blank"
              >
                <CiGlobe
                  size={25}
                  className="text-foreground hover:text-primary cursor-pointer"
                />
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full text-center py-5 bg-gray-200">
        © {new Date().getFullYear()} All Rights Reserved. Developed by Sheraz Hashmi.
      </div>
    </footer>
  );
};

export default Footer;

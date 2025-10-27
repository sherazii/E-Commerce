"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import slider1 from "@/public/assets/images/slider-1.png";
import slider2 from "@/public/assets/images/slider-2.png";
import slider3 from "@/public/assets/images/slider-3.png";
import slider4 from "@/public/assets/images/slider-4.png";
import Image from "next/image";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
const MainSlider = () => {
  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2  bg-white right-10 cursor-pointer"
        onClick={onClick}
      >
        <GrNext />
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2  bg-white left-10 cursor-pointer"
        onClick={onClick}
      >
        <GrPrevious />
      </button>
    );
  }
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: false,
        },
      },
    ],
  };
  return (
    <Slider {...settings} className="">
      <div>
        <Image
          src={slider1}
          width={"full"}
          alt="slider-image"
          className="h-auto w-full"
        />
      </div>
      <div>
        <Image
          src={slider2}
          width={"full"}
          alt="slider-image"
          className="h-auto w-full"
        />
      </div>
      <div>
        <Image
          src={slider3}
          width={"full"}
          alt="slider-image"
          className="h-auto w-full"
        />
      </div>
      <div>
        <Image
          src={slider4}
          width={"full"}
          alt="slider-image"
          className="h-auto w-full"
        />
      </div>
    </Slider>
  );
};

export default MainSlider;

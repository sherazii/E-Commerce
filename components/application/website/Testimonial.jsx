"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { RiChatQuoteLine } from "react-icons/ri";

export const testimonials = [
  {
    name: "Ayesha Khan",
    review: `This product exceeded all my expectations.  
The quality is outstanding and it feels premium in every way.  
Highly recommended for anyone looking for true value.`,
    rating: 5,
  },
  {
    name: "Muhammad Bilal",
    review: `I was hesitant at first, but after using it for a few weeks, I’m genuinely impressed.  
Customer support was quick to respond and solved my issue in no time.  
Definitely worth every penny.`,
    rating: 4,
  },
  {
    name: "Sara Ahmed",
    review: `Beautifully designed and easy to use.  
The attention to detail really shows in how it performs.  
I’ve already recommended it to several friends.`,
    rating: 5,
  },
  {
    name: "Ali Raza",
    review: `Great experience from start to finish.  
The website was easy to navigate, and delivery was on time.  
Product quality matches the description perfectly.`,
    rating: 4,
  },
  {
    name: "Fatima Noor",
    review: `I rarely leave reviews, but this one deserves it.  
The packaging, the build quality, and the customer service were all top-notch.  
I’ll definitely buy again!`,
    rating: 5,
  },
  {
    name: "Zain Malik",
    review: `A solid product with reliable performance.  
Setup was simple and straightforward.  
Only wish it came in more color options.`,
    rating: 4,
  },
  {
    name: "Hira Siddiqui",
    review: `Absolutely love how efficient it is.  
The results have been consistent every single time.  
It’s a must-have for anyone serious about quality.`,
    rating: 5,
  },
  {
    name: "Usman Tariq",
    review: `Good value for money overall.  
Had a small issue initially, but support handled it professionally.  
Would still recommend it without hesitation.`,
    rating: 4,
  },
  {
    name: "Noor Fatima",
    review: `From the first use, I could tell this was built with care.  
It feels durable, performs well, and looks amazing on my desk.  
Very happy with the purchase.`,
    rating: 5,
  },
  {
    name: "Hamza Yousaf",
    review: `A dependable product that does what it promises.  
The documentation and instructions were clear.  
Would love to see more updates in the future.`,
    rating: 4,
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 640, // mobile
        settings: {
          slidesToShow: 1,
          arrows: false,
          dots: false,
        },
      },
      {
        breakpoint: 768, // sm
        settings: {
          slidesToShow: 2,
          arrows: false,
          dots: true,
        },
      },
      {
        breakpoint: 1024, // md
        settings: {
          slidesToShow: 3,
          arrows: true,
          dots: true,
        },
      },
      {
        breakpoint: 1280, // lg
        settings: {
          slidesToShow: 4,
          arrows: true,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="px-4 md:px-10 my-10">
      <Slider {...settings}>
        {testimonials.map((item, idx) => (
          <div key={idx} className="p-4">
            <div className="border rounded-xl p-6 shadow-md bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col justify-between">
              <RiChatQuoteLine className="text-gray-400 mb-3" size={30} />
              <p className="text-gray-700 text-sm md:text-base flex-1 mb-4 whitespace-pre-line">
                {item.review}
              </p>
              <h4 className="font-semibold text-gray-900">{item.name}</h4>
              <div className="flex mt-2">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <IoStar key={i} className="text-yellow-400" size={18} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Testimonial;

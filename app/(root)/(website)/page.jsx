import MainSlider from "@/components/application/website/MainSlider";
import Banner from "@/components/application/website/Banner";
import FeaturedProduct from "@/components/application/website/FeaturedProduct";
import Image from "next/image";
import advertisingBanner from "@/public/assets/images/advertising-banner.png";

const Home = () => {
  return (
    <div>
      <section>
        <MainSlider />
      </section>
      <section className="lg:px-32 px-4 sm:pt20 pt-5 pb-10">
        <Banner />
      </section>
      <section className="lg:px-32 px-4 sm:pt20 pt-5 pb-10">
        <FeaturedProduct />
      </section>
      <section className="sm:pt20 pt-5 pb-10">
        <Image
          src={advertisingBanner.src}
          height={advertisingBanner.height}
          width={advertisingBanner.width}
          alt="advertisingBanner"
          className="h-full w-full object-cover"
        />
      </section>
    </div>
  );
};

export default Home;

import MainSlider from "@/components/application/website/MainSlider";
import Banner from "@/components/application/website/Banner";
import FeaturedProduct from "@/components/application/website/FeaturedProduct";

const Home = () => {
  return (
    <div>
      <section>
        <MainSlider />
      </section>
      <section className="lg:px-32 px-4 sm:pt20 pt-5 pb-10">
        <Banner/>
      </section>
      <section className="lg:px-32 px-4 sm:pt20 pt-5 pb-10">
        <FeaturedProduct/>
      </section>
    </div>
  );
};

export default Home;

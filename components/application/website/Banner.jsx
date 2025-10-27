import Image from "next/image";
import Link from "next/link";
import banner1 from "@/public/assets/images/banner1.png";
import banner2 from "@/public/assets/images/banner2.png";

const Banner = () => {
  return (
    <div className="grid grid-cols-2 sm:gap-10 gap-2">
          <div className="border rounded-lg overflow-hidden">
            <Link href={""}>
              <Image
                src={banner1.src}
                width={banner1.width}
                height={banner1.height}
                alt="banner 1"
                className="transition-all transform hover:scale-110 duration-500"
              />
            </Link>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Link href={""}>
              <Image
                src={banner2.src}
                width={banner2.width}
                height={banner2.height}
                alt="banner 2"
                className="transition-all transform hover:scale-110 duration-500"
              />
            </Link>
          </div>
        </div>
  )
}

export default Banner
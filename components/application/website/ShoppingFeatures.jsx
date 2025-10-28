import { GiReturnArrow } from "react-icons/gi";
import { FaShippingFast } from "react-icons/fa";
import { FaHeadphonesAlt } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";

const ShoppingFeatures = () => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-10">
        <div className="text-center p-2 ">
            <p className="flex justify-center items-center mb-3"><GiReturnArrow size={30}/></p>
            <h3 className="text-2xl font-semibold">7 Days Return</h3>
            <p className="">Risk free shopping with easy return.</p>
        </div>
        <div className="text-center p-2 ">
            <p className="flex justify-center items-center mb-3"><FaShippingFast size={30}/></p>
            <h3 className="text-2xl font-semibold">Free Shipping</h3>
            <p className="">No extra cost just price you see.</p>
        </div>
        <div className="text-center p-2 ">
            <p className="flex justify-center items-center mb-3"><FaHeadphonesAlt size={30}/></p>
            <h3 className="text-2xl font-semibold">24/7 Support</h3>
            <p className="">24/7 Support Always here just for you.</p>
        </div>
        <div className="text-center p-2 ">
            <p className="flex justify-center items-center mb-3"><RiDiscountPercentFill size={30}/></p>
            <h3 className="text-2xl font-semibold">Member Discount</h3>
            <p className="">Special offers for our loyal customers.</p>
        </div>
    </div>
  )
}

export default ShoppingFeatures
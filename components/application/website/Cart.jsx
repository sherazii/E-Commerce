import { GiShoppingCart } from "react-icons/gi";

const Cart = () => {
  return (
    <button type="button">
      <GiShoppingCart
        className="text-gray-500 hover:text-primary cursor-pointer"
        size={25}
      />
    </button>
  );
};

export default Cart;

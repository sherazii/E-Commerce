import { Bounce, toast } from "react-toastify";

/**
 * Display a toast notification
 * @param {"info" | "success" | "warning" | "error" | "default"} type - Type of toast
 * @param {string} message - Message to display in the toast
 */
export const showToast = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true, // Better UX — allows user to dismiss manually
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  };

  switch (type) {
    case "info":
      toast.info(message, options);
      break;
    case "success":
      toast.success(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
      break;
  }
};

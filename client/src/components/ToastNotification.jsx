import { createPortal } from "react-dom";

const Toast = ({ show, type = "success", message }) => {
  if (!show || !message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-gray-600";

  const toastContent = (
    <div
      className={`fixed top-35 right-5 z-[10000] transform transition-all duration-500 ${
        show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`px-5 py-3 rounded-md shadow-lg text-white font-medium ${bgColor}`}
      >
        {message}
      </div>
    </div>
  );

  return createPortal(toastContent, document.body);
};

export default Toast;

import React from "react";

const CustomButton = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "primary",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-green-500 text-white hover:bg-green-600";
      case "secondary":
        return "bg-gray-500 text-white hover:bg-gray-600";
      case "danger":
        return "bg-orange-500 text-white hover:bg-orange-600";
      default:
        return "bg-green-500 text-white hover:bg-green-600";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-md
        font-medium text-sm
        transition-all duration-300 ease-in-out
        shadow-md hover:shadow-lg
        transform hover:-translate-y-0.5
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
        ${getVariantClasses()}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CustomButton;

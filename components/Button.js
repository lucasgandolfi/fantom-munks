import React from "react";
import Link from "next/link";

const Button = ({ path, onClick, children }) => {
  if (path) {
    return (
      <Link href={path}>
        <a className="cursor-pointer bg-white text-purple-600 p-3 rounded-2xl">
          {children}
        </a>
      </Link>
    );
  }
  return (
    <button
      className="cursor-pointer bg-white text-purple-600 p-3 rounded-2xl"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;

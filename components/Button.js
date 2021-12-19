import React from "react";
import Link from "next/link";

const buttonTw =
  "cursor-pointer bg-white text-purple-600 p-3 rounded-2xl mt-2 w-full text-center md:w-auto";

const Button = ({ path, onClick, children }) => {
  if (path) {
    return (
      <Link href={path}>
        <a className={buttonTw}>{children}</a>
      </Link>
    );
  }
  return (
    <button className={buttonTw} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

import React from "react";
import { Link } from "react-router-dom";
import logoSvg from "../assets/bitcoin.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="
        absolute top-4 left-4
        text-decoration-none
        text-lg text-cyan-500
        flex items-center
        space-x-2
      "
    >
      <img
        src={logoSvg}
        alt="Crypbucket"
        className="w-8 h-8" // Adjust the size as needed
      />
      <span className="font-semibold">Crypbucket</span>
    </Link>
  );
};

export default Logo;

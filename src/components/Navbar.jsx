import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const scrollToAbout = () => {
    const section = document.getElementById("about");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 py-3 md:py-4 text-white backdrop-blur-md border-b border-white/10"
      style={{
        background: `
          radial-gradient(circle at 20% 60%, rgba(37,99,235,.18), transparent 35%),
          radial-gradient(circle at 80% 50%, rgba(16,185,129,.15), transparent 35%),
          radial-gradient(circle at 50% 30%, rgba(99,102,241,.10), transparent 25%),
          linear-gradient(180deg, rgba(2,6,23,.95), rgba(3,11,44,.95))
        `,
      }}
    >
      {/* Logo */}
      <div>
        <img
          src={logo}
          alt="Logo"
          className="h-8 md:h-10 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      {/* Menu */}
      <div className="hidden md:flex items-center gap-3 md:gap-6 text-sm md:text-base">
        <button
          onClick={scrollToTop}
          className="hover:text-blue-400 transition cursor-pointer"
        >
          Home
        </button>

        <button
          onClick={scrollToAbout}
          className="hover:text-blue-400 transition cursor-pointer"
        >
          About Us
        </button>
      </div>

      {/* Admin */}
      <button
        onClick={() => navigate("/admin/auth/login")}
        className="bg-white text-black px-3 md:px-5 py-2 rounded-lg font-medium text-sm md:text-base hover:bg-gray-200 transition cursor-pointer"
      >
        Admin
      </button>
    </nav>
  );
}

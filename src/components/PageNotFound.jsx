import React from "react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">
      <div className="text-center">

        <p className="text-red-400 text-sm font-medium tracking-widest uppercase">
          Error
        </p>

        <h1 className="mt-2 text-8xl font-extrabold text-white">
          404
        </h1>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-400">
          The page you are looking for does not exist.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500 transition"
        >
          Back To Home
        </button>

      </div>
    </div>
  );
}
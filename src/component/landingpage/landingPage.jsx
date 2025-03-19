import React, { useState } from "react";
import MedicineSearch from "../medicineSearch";// Import MedicineSearch

export default function LandingPage() {
  const [showSearch, setShowSearch] = useState(false);

  return showSearch ? (
    <MedicineSearch />
  ) : (
    <div
      className="h-screen flex flex-col justify-center items-start bg-cover bg-center relative px-12"
      style={{ backgroundImage: "url('/images/young-woman-pharmacist-pharmacy.jpg')" }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content Section */}
      <div className="relative z-10 text-left max-w-lg">
        <h1 className="text-white text-5xl font-bold drop-shadow-lg mb-6">
          Welcome to MediLow
        </h1>
        <p className="text-white text-lg mb-6">
          Your trusted companion for finding medicines.
        </p>
        <button
          onClick={() => setShowSearch(true)} // Switch to MedicineSearch
          className="px-6 py-3 bg-teal-600 text-white text-lg rounded-lg shadow-md hover:bg-teal-700 transition-all"
        >
          Enter MediLow
        </button>
      </div>
    </div>
  );
}

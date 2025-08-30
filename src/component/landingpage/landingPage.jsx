import React, { useState } from "react";
import MedicineSearch from "../medicineSearch";
import SymptomSearch from "../symptomSearch";

export default function LandingPage() {
  const [searchType, setSearchType] = useState(null); // null, "medicine", "symptom"

  if (searchType === "medicine") return <MedicineSearch />;
  if (searchType === "symptom") return <SymptomSearch />;

  return (
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
          Your trusted companion for finding medicines or treatments for symptoms.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setSearchType("medicine")}
            className="px-6 py-3 bg-teal-600 text-white text-lg rounded-lg shadow-md hover:bg-teal-700 transition-all"
          >
            Search by Medicine
          </button>
          <button
            onClick={() => setSearchType("symptom")}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-700 transition-all"
          >
            Search by Symptom
          </button>
        </div>
      </div>
    </div>
  );
}

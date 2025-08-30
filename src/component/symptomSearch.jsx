import React, { useState } from "react";
import { searchSymptom } from "../api/symptom";
import Footer from "./footer"; // import the Footer component

const SymptomSearch = () => {
  const [query, setQuery] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    setError("");
    setAlternatives([]);

    try {
      const response = await searchSymptom(query);
      if (response.alternatives && response.alternatives.length > 0) {
        setAlternatives(response.alternatives);
      } else {
        setError("No treatments found.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error or no results found.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MediLow - Symptom Search</h1>
      </nav>

      <div
        className="relative w-full h-[50vh] bg-cover bg-center flex justify-center items-center px-6"
        style={{ backgroundImage: "url('images/main-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-semibold text-white drop-shadow-lg">
            Find Medicines for Your Symptoms
          </h2>
          <input
            type="text"
            placeholder="Enter symptom..."
            className="mt-4 w-full max-w-md p-3 rounded-lg focus:ring focus:ring-teal-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="mt-2 w-full max-w-md bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
          >
            Search
          </button>
        </div>
      </div>

      <div className="mt-10 px-6 flex flex-wrap justify-center gap-6 flex-grow">
        {error && <p className="text-red-600 w-full text-center">{error}</p>}

        {alternatives.length === 0 ? (
          <p className="text-center w-full text-gray-700">
            No medicines found for this symptom.
          </p>
        ) : (
          alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="max-w-sm w-full bg-white shadow-lg rounded-xl overflow-hidden transform transition hover:scale-105"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{alt.Medicine}</h3>
                <p className="mt-2 text-gray-600">
                  Manufacturer: <span className="font-medium">{alt.manufacturer}</span>
                </p>
                <p className="mt-2 text-gray-600">
                  Composition:{" "}
                  <span className="font-medium">
                    {alt.short_composition1} {alt.short_composition2}
                  </span>
                </p>
                <p className="mt-2 text-gray-600">Price: ₹{alt.price}</p>
                <p className="mt-2 text-gray-600">Type: {alt.type}</p>
                <p className="mt-2 text-gray-600">Pack Size: {alt.pack_size}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                <button className="text-sm text-blue-600 font-semibold hover:text-blue-800">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default SymptomSearch;

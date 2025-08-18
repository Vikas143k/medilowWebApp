import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchMedicine } from "../api/medicineApi";
import Footer from "./footer";

const MedicineSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceTimeout = useRef(null);

  // Load state from URL on component mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    const urlResults = searchParams.get('results');
    
    if (urlQuery) {
      setQuery(urlQuery);
      
      // If we have cached results in URL, parse and use them
      if (urlResults) {
        try {
          const parsedResults = JSON.parse(decodeURIComponent(urlResults));
          setAlternatives(parsedResults);
        } catch (e) {
          // If parsing fails, perform a fresh search
          performSearch(urlQuery);
        }
      } else {
        // No cached results, perform search
        performSearch(urlQuery);
      }
    }
  }, [searchParams]);

  // Separate function for performing search (used by both handleSearch and URL loading)
  const performSearch = async (searchQuery) => {
    const queryToSearch = searchQuery || query;
    if (!queryToSearch.trim()) {
      setError("Please enter a medicine name.");
      setAlternatives([]);
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const data = await searchMedicine(queryToSearch);
      if (data.error) {
        setError(data.error);
        setAlternatives([]);
        // Update URL with query only (no results)
        setSearchParams({ q: queryToSearch });
      } else {
        const results = data.alternatives || [];
        setAlternatives(results);
        // Update URL with both query and results
        setSearchParams({ 
          q: queryToSearch,
          results: encodeURIComponent(JSON.stringify(results))
        });
      }
    } catch (err) {
      setError("Failed to fetch medicine alternatives");
      setAlternatives([]);
      // Update URL with query only (no results)
      setSearchParams({ q: queryToSearch });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await performSearch(query);
  };

  // Debounced input handler
  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setError("");
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    
    // Clear results if query is empty
    if (!newQuery.trim()) {
      setAlternatives([]);
      setSearchParams({});
      return;
    }
    
    debounceTimeout.current = setTimeout(() => {
      if (newQuery.trim()) {
        performSearch(newQuery);
      }
    }, 500);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      handleSearch();
    }
  };

  const handleViewDetails = (medicine) => {
    // Create a unique ID for the medicine using name, manufacturer, and price
    const medicineId = encodeURIComponent(`${medicine.name}|${medicine.manufacturer_name}|${medicine.price}`);
    navigate(`/medicine/${medicineId}`);
  };



  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MediLow</h1>
      </nav>

      {/* Search Section with Background */}
      <div
        className="relative w-full h-[50vh] bg-cover bg-center flex justify-center items-center px-6"
        style={{
          backgroundImage: "url('/images/main-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Black Contrast Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Centered Content */}
        <div className="relative z-10 text-center w-full">
          <h2 className="text-5xl font-semibold text-white drop-shadow-lg">
            Find Your Medicines
          </h2>
          <p className="mt-3 text-lg text-white drop-shadow">
            Search for medicines by name
          </p>
          <div className="mt-6 w-full max-w-md mx-auto flex flex-col gap-2">
            <input
              type="text"
              placeholder="Search medicine..."
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-teal-300"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            <button
              onClick={handleSearch}
              className="w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <svg className="inline w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Searching...
                </span>
              ) : "Search"}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>

      {/* Alternatives Section */}
      <div className="mt-10 px-6 flex-1 flex flex-col">
        <div className="flex flex-wrap justify-center gap-6">
          {loading ? (
            <div className="w-full text-center text-gray-500">Loading alternatives...</div>
          ) : alternatives.length > 0 ? (
            alternatives.map((alt, index) => (
              <div
                key={index}
                className="max-w-sm w-full bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{alt.name}</h3>
                  <p className="mt-2 text-gray-600">
                    Manufacturer: <span className="font-medium">{alt.manufacturer_name}</span>
                  </p>
                  <p className="mt-2 text-gray-600">
                    Composition: <span className="font-medium">{alt.full_composition}</span>
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-600">₹{alt.price}</span>
                  <button
                    className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    onClick={() => handleViewDetails(alt)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">No alternatives found.</p>
          )}
        </div>
      </div>



      <Footer />
    </div>
  );
};

export default MedicineSearch;


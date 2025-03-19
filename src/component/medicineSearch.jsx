// import React, { useState } from "react";
// import axios from "axios";

// const MedicineSearch = () => {
//   const [query, setQuery] = useState("");
//   const [alternatives, setAlternatives] = useState([]);

//   const handleSearch = async () => {
//     if (!query) return;
//     try {
//       const response = await axios.get(
//         `http://127.0.0.1:5000/search?name=${query}`
//       );
//       setAlternatives(response.data.alternatives || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">MediLow</h1>
//         {/* <div className="p-2 bg-white text-blue-600 rounded-full cursor-pointer">
//           <i className="fas fa-user"></i>
//         </div> */}
//       </nav>

//       {/* Search Section */}
//       <div className="relative w-full h-96 bg-cover bg-center flex flex-col justify-center items-center px-4"
//       style={{ backgroundImage: "url('/images/main-bg.jpg')" }}
//       >
//       <h2 className="text-5xl font-semibold text-white drop-shadow-lg">Find Your Medicines</h2>
//       <p className="mt-3 text-lg text-white drop-shadow">Search for medicines by name</p>
//         <div className="mt-4 w-full max-w-lg">
//           <input
//             type="text"
//             placeholder="Search medicine..."
//             className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//           />
//           <button
//             onClick={handleSearch}
//             className="mt-2 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
//           >
//             Search
//           </button>
//         </div>
//       </div>
//       {/* Alternatives Section */}
//       <div className="mt-10 px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {alternatives.map((alt, index) => (
//           <div
//             key={index}
//             className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
//           >
//             <h3 className="text-lg font-semibold text-blue-700">{alt.name}</h3>
//             <p className="text-gray-600">Manufacturer: {alt.manufacturer_name}</p>
//             <p className="text-gray-800 font-bold">Price: ₹{alt.price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MedicineSearch;















// import React, { useState } from "react";
// import axios from "axios";

// const MedicineSearch = () => {
//   const [query, setQuery] = useState("");
//   const [alternatives, setAlternatives] = useState([]);

//   const handleSearch = async () => {
//     if (!query) return;
//     try {
//            const response = await axios.get(
//              `http://127.0.0.1:5000/search?name=${query}`
//            );
//       setAlternatives(response.data.alternatives || []);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Navbar */}
//       <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
//         <h1 className="text-xl font-bold">MediLow</h1>
//       </nav>

//       {/* Search Section with Background */}
//       <div
//         className="relative w-full h-screen bg-cover bg-center flex flex-col justify-center items-start px-10"
//         style={{
//           backgroundImage: "url('/public/images/main-bg.jpg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {/* Black Contrast Overlay */}
//         <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//         {/* Content */}
//         <div className="relative z-10 text-left max-w-lg">
//           <h2 className="text-5xl font-semibold text-white drop-shadow-lg">
//             Find Your Medicines
//           </h2>
//           <p className="mt-3 text-lg text-white drop-shadow">
//             Search for medicines by name
//           </p>
//           <div className="mt-6 w-full max-w-lg">
//             <input
//               type="text"
//               placeholder="Search medicine..."
//               className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-teal-300"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//             />
//             <button
//               onClick={handleSearch}
//               className="mt-2 w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
//             >
//               Search
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Alternatives Section */}
//       <div className="mt-10 px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
//         {alternatives.map((alt, index) => (
//           <div
//             key={index}
//             className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
//           >
//             <h3 className="text-lg font-semibold text-teal-700">{alt.name}</h3>
//             <p className="text-gray-600">
//               Manufacturer: {alt.manufacturer_name}
//             </p>
//             <p className="text-gray-800 font-bold">Price: ₹{alt.price}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MedicineSearch;


import React, { useState } from "react";
import axios from "axios";
import Footer from "./footer";

const MedicineSearch = () => {
  const [query, setQuery] = useState("");
  const [alternatives, setAlternatives] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/search?name=${query}`
      );
      setAlternatives(response.data.alternatives || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MediLow</h1>
      </nav>

      {/* Search Section with Background */}
      <div
        className="relative w-full h-[50vh] bg-cover bg-center flex justify-center items-center px-6"
        style={{
          backgroundImage: "url('images/main-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Black Contrast Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Centered Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-5xl font-semibold text-white drop-shadow-lg">
            Find Your Medicines
          </h2>
          <p className="mt-3 text-lg text-white drop-shadow">
            Search for medicines by name
          </p>
          <div className="mt-6 w-full max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search medicine..."
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-teal-300"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="mt-2 w-full bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Alternatives Section */}
      {/* <div className="mt-10 px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {alternatives.map((alt, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-teal-700">{alt.name}</h3>
            <p className="text-gray-600">
              Manufacturer: {alt.manufacturer_name}<br/>
              Composition: {alt.full_composition}
            </p>
            <p className="text-gray-800 font-bold">Price: ₹{alt.price}</p>
          </div>
        ))}
      </div> */}
      {/* Alternatives Section */}
<div className="mt-10 px-6 flex flex-wrap justify-center gap-6">
  {alternatives.length > 0 ? (
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
          <button className="text-sm text-blue-600 font-semibold hover:text-blue-800">
            View Details
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 w-full">No alternatives found.</p>
  )}
</div>
  <Footer/>
    </div>
  );
};

export default MedicineSearch;
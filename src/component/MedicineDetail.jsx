import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Pill, DollarSign, Building2, AlertCircle } from "lucide-react";
import { getMedicineDetails } from "../api/medicineApi";
import Footer from "./footer";

const MedicineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicineDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getMedicineDetails(id);
        if (data.error) {
          setError(data.error);
        } else {
          setMedicine(data);
        }
      } catch (err) {
        setError("Failed to fetch medicine details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicineDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Medicine Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested medicine details could not be found."}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-teal-600 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Search
          </button>
          <h1 className="text-3xl font-bold">{medicine.name}</h1>
          <p className="text-teal-100 mt-2">Complete medicine information</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 flex-1 w-full">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <nav className="space-y-2">
                  <a href="#overview" className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group">
                    <span className="font-medium">Overview</span>
                    <span className="text-gray-400 group-hover:text-gray-600">›</span>
                  </a>
                  <a href="#uses" className="block p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors">
                    Uses and benefits
                  </a>
                  <a href="#side-effects" className="block p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors">
                    Side effects
                  </a>
                  <a href="#how-to-use" className="block p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors">
                    How to use
                  </a>
                  <a href="#how-it-works" className="block p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors">
                    How it works
                  </a>
                  <a href="#safety" className="block p-3 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-lg transition-colors">
                    Safety advice
                  </a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
        {/* Product Introduction */}
        <div id="overview" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          {medicine.product_introduction && (
            <div className="mb-8">
              <div className="text-gray-800 leading-relaxed space-y-3">
                {medicine.product_introduction.split('\n').map((line, index) => (
                  <p key={index} className="text-gray-700 text-sm leading-6">{line}</p>
                ))}
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Overview
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
              <div>
                  <p className="text-sm text-blue-700 font-medium uppercase tracking-wide">Manufacturer</p>
                  <p className="font-bold text-gray-800 text-lg leading-tight">{medicine.manufacturer_name}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              <div>
                  <p className="text-sm text-green-700 font-medium uppercase tracking-wide">Price</p>
                  <p className="font-bold text-gray-800 text-2xl">₹{medicine.price}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Pill className="h-6 w-6 text-white" />
                </div>
              <div>
                  <p className="text-sm text-purple-700 font-medium uppercase tracking-wide">Composition</p>
                  <p className="font-bold text-gray-800 text-sm leading-relaxed">{medicine.full_composition}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Uses and Benefits */}
        <div id="uses" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Uses of {medicine.name}
          </h2>
          <div className="prose max-w-none">
            {medicine.uses ? (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <div className="text-gray-800 leading-relaxed space-y-2">
                {medicine.uses.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700 text-sm leading-6">{line}</p>
                ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">Information not available</p>
              </div>
            )}
          </div>
        </div>

        {/* How it Works */}
        <div id="how-it-works" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            How {medicine.name} works
          </h2>
                    <div className="text-gray-700 leading-relaxed">
            {medicine.mechanism ? (
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <div className="text-gray-800 leading-relaxed space-y-2">
                  {medicine.mechanism.split('\n').map((line, index) => (
                    <p key={index} className="text-gray-700 text-sm leading-6">{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">Information not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Side Effects */}
        <div id="side-effects" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Side effects of {medicine.name}
          </h2>
                    <p className="text-gray-600 text-sm mb-4">Most side effects do not require any medical attention and disappear as your body adjusts to the medicine. Consult your doctor if they persist or if you're worried about them</p>
          <h3 className="text-base font-semibold text-gray-800 mb-3">Common side effects of {medicine.name}</h3>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
            {medicine.side_effects ? (
              <div className="grid md:grid-cols-2 gap-2">
                {medicine.side_effects.split(',').slice(0, 8).map((effect, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-md shadow-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{effect.trim()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-sm">Information not available</p>
              </div>
            )}
            {medicine.side_effects && medicine.side_effects.split(',').length > 8 && (
              <div className="mt-3 text-center">
                <p className="text-orange-700 text-xs">
                  Showing most common side effects. Consult your healthcare provider for complete information.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div id="how-to-use" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            How to use {medicine.name}
          </h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              {medicine.expert_advice ? (
              <div className="space-y-3">
                {medicine.expert_advice.split(/\d+\./).filter(item => item.trim()).map((advice, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 text-sm leading-6">{advice.trim()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">Information not available</p>
              </div>
            )}
          </div>
        </div>

        {/* Safety Advice */}
        <div id="safety" className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Safety advice
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-sm">⚠</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Alcohol</h3>
                <p className="text-sm text-gray-600">Consult your doctor before consuming alcohol with {medicine.name}.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 font-bold text-sm">⚠</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Pregnancy</h3>
                <p className="text-sm text-gray-600">Consult your doctor before using {medicine.name} during pregnancy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-yellow-600 font-bold text-sm">⚠</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Driving</h3>
                <p className="text-sm text-gray-600">Be cautious while driving if {medicine.name} causes dizziness or drowsiness.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold text-sm">⚠</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Kidney</h3>
                <p className="text-sm text-gray-600">Use {medicine.name} with caution if you have kidney problems. Consult your doctor.</p>
              </div>
            </div>
          </div>
        </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MedicineDetail;


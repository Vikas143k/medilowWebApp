"""
Medicine Description Service with Gemini AI Integration
Fetches detailed medicine information using Gemini AI as primary source with external API fallbacks.
"""
import json
import os
import requests
import logging
import re
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# Import Gemini service
try:
    from .gemini_service import GeminiMedicineService
    GEMINI_AVAILABLE = True
except ImportError as e:
    print(f"Gemini service not available: {e}")
    GEMINI_AVAILABLE = False


class MedicineDescriptionService:
    """Service for fetching medicine descriptions with Gemini AI as primary source"""

    def __init__(self):
        self.timeout = 10
        # Simple JSON file cache
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        data_dir = os.path.join(base_dir, "data")
        os.makedirs(data_dir, exist_ok=True)
        self.cache_file = os.path.join(data_dir, "description_cache.json")
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._load_cache()
        
        # Initialize Gemini service
        self.gemini_service = None
        if GEMINI_AVAILABLE:
            try:
                self.gemini_service = GeminiMedicineService()
            except Exception as e:
                print(f"Failed to initialize Gemini service: {e}")

    def _load_cache(self) -> None:
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, "r", encoding="utf-8") as f:
                    self._cache = json.load(f)
        except Exception as exc:
            logger.warning(f"Failed to load description cache: {exc}")
            self._cache = {}

    def _save_cache(self) -> None:
        try:
            with open(self.cache_file, "w", encoding="utf-8") as f:
                json.dump(self._cache, f, ensure_ascii=False, indent=2)
        except Exception as exc:
            logger.warning(f"Failed to save description cache: {exc}")

    def get_medicine_description(self, medicine_name: str, composition: str = "", fill_defaults: bool = True) -> Dict[str, Any]:
        """Get comprehensive medicine description with Gemini AI as primary source"""
        
        clean_name = self._clean_medicine_name(medicine_name).lower()

        # Check cache first
        if clean_name in self._cache:
            cached = dict(self._cache[clean_name])
            if fill_defaults:
                self._fill_defaults(cached, medicine_name)
            return cached

        # Try Gemini AI first (primary source)
        if self.gemini_service and self.gemini_service.available:
            print(f"🤖 Generating description for {medicine_name} using Gemini AI...")
            gemini_data = self.gemini_service.generate_medicine_description(medicine_name, composition)
            
            if gemini_data and any(gemini_data.values()):
                # Add source information
                gemini_data["source"] = "gemini_ai"
                gemini_data["composition"] = composition or "Not specified"
                
                # Cache the result
                self._cache[clean_name] = gemini_data
                self._save_cache()
                
                print(f"✅ Generated description for {medicine_name}")
                # Don't fill defaults if we have good Gemini data
                return gemini_data

        # Fallback: Return basic structure with defaults
        print(f"⚠️ Using fallback for {medicine_name}")
        fallback_data = {
            "uses": None,
            "mechanism": None,
            "side_effects": None,
            "expert_advice": None,
            "composition": composition or "Not specified",
            "source": "fallback"
        }
        
        if fill_defaults:
            self._fill_defaults(fallback_data, medicine_name)
        
        return fallback_data

    def _clean_medicine_name(self, medicine_name: str) -> str:
        """Clean medicine name for consistent caching"""
        # Remove dosage, dosage units and common forms
        clean_name = re.sub(r"\b\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml)\b", "", medicine_name, flags=re.IGNORECASE)
        # Remove standalone numeric strengths
        clean_name = re.sub(r"\b\d+(?:\.\d+)?\b", "", clean_name)
        clean_name = re.sub(r"\b(tablet|tab|capsule|cap|syrup|suspension|strip|bottle|injection|drops)\b", "", clean_name, flags=re.IGNORECASE)
        # Collapse extra spaces
        clean_name = re.sub(r"\s+", " ", clean_name)
        return clean_name.strip()

    def _fill_defaults(self, description_data: Dict[str, Any], medicine_name: str) -> None:
        """Fill in default values for missing information"""
        if not description_data.get("uses"):
            description_data["uses"] = (
                f"{medicine_name} is used as prescribed by healthcare professionals for treating specific medical conditions. "
                f"Consult your doctor or refer to the prescribing information for detailed usage information."
            )
        if not description_data.get("mechanism"):
            description_data["mechanism"] = (
                f"{medicine_name} works through specific mechanisms to treat the intended medical condition. "
                f"Discuss the exact mechanism with your healthcare provider."
            )
        if not description_data.get("side_effects"):
            description_data["side_effects"] = (
                "Consult healthcare provider or prescribing information for the complete side effect profile"
            )
        if not description_data.get("expert_advice"):
            description_data["expert_advice"] = (
                f"Take {medicine_name} exactly as prescribed. Do not exceed the recommended dose or duration. "
                f"Take with food if stomach upset occurs. Complete the full course unless told otherwise."
            )
        if not description_data.get("composition"):
            description_data["composition"] = (
                "Composition information not available - consult healthcare provider"
            )
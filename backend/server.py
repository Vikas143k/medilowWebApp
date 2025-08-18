# server.py
import os
import logging
import re
import urllib.parse
import requests
import json
from typing import Dict, Any, Optional
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from scripts.build_index import get_medicine_recommendations
from services.medicine_description_service import MedicineDescriptionService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("med-api")

# Load medicine data for detailed information
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(base_dir, "data", "medicine_data.csv")
    if not os.path.exists(csv_path):
        # Fallback to the known Windows development path
        csv_path = r"C:\Personal\medi-low\medi-low\backend\data\medicine_data.csv"
    medicine_df = pd.read_csv(csv_path)
except Exception as e:
    logger.warning(f"Could not load medicine data: {e}")
    medicine_df = None

app = FastAPI(title="Medilow Medicine API")
# Initialize services
description_service = MedicineDescriptionService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- OpenFDA API Integration ----------

def fetch_from_openfda(medicine_name: str) -> Optional[Dict[str, Any]]:
    """Fetch medicine data from OpenFDA API"""
    try:
        # Clean medicine name for API search
        clean_name = re.sub(r'\d+\s*mg|tablet|capsule|syrup', '', medicine_name, flags=re.IGNORECASE).strip()
        
        url = "https://api.fda.gov/drug/label.json"
        params = {
            'search': f'openfda.brand_name:"{clean_name}" OR openfda.generic_name:"{clean_name}"',
            'limit': 1
        }
        
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if 'results' in data and data['results']:
                return data['results'][0]
    except Exception as e:
        logger.warning(f"OpenFDA API error for {medicine_name}: {e}")
    return None

def get_composition_for_medicine(name: str) -> str:
    """Get composition from the CSV data and OpenFDA APIs"""
    # First try to get from local CSV data
    if medicine_df is not None:
        try:
            matches = medicine_df[medicine_df['name'].str.contains(name, case=False, na=False)]
            if not matches.empty:
                row = matches.iloc[0]
                # Try full_composition first, then combine short compositions
                if pd.notna(row.get('full_composition')):
                    return str(row['full_composition'])
                comp1 = str(row['short_composition1']) if pd.notna(row.get('short_composition1')) else ""
                comp2 = str(row['short_composition2']) if pd.notna(row.get('short_composition2')) else ""
                parts = [p.strip() for p in [comp1, comp2] if p and p.strip()]
                if parts:
                    return ', '.join(parts)
        except Exception as e:
            logger.warning(f"Error getting composition from CSV: {e}")
    
    # Try to get from OpenFDA API
    try:
        openfda_data = fetch_from_openfda(name)
        if openfda_data:
            # Try to get active ingredients
            if 'openfda' in openfda_data and 'substance_name' in openfda_data['openfda']:
                substances = openfda_data['openfda']['substance_name']
                if substances:
                    return ', '.join(substances[:3])  # Limit to first 3 ingredients
            
            # Try to get from active_ingredient field
            if 'active_ingredient' in openfda_data:
                ingredients = openfda_data['active_ingredient']
                if isinstance(ingredients, list) and ingredients:
                    return ', '.join(ingredients[:3])
                elif isinstance(ingredients, str):
                    return ingredients
    except Exception as e:
        logger.warning(f"Error getting composition from OpenFDA: {e}")
    
    return f"Composition information for {name} not available"

def get_uses_for_medicine(name: str) -> str:
    """Get medicine uses from OpenFDA API"""
    try:
        openfda_data = fetch_from_openfda(name)
        if openfda_data:
            # Try indications_and_usage first
            if 'indications_and_usage' in openfda_data:
                uses = openfda_data['indications_and_usage']
                if isinstance(uses, list) and uses:
                    return ' '.join(uses)
                elif isinstance(uses, str):
                    return uses
            
            # Try purpose field
            if 'purpose' in openfda_data:
                purpose = openfda_data['purpose']
                if isinstance(purpose, list) and purpose:
                    return ' '.join(purpose)
                elif isinstance(purpose, str):
                    return purpose
    except Exception as e:
        logger.warning(f"Error getting uses from OpenFDA: {e}")
    
    return f"Usage information for {name} - Please consult with a healthcare professional for proper usage guidelines."

def get_mechanism_for_medicine(name: str) -> str:
    """Get mechanism of action from OpenFDA API"""
    try:
        openfda_data = fetch_from_openfda(name)
        if openfda_data:
            if 'mechanism_of_action' in openfda_data:
                mechanism = openfda_data['mechanism_of_action']
                if isinstance(mechanism, list) and mechanism:
                    return ' '.join(mechanism)
                elif isinstance(mechanism, str):
                    return mechanism
            
            # Try clinical_pharmacology as alternative
            if 'clinical_pharmacology' in openfda_data:
                clinical = openfda_data['clinical_pharmacology']
                if isinstance(clinical, list) and clinical:
                    return ' '.join(clinical)
                elif isinstance(clinical, str):
                    return clinical
    except Exception as e:
        logger.warning(f"Error getting mechanism from OpenFDA: {e}")
    
    return f"Mechanism of action for {name} - This medication works through specific biochemical pathways. Consult healthcare provider for detailed information."

def get_side_effects_for_medicine(name: str) -> str:
    """Get side effects from OpenFDA API"""
    try:
        openfda_data = fetch_from_openfda(name)
        if openfda_data:
            if 'adverse_reactions' in openfda_data:
                adverse = openfda_data['adverse_reactions']
                if isinstance(adverse, list) and adverse:
                    return ' '.join(adverse)
                elif isinstance(adverse, str):
                    return adverse
            
            # Try warnings as alternative
            if 'warnings' in openfda_data:
                warnings = openfda_data['warnings']
                if isinstance(warnings, list) and warnings:
                    return ' '.join(warnings)
                elif isinstance(warnings, str):
                    return warnings
    except Exception as e:
        logger.warning(f"Error getting side effects from OpenFDA: {e}")
    
    return f"Side effects for {name} - As with all medications, this may cause side effects. Please consult your healthcare provider."

def get_expert_advice_for_medicine(name: str) -> str:
    """Get expert advice from OpenFDA API"""
    try:
        openfda_data = fetch_from_openfda(name)
        if openfda_data:
            # Try dosage_and_administration
            if 'dosage_and_administration' in openfda_data:
                dosage = openfda_data['dosage_and_administration']
                if isinstance(dosage, list) and dosage:
                    return ' '.join(dosage)
                elif isinstance(dosage, str):
                    return dosage
            
            # Try contraindications
            if 'contraindications' in openfda_data:
                contra = openfda_data['contraindications']
                if isinstance(contra, list) and contra:
                    return f"Contraindications: {' '.join(contra)}"
                elif isinstance(contra, str):
                    return f"Contraindications: {contra}"
    except Exception as e:
        logger.warning(f"Error getting expert advice from OpenFDA: {e}")
    
    return f"Expert advice for {name} - Always follow your healthcare provider's instructions. Take as prescribed and do not exceed recommended dosage."

def get_medicine_detailed_info(medicine_id: str):
    """
    Get detailed information about a medicine.
    medicine_id should be in format: name|manufacturer|price
    """
    try:
        logger.info(f"Processing medicine_id: {medicine_id}")
        
        # Decode the medicine_id with multiple attempts
        decoded_id = medicine_id
        try:
            decoded_id = urllib.parse.unquote(medicine_id)
            logger.info(f"First decode: {decoded_id}")
        except:
            pass
        
        # Try double decode in case of double encoding
        try:
            decoded_id = urllib.parse.unquote(decoded_id)
            logger.info(f"Second decode: {decoded_id}")
        except:
            pass
        
        parts = decoded_id.split('|')
        logger.info(f"Split parts: {parts}")
        
        if len(parts) != 3:
            logger.warning(f"Invalid parts count: {len(parts)}, expected 3")
            return None
            
        name, manufacturer, price = parts
        logger.info(f"Extracted - Name: {name}, Manufacturer: {manufacturer}, Price: {price}")
        
        # Get composition first to provide to Gemini
        composition = get_composition_for_medicine(name)
        
        # Use Gemini AI for comprehensive medicine description
        fetched = description_service.get_medicine_description(name, composition, fill_defaults=False)
        
        # Only add minimal fallbacks if Gemini completely failed
        if not fetched.get("uses") and not fetched.get("mechanism"):
            fetched["uses"] = f"Detailed information about {name} is being processed by our AI system. Please refresh the page in a moment for complete details."
            fetched["mechanism"] = f"Comprehensive information about how {name} works at the molecular level is being generated. Please refresh shortly."
            fetched["side_effects"] = "Complete side effect profile is being compiled. Please refresh for detailed information."
            fetched["expert_advice"] = f"Detailed clinical guidance for {name} is being prepared by our AI system. Please refresh the page for comprehensive usage instructions."
        
        # Ensure we have composition data
        if not fetched.get("composition"):
            fetched["composition"] = composition

        # Compose final payload
        medicine_details = {
            "id": medicine_id,
            "name": name,
            "manufacturer_name": manufacturer,
            "price": price,
            "full_composition": fetched.get("composition") or get_composition_for_medicine(name),
            "uses": fetched.get("uses"),
            "mechanism": fetched.get("mechanism"),
            "side_effects": fetched.get("side_effects"),
            "expert_advice": fetched.get("expert_advice"),
        }
        
        return medicine_details
    except Exception as e:
        logger.error(f"Error getting medicine details: {e}")
        return None

# ---------- Endpoints ----------
@app.get("/")
def home():
    return {"message": "Medicine Alternative API is running!"}

@app.get("/search")
async def search_medicine(name: str):
    if not name or not name.strip():
        raise HTTPException(status_code=400, detail="Provide a medicine name.")
    try:
        alternatives = get_medicine_recommendations(name)
        if isinstance(alternatives, str):
            raise HTTPException(status_code=404, detail=alternatives)
        return {"alternatives": alternatives}
    except Exception:
        logger.exception("Error in /search endpoint")
        raise HTTPException(status_code=500, detail="Internal server error. Please try again later.")

@app.get("/medicine/{medicine_id:path}")
async def get_medicine_details(medicine_id: str):
    try:
        logger.info(f"Received medicine_id: {medicine_id}")
        medicine_details = get_medicine_detailed_info(medicine_id)
        if not medicine_details:
            logger.warning(f"Medicine not found for ID: {medicine_id}")
            raise HTTPException(status_code=404, detail="Medicine not found")
        return medicine_details
    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error in /medicine/{medicine_id} endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error. Please try again later.")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
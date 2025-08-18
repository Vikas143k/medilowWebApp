"""
Simple test script to verify Gemini integration works
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from services.gemini_service import GeminiMedicineService
from services.medicine_description_service import MedicineDescriptionService

def test_gemini_direct():
    """Test Gemini service directly"""
    print("🧪 Testing Gemini Service Directly...")
    
    try:
        gemini = GeminiMedicineService()
        if not gemini.available:
            print("❌ Gemini not available")
            return False
            
        # Test with Pantop
        result = gemini.generate_medicine_description("Pantop", "Pantoprazole 40mg")
        
        if result:
            print("✅ Gemini working! Sample result:")
            print(f"Uses: {result.get('uses', 'None')[:100]}...")
            print(f"Mechanism: {result.get('mechanism', 'None')[:100]}...")
            return True
        else:
            print("❌ No result from Gemini")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_full_service():
    """Test the full medicine description service"""
    print("\n🔧 Testing Full Medicine Description Service...")
    
    try:
        service = MedicineDescriptionService()
        
        # Test with Pantop
        result = service.get_medicine_description("Pantop", "Pantoprazole 40mg")
        
        print("✅ Full service working! Result keys:", list(result.keys()))
        print(f"Uses: {result.get('uses', 'None')[:100]}...")
        print(f"Source: {result.get('source', 'Unknown')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Gemini Integration")
    print("=" * 50)
    
    gemini_works = test_gemini_direct()
    service_works = test_full_service()
    
    print("\n" + "=" * 50)
    print("📊 RESULTS:")
    print(f"Gemini Direct: {'✅' if gemini_works else '❌'}")
    print(f"Full Service: {'✅' if service_works else '❌'}")
    
    if gemini_works and service_works:
        print("\n🎉 SUCCESS! Ready to use Gemini-powered medicine descriptions!")
    else:
        print("\n⚠️ Some issues found. Check errors above.")

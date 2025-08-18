"""
Gemini AI Service for Medicine Descriptions
Simple integration for generating medicine information using Google's Gemini AI
"""

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError as e:
    print(f"google-generativeai not available: {e}")
    GENAI_AVAILABLE = False
    genai = None

from typing import Dict, Optional

class GeminiMedicineService:
    def __init__(self):
        # Initialize Gemini with your API key
        self.api_key = "AIzaSyCxiU_-f2z_i2p-vs_H548IulHgVVGFwwI"
        self.available = False
        
        if not GENAI_AVAILABLE:
            print("⚠️ google-generativeai package not installed")
            return
            
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Test the connection with a simple request
            test_response = self.model.generate_content(
                "Say 'Hello'",
                generation_config=genai.types.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=10,
                )
            )
            
            if test_response.text:
                self.available = True
                print("✅ Gemini AI service initialized and tested successfully")
            else:
                print("⚠️ Gemini AI test failed - no response")
                
        except Exception as e:
            print(f"⚠️ Gemini AI initialization failed: {e}")
            self.available = False

    def generate_medicine_description(self, medicine_name: str, composition: str = "") -> Optional[Dict[str, str]]:
        """Generate comprehensive medicine description using Gemini AI"""
        
        if not self.available:
            return None

        # Create a comprehensive 1mg-style prompt
        prompt = f"""Generate comprehensive medical information for the medicine: {medicine_name}
        
Composition: {composition}

Create detailed descriptions exactly like 1mg.com medical website. Write in a professional, patient-friendly tone.

**PRODUCT_INTRODUCTION:**
Write a comprehensive 2-3 paragraph introduction explaining:
- What {medicine_name} is and its drug class (e.g., antibiotic, pain reliever, etc.)
- What infections/conditions it treats and how it helps the body
- Important usage instructions (take with food, complete the course, etc.)
- Key warnings or precautions patients should know
Make it informative and reassuring, similar to 1mg product introductions.

**USES:**
Write a concise paragraph (3-4 sentences) explaining:
- Primary medical conditions this medicine treats
- Specific therapeutic uses and when doctors prescribe it
- How it helps patients feel better
Keep it focused and easy to understand.

**MECHANISM:**
Write a detailed scientific explanation (5-6 sentences) covering:
- How the medicine works in the body at the molecular level
- The specific biological mechanisms, pathways, and targets
- What happens at the cellular level and which receptors/enzymes are affected
- How this biological action leads to the therapeutic effect
- Why this mechanism makes it effective for the specific conditions
Use clear but scientifically accurate language that educates patients about the actual pharmacology.

**SIDE_EFFECTS:**
Provide a comprehensive but focused list of the most common and clinically significant side effects (8-12 effects) in comma-separated format. Include:
- Most frequently reported side effects from clinical trials
- Dose-dependent effects
- Effects that patients should monitor for
- Both mild and more significant side effects
Format: "effect1, effect2, effect3, effect4, effect5, effect6, effect7, effect8, effect9, effect10"

**EXPERT_ADVICE:**
Write practical usage guidance in 4-5 concise, numbered points covering:
1. Dosing: Basic dosing instructions and timing (keep brief)
2. Administration: How to take it (with/without food, swallow whole, etc.)
3. Precautions: Key warnings and what to avoid
4. Monitoring: What to watch for and when to contact doctor
5. Duration: How long to take and completion importance

Keep each point to 1-2 sentences maximum. Focus on the most essential information patients need to know."""

        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.2,
                    max_output_tokens=3000,
                )
            )
            
            if response.text:
                return self._parse_gemini_response(response.text, medicine_name)
            
        except Exception as e:
            print(f"Error generating description for {medicine_name}: {e}")
            
        return None

    def _parse_gemini_response(self, response_text: str, medicine_name: str) -> Dict[str, str]:
        """Parse the Gemini response into structured data"""
        
        # Initialize result with fallback values
        result = {
            "product_introduction": f"Information about {medicine_name} is being generated.",
            "uses": f"Information about {medicine_name} uses will be available soon.",
            "mechanism": f"Information about how {medicine_name} works will be available soon.",
            "side_effects": "Please consult your healthcare provider for side effect information.",
            "expert_advice": f"Take {medicine_name} as prescribed by your doctor. Do not exceed recommended dosage."
        }
        
        try:
            # Split response into sections
            sections = response_text.split('**')
            current_section = None
            current_content = []
            
            for section in sections:
                section = section.strip()
                if not section:
                    continue
                    
                # Check for section headers
                if 'PRODUCT_INTRODUCTION:' in section.upper():
                    if current_section and current_content:
                        result[current_section] = ' '.join(current_content).strip()
                    current_section = 'product_introduction'
                    current_content = [section.split(':', 1)[-1].strip()]
                    
                elif 'USES:' in section.upper():
                    if current_section and current_content:
                        result[current_section] = ' '.join(current_content).strip()
                    current_section = 'uses'
                    current_content = [section.split(':', 1)[-1].strip()]
                    
                elif 'MECHANISM:' in section.upper():
                    if current_section and current_content:
                        result[current_section] = ' '.join(current_content).strip()
                    current_section = 'mechanism'
                    current_content = [section.split(':', 1)[-1].strip()]
                    
                elif 'SIDE_EFFECTS:' in section.upper() or 'SIDE EFFECTS:' in section.upper():
                    if current_section and current_content:
                        result[current_section] = ' '.join(current_content).strip()
                    current_section = 'side_effects'
                    current_content = [section.split(':', 1)[-1].strip()]
                    
                elif 'EXPERT_ADVICE:' in section.upper() or 'EXPERT ADVICE:' in section.upper():
                    if current_section and current_content:
                        result[current_section] = ' '.join(current_content).strip()
                    current_section = 'expert_advice'
                    current_content = [section.split(':', 1)[-1].strip()]
                    
                elif current_section:
                    # Add content to current section
                    current_content.append(section)
            
            # Don't forget the last section
            if current_section and current_content:
                result[current_section] = ' '.join(current_content).strip()
            
            # Clean up the parsed content
            for key in result:
                if result[key]:
                    # Remove extra whitespace and clean up
                    result[key] = ' '.join(result[key].split())
                    # Remove any remaining asterisks or formatting
                    result[key] = result[key].replace('*', '').strip()
                    
        except Exception as e:
            print(f"Error parsing response for {medicine_name}: {e}")
            # Return fallback values if parsing fails
        
        return result

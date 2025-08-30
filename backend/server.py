from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from scripts.build_index import get_medicine_recommendations
from scripts.build_index import get_treatment_by_symptom
import uvicorn

app = FastAPI()

# ✅ Enable CORS for React frontend (Adjust allowed origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend URL
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Allow GET and POST requests
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Medicine Alternative API is running!"}

@app.get("/search")
async def search_medicine(name: str):
    try:
        alternatives = get_medicine_recommendations(name)
        return {"alternatives": alternatives}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/search_symptom")
async def search_symptom(query: str):
    try:
        result = get_treatment_by_symptom(query)
        return {"alternatives": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5010)

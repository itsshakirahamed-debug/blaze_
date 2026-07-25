from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router as analyze_router

app = FastAPI(
    title="Smart Contract Risk Analyzer API",
    version="1.0.0",
    description="Backend API for AI-powered legal contract risk analysis."
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)

@app.get("/")
def home():
    return {
        "message": "Smart Contract Risk Analyzer Backend is Running!"
    }

@app.get("/health")
def health():
    return {
        "status": "Healthy",
        "service": "Backend API"
    }
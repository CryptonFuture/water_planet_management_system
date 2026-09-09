"""
Water Quality Analysis & Prediction Microservice
Uses simple ML model for water quality scoring and anomaly detection
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import numpy as np
from datetime import datetime

app = FastAPI(
    title="Water Quality Analytics Service",
    description="Python microservice for water quality scoring, prediction and recommendations",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WaterParameters(BaseModel):
    ph: float = Field(..., ge=0, le=14)
    turbidity: Optional[float] = Field(None, ge=0)
    dissolved_oxygen: Optional[float] = Field(None, ge=0)
    chlorine: Optional[float] = Field(None, ge=0)
    hardness: Optional[float] = Field(None, ge=0)
    tds: Optional[float] = Field(None, ge=0)
    temperature: Optional[float] = None
    conductivity: Optional[float] = None
    residual_chlorine: Optional[float] = None


class QualityAnalysisRequest(BaseModel):
    parameters: WaterParameters
    plant_id: Optional[str] = None


class QualityAnalysisResponse(BaseModel):
    overall_score: float
    status: str
    parameter_scores: Dict[str, float]
    recommendations: List[str]
    is_safe_for_drinking: bool
    risk_factors: List[str]
    analyzed_at: str


class BatchAnalysisRequest(BaseModel):
    records: List[WaterParameters]


def calculate_ph_score(ph: float) -> float:
    """Ideal pH for drinking water: 6.5 - 8.5"""
    if 6.5 <= ph <= 8.5:
        return 100.0
    elif 6.0 <= ph < 6.5 or 8.5 < ph <= 9.0:
        return 70.0
    elif 5.5 <= ph < 6.0 or 9.0 < ph <= 9.5:
        return 40.0
    else:
        return 10.0


def calculate_turbidity_score(turbidity: float) -> float:
    """WHO guideline: < 5 NTU preferred, < 1 ideal"""
    if turbidity is None:
        return 50.0
    if turbidity <= 1:
        return 100.0
    elif turbidity <= 5:
        return 80.0
    elif turbidity <= 10:
        return 50.0
    else:
        return 20.0


def calculate_chlorine_score(chlorine: float) -> float:
    """Residual chlorine: 0.2 - 1.0 mg/L ideal"""
    if chlorine is None:
        return 50.0
    if 0.2 <= chlorine <= 1.0:
        return 100.0
    elif 0.1 <= chlorine < 0.2 or 1.0 < chlorine <= 2.0:
        return 60.0
    else:
        return 20.0


def calculate_tds_score(tds: float) -> float:
    """TDS: < 300 excellent, < 600 good, < 1000 acceptable"""
    if tds is None:
        return 50.0
    if tds <= 300:
        return 100.0
    elif tds <= 600:
        return 80.0
    elif tds <= 1000:
        return 60.0
    else:
        return 25.0


def calculate_do_score(do: float) -> float:
    """Dissolved Oxygen: > 5 mg/L good"""
    if do is None:
        return 50.0
    if do >= 6:
        return 100.0
    elif do >= 4:
        return 70.0
    else:
        return 30.0


def analyze_water_quality(params: WaterParameters) -> QualityAnalysisResponse:
    scores = {}
    recommendations = []
    risk_factors = []

    scores["ph"] = calculate_ph_score(params.ph)
    if scores["ph"] < 70:
        if params.ph < 6.5:
            recommendations.append("pH is low. Consider adding lime or soda ash to raise pH.")
            risk_factors.append("Acidic water can corrode pipes and leach metals.")
        else:
            recommendations.append("pH is high. Consider acid dosing or CO2 injection.")
            risk_factors.append("Alkaline water may cause scale formation.")

    if params.turbidity is not None:
        scores["turbidity"] = calculate_turbidity_score(params.turbidity)
        if scores["turbidity"] < 70:
            recommendations.append("High turbidity. Check coagulation/flocculation and filtration processes.")
            risk_factors.append("High turbidity can shield microorganisms from disinfection.")

    if params.chlorine is not None:
        scores["chlorine"] = calculate_chlorine_score(params.chlorine)
        if scores["chlorine"] < 70:
            if params.chlorine < 0.2:
                recommendations.append("Residual chlorine is low. Increase chlorine dosing.")
                risk_factors.append("Insufficient disinfection residual.")
            else:
                recommendations.append("Chlorine residual is high. Reduce dosing to avoid taste/odor issues.")

    if params.tds is not None:
        scores["tds"] = calculate_tds_score(params.tds)
        if scores["tds"] < 60:
            recommendations.append("High TDS. Investigate source water and consider additional treatment.")
            risk_factors.append("High TDS affects taste and can indicate pollution.")

    if params.dissolved_oxygen is not None:
        scores["dissolved_oxygen"] = calculate_do_score(params.dissolved_oxygen)
        if scores["dissolved_oxygen"] < 70:
            recommendations.append("Low dissolved oxygen. Check aeration systems.")

    if not scores:
        overall = 50.0
    else:
        overall = sum(scores.values()) / len(scores)

    if overall >= 85:
        status = "excellent"
    elif overall >= 70:
        status = "good"
    elif overall >= 50:
        status = "acceptable"
    elif overall >= 30:
        status = "poor"
    else:
        status = "critical"

    is_safe = overall >= 60 and scores.get("ph", 50) >= 40 and scores.get("turbidity", 50) >= 40

    if not recommendations:
        recommendations.append("All parameters within acceptable range. Continue regular monitoring.")

    return QualityAnalysisResponse(
        overall_score=round(overall, 1),
        status=status,
        parameter_scores={k: round(v, 1) for k, v in scores.items()},
        recommendations=recommendations,
        is_safe_for_drinking=is_safe,
        risk_factors=risk_factors,
        analyzed_at=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/")
def root():
    return {
        "service": "Water Quality Analytics",
        "version": "1.0.0",
        "status": "running",
        "endpoints": ["/analyze", "/batch-analyze", "/health"]
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze", response_model=QualityAnalysisResponse)
def analyze(request: QualityAnalysisRequest):
    try:
        return analyze_water_quality(request.parameters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/batch-analyze")
def batch_analyze(request: BatchAnalysisRequest):
    results = []
    for params in request.records:
        results.append(analyze_water_quality(params))
    return {
        "count": len(results),
        "results": results,
        "average_score": round(sum(r.overall_score for r in results) / len(results), 1) if results else 0
    }


@app.get("/standards")
def get_standards():
    return {
        "drinking_water_standards": {
            "ph": {"min": 6.5, "max": 8.5, "unit": ""},
            "turbidity": {"max": 5, "preferred": 1, "unit": "NTU"},
            "chlorine_residual": {"min": 0.2, "max": 1.0, "unit": "mg/L"},
            "tds": {"max": 500, "acceptable": 1000, "unit": "mg/L"},
            "hardness": {"max": 300, "unit": "mg/L as CaCO3"},
            "dissolved_oxygen": {"min": 5, "unit": "mg/L"}
        },
        "source": "WHO / BIS IS 10500 guidelines (simplified)"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

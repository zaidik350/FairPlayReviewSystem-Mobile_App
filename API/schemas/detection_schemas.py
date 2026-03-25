from pydantic import BaseModel
from typing import Optional


class VideoAnalysisRequest(BaseModel):
    match_id: int
    video_file: Optional[str] = None  # Path or filename


class DetectionResult(BaseModel):
    """DRS-style analysis result returned to the frontend."""
    impact: str          # "In-line" | "Outside"
    pitch: str           # "In-line" | "Outside"
    wickets: str         # "Hitting" | "Missing"
    decision: str        # "OUT" | "NOT OUT"
    confidence: float    # 0.0 – 1.0
    message: Optional[str] = None

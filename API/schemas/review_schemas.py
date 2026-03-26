from pydantic import BaseModel
from typing import Optional


class ReviewCreate(BaseModel):
    match_id: int
    match_name: str
    user_id: Optional[int] = None
    over: str
    original_decision: str       # "OUT" | "NOT OUT"
    decision: str                # "OUT" | "NOT OUT"
    impact: str                  # "In-line" | "Outside"
    pitch: str                   # "In-line" | "Outside"
    wickets: str                 # "Hitting" | "Missing"
    video_uri: Optional[str] = None


class ReviewUpdate(BaseModel):
    decision: Optional[str] = None
    impact: Optional[str] = None
    pitch: Optional[str] = None
    wickets: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    match_id: int
    match_name: str
    user_id: Optional[int] = None
    over: str
    original_decision: str
    decision: str
    impact: str
    pitch: str
    wickets: str
    video_uri: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

from pydantic import BaseModel
from typing import Optional


class MatchCreate(BaseModel):
    name: str
    teams: str
    venue: str
    date: str
    status: str = "upcoming"


class MatchUpdate(BaseModel):
    name: Optional[str] = None
    teams: Optional[str] = None
    venue: Optional[str] = None
    date: Optional[str] = None
    status: Optional[str] = None


class MatchOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    name: str
    teams: str
    venue: str
    date: str
    status: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

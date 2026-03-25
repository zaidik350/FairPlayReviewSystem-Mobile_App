from pydantic import BaseModel
from typing import Optional


# ── Individual notification records ──

class NotificationBase(BaseModel):
    user_id: int
    message: str


class NotificationCreate(NotificationBase):
    pass


class NotificationOut(NotificationBase):
    id: int
    read: bool
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


# ── Notification preference settings ──

class NotificationSettingsUpdate(BaseModel):
    match_alerts: Optional[bool] = None
    review_updates: Optional[bool] = None
    system_notifications: Optional[bool] = None


class NotificationSettingsOut(BaseModel):
    id: Optional[int] = None
    user_id: int
    match_alerts: bool = True
    review_updates: bool = True
    system_notifications: bool = False

    class Config:
        from_attributes = True

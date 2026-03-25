from fastapi import APIRouter, Depends
from services.notification_service import NotificationService
from schemas.notification_schemas import NotificationSettingsUpdate
from utils.response_formatter import success_response
from dependencies.auth_dependency import get_current_user

router = APIRouter()


# ── Individual notification records ──

@router.get("/")
async def get_notifications(current_user=Depends(get_current_user)):
    notifications = await NotificationService.get_notifications(current_user["id"])
    return success_response(data=notifications)


@router.post("/read")
async def mark_read(notification_id: int):
    notification = await NotificationService.mark_read(notification_id)
    return success_response(data=notification, message="Notification marked as read")


# ── Notification preference settings ──

@router.get("/settings")
async def get_settings(current_user=Depends(get_current_user)):
    settings = await NotificationService.get_settings(current_user["id"])
    return success_response(data=settings)


@router.put("/settings")
async def update_settings(data: NotificationSettingsUpdate, current_user=Depends(get_current_user)):
    settings = await NotificationService.update_settings(current_user["id"], data)
    return success_response(data=settings, message="Notification settings updated")

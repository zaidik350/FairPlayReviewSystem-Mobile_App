from fastapi import HTTPException
from core.supabase_client import supabase_client, NOTIFICATIONS_TABLE, NOTIFICATION_SETTINGS_TABLE
from schemas.notification_schemas import NotificationCreate, NotificationSettingsUpdate

DEFAULT_SETTINGS = {
    "match_alerts": True,
    "review_updates": True,
    "system_notifications": False,
}


class NotificationService:
    # ── Individual notification records ──

    @staticmethod
    async def get_notifications(user_id: int):
        try:
            response = supabase_client.table(NOTIFICATIONS_TABLE).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def mark_read(notification_id: int):
        try:
            response = supabase_client.table(NOTIFICATIONS_TABLE).select("*").eq("id", notification_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Notification not found")

            update_response = supabase_client.table(NOTIFICATIONS_TABLE).update({"read": True}).eq("id", notification_id).execute()
            if update_response.data:
                return update_response.data[0]
            raise HTTPException(status_code=500, detail="Failed to mark notification as read")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def create_notification(data: NotificationCreate):
        try:
            notification_dict = data.model_dump()
            response = supabase_client.table(NOTIFICATIONS_TABLE).insert(notification_dict).execute()
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Failed to create notification")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def delete_notification(notification_id: int):
        try:
            check = supabase_client.table(NOTIFICATIONS_TABLE).select("*").eq("id", notification_id).execute()
            if not check.data:
                raise HTTPException(status_code=404, detail="Notification not found")

            supabase_client.table(NOTIFICATIONS_TABLE).delete().eq("id", notification_id).execute()
            return True
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    # ── Notification preference settings ──

    @staticmethod
    async def get_settings(user_id: int):
        try:
            response = supabase_client.table(NOTIFICATION_SETTINGS_TABLE).select("*").eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            # Auto-create default row
            row = {"user_id": user_id, **DEFAULT_SETTINGS}
            insert = supabase_client.table(NOTIFICATION_SETTINGS_TABLE).insert(row).execute()
            if insert.data:
                return insert.data[0]
            return {**row, "id": None}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def update_settings(user_id: int, data: NotificationSettingsUpdate):
        try:
            existing = supabase_client.table(NOTIFICATION_SETTINGS_TABLE).select("*").eq("user_id", user_id).execute()
            update_data = data.model_dump(exclude_unset=True)

            if existing.data:
                response = supabase_client.table(NOTIFICATION_SETTINGS_TABLE).update(update_data).eq("user_id", user_id).execute()
            else:
                row = {"user_id": user_id, **DEFAULT_SETTINGS, **update_data}
                response = supabase_client.table(NOTIFICATION_SETTINGS_TABLE).insert(row).execute()

            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Failed to update notification settings")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

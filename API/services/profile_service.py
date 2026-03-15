from fastapi import HTTPException
from core.supabase_client import supabase_client, USERS_TABLE
from schemas.profile_schemas import ProfileUpdate


def _safe_user(row: dict) -> dict:
    """Strip password_hash before returning user data."""
    return {k: v for k, v in row.items() if k != "password_hash"}


class ProfileService:
    @staticmethod
    async def get_profile(user_id: int):
        try:
            response = supabase_client.table(USERS_TABLE).select("*").eq("id", user_id).execute()
            if response.data:
                return _safe_user(response.data[0])
            raise HTTPException(status_code=404, detail="User not found")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def update_profile(user_id: int, data: ProfileUpdate):
        try:
            check = supabase_client.table(USERS_TABLE).select("*").eq("id", user_id).execute()
            if not check.data:
                raise HTTPException(status_code=404, detail="User not found")

            current_user = check.data[0]
            update_data = data.model_dump(exclude_unset=True)

            fname = update_data.pop("fname", None)
            lname = update_data.pop("lname", None)

            if fname is not None or lname is not None:
                existing_name = (current_user.get("name") or "").strip()
                existing_parts = existing_name.split(" ", 1) if existing_name else ["", ""]
                existing_first = existing_parts[0] if len(existing_parts) > 0 else ""
                existing_last = existing_parts[1] if len(existing_parts) > 1 else ""

                final_first = (fname if fname is not None else existing_first).strip()
                final_last = (lname if lname is not None else existing_last).strip()
                combined_name = f"{final_first} {final_last}".strip()

                if combined_name:
                    update_data["name"] = combined_name

            response = supabase_client.table(USERS_TABLE).update(update_data).eq("id", user_id).execute()
            if response.data:
                return _safe_user(response.data[0])
            raise HTTPException(status_code=500, detail="Failed to update profile")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

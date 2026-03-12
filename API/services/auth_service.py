from fastapi import HTTPException, status
from core.security import get_password_hash, verify_password, create_access_token
from schemas.auth_schemas import UserCreate, UserLogin, ChangePassword
from core.supabase_client import supabase_client, USERS_TABLE
from datetime import timedelta


def _safe_user(row: dict) -> dict:
    """Strip password_hash before returning user data."""
    return {k: v for k, v in row.items() if k != "password_hash"}


class AuthService:
    @staticmethod
    async def signup(user_data: UserCreate):
        try:
            # Check if user already exists
            existing = supabase_client.table(USERS_TABLE).select("*").eq("email", user_data.email).execute()
            if existing.data:
                raise HTTPException(status_code=400, detail="Email already registered")

            hashed_password = get_password_hash(user_data.password)
            user_dict = {
                "name": user_data.name,
                "email": user_data.email,
                "password_hash": hashed_password,
                "avatar": None,
            }

            response = supabase_client.table(USERS_TABLE).insert(user_dict).execute()
            if not response.data:
                raise HTTPException(status_code=500, detail="Failed to create user")

            user = response.data[0]
            access_token = create_access_token({"sub": str(user["id"])})
            return {"user": _safe_user(user), "access_token": access_token, "token_type": "bearer"}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Signup error: {str(e)}")

    @staticmethod
    async def login(user_data: UserLogin):
        try:
            response = supabase_client.table(USERS_TABLE).select("*").eq("email", user_data.email).execute()
            if not response.data:
                raise HTTPException(status_code=401, detail="Invalid credentials")

            user = response.data[0]
            if not verify_password(user_data.password, user["password_hash"]):
                raise HTTPException(status_code=401, detail="Invalid credentials")

            access_token = create_access_token({"sub": str(user["id"])})
            return {"user": _safe_user(user), "access_token": access_token, "token_type": "bearer"}
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")

    @staticmethod
    async def change_password(user_id: int, data: ChangePassword):
        try:
            response = supabase_client.table(USERS_TABLE).select("*").eq("id", user_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="User not found")

            user = response.data[0]
            if not verify_password(data.old_password, user["password_hash"]):
                raise HTTPException(status_code=401, detail="Invalid old password")

            new_hash = get_password_hash(data.new_password)
            update_response = supabase_client.table(USERS_TABLE).update({"password_hash": new_hash}).eq("id", user_id).execute()
            if update_response.data:
                return _safe_user(update_response.data[0])
            raise HTTPException(status_code=500, detail="Failed to change password")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def get_user(user_id: int):
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
    async def update_profile(user_id: int, data: dict):
        try:
            update_data = {}
            if "name" in data:
                update_data["name"] = data["name"]
            if "avatar" in data:
                update_data["avatar"] = data["avatar"]

            response = supabase_client.table(USERS_TABLE).update(update_data).eq("id", user_id).execute()
            if response.data:
                return _safe_user(response.data[0])
            raise HTTPException(status_code=500, detail="Failed to update profile")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


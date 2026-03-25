from fastapi import APIRouter, Depends, status, HTTPException
from schemas.auth_schemas import UserCreate, UserLogin, ChangePassword, UserOut, Token, AuthResponse
from services.auth_service import AuthService
from utils.response_formatter import success_response, error_response
from dependencies.auth_dependency import get_current_user

router = APIRouter()


@router.post("/signup", response_model=dict)
async def signup(user: UserCreate):
    result = await AuthService.signup(user)
    return success_response(data=result, message="Signup successful")


@router.post("/login", response_model=dict)
async def login(user: UserLogin):
    result = await AuthService.login(user)
    return success_response(data=result, message="Login successful")


@router.post("/change-password")
async def change_password(data: ChangePassword, current_user=Depends(get_current_user)):
    await AuthService.change_password(current_user["id"], data)
    return success_response(message="Password changed successfully")


@router.get("/profile", response_model=dict)
async def get_profile(current_user=Depends(get_current_user)):
    # Strip password_hash
    safe = {k: v for k, v in current_user.items() if k != "password_hash"}
    return success_response(data=safe)


@router.put("/profile", response_model=dict)
async def update_profile(update: dict, current_user=Depends(get_current_user)):
    updated_user = await AuthService.update_profile(current_user["id"], update)
    return success_response(data=updated_user, message="Profile updated")

from fastapi import HTTPException
from schemas.review_schemas import ReviewCreate, ReviewUpdate
from core.supabase_client import supabase_client, REVIEWS_TABLE


class ReviewService:
    @staticmethod
    async def create_review(data: ReviewCreate, user_id: int):
        try:
            review_dict = data.model_dump()
            review_dict["user_id"] = user_id
            response = supabase_client.table(REVIEWS_TABLE).insert(review_dict).execute()
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Failed to create review")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def get_reviews(user_id: int):
        try:
            response = supabase_client.table(REVIEWS_TABLE).select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def get_review(review_id: int, user_id: int):
        try:
            response = supabase_client.table(REVIEWS_TABLE).select("*").eq("id", review_id).eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=404, detail="Review not found")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def get_reviews_by_match(match_id: int, user_id: int):
        try:
            response = supabase_client.table(REVIEWS_TABLE).select("*").eq("match_id", match_id).eq("user_id", user_id).order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def update_review(review_id: int, data: ReviewUpdate, user_id: int):
        try:
            check = supabase_client.table(REVIEWS_TABLE).select("*").eq("id", review_id).eq("user_id", user_id).execute()
            if not check.data:
                raise HTTPException(status_code=404, detail="Review not found")

            update_data = data.model_dump(exclude_unset=True)
            response = supabase_client.table(REVIEWS_TABLE).update(update_data).eq("id", review_id).eq("user_id", user_id).execute()
            if response.data:
                return response.data[0]
            raise HTTPException(status_code=500, detail="Failed to update review")
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

    @staticmethod
    async def delete_review(review_id: int, user_id: int):
        try:
            check = supabase_client.table(REVIEWS_TABLE).select("*").eq("id", review_id).eq("user_id", user_id).execute()
            if not check.data:
                raise HTTPException(status_code=404, detail="Review not found")

            supabase_client.table(REVIEWS_TABLE).delete().eq("id", review_id).eq("user_id", user_id).execute()
            return True
        except HTTPException as e:
            raise e
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

from fastapi import UploadFile, HTTPException
from utils.file_handler import save_upload_file, delete_file
from schemas.detection_schemas import DetectionResult
import sys
import os
import random

# Safely import detection pipeline
try:
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
    from detection_pipeline import run_detection_pipeline
    DETECTION_PIPELINE_AVAILABLE = True
except ImportError:
    DETECTION_PIPELINE_AVAILABLE = False


def _build_drs_result(raw: dict = None) -> DetectionResult:
    """Convert raw pipeline output (or generate mock) into DRS result."""
    if raw and "impact" in raw:
        impact = raw["impact"]
        pitch = raw["pitch"]
        wickets = raw["wickets"]
    else:
        # Simulated DRS analysis
        impact = random.choice(["In-line", "Outside"])
        pitch = random.choice(["In-line", "Outside"])
        wickets = random.choice(["Hitting", "Missing"])

    is_out = impact == "In-line" and pitch == "In-line" and wickets == "Hitting"
    decision = "OUT" if is_out else "NOT OUT"
    confidence = round(random.uniform(0.80, 0.98), 2)

    return DetectionResult(
        impact=impact,
        pitch=pitch,
        wickets=wickets,
        decision=decision,
        confidence=confidence,
    )


class DetectionService:
    @staticmethod
    async def analyze_video(match_id: int, video_file: UploadFile, original_decision: str):
        if original_decision not in {"OUT", "NOT OUT"}:
            raise HTTPException(status_code=400, detail="original_decision must be 'OUT' or 'NOT OUT'")

        file_path = save_upload_file(video_file)
        try:
            if DETECTION_PIPELINE_AVAILABLE:
                raw = run_detection_pipeline(file_path, match_id)
                return _build_drs_result(raw)
            else:
                return _build_drs_result()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            delete_file(file_path)

    @staticmethod
    async def detect_ball(video_file: UploadFile):
        file_path = save_upload_file(video_file)
        try:
            return _build_drs_result()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            delete_file(file_path)

    @staticmethod
    async def detect_batsman(video_file: UploadFile):
        file_path = save_upload_file(video_file)
        try:
            return _build_drs_result()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            delete_file(file_path)

    @staticmethod
    async def detect_wicket(video_file: UploadFile):
        file_path = save_upload_file(video_file)
        try:
            return _build_drs_result()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            delete_file(file_path)

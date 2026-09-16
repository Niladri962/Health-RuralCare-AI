from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.speech_to_text import transcribe_audio


router = APIRouter(
    prefix="/api/voice",
    tags=["Voice"],
)


@router.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    language: str = "auto",
):

    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="Audio file type could not be detected.",
        )

    audio_data = await file.read()

    try:
        text = await transcribe_audio(
            audio_data,
            filename=file.filename or "audio.webm",
            language=language,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    return {
        "text": text,
        "language": language,
    }
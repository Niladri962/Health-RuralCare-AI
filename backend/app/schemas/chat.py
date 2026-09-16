from pydantic import BaseModel, Field


class ChatRequest(BaseModel):

    message: str = Field(
        min_length=1,
        max_length=5000,
    )

    language: str = "English"

    conversation_id: str | None = None

    messages: list[dict] = []

    collected_symptoms: dict = {}


class ChatResponse(BaseModel):

    conversation_id: str

    response: str

    triage_level: str | None = None

    emergency: bool = False

    appointment_required: bool = False

    clarification_required: bool = False
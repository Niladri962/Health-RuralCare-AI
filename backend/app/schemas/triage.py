from pydantic import BaseModel


class TriageRequest(BaseModel):

    conversation_id: str | None = None

    message: str

    language: str = "English"

    messages: list[dict] = []

    symptoms: dict = {}


class TriageResponse(BaseModel):

    triage_level: str

    emergency: bool

    reason: str

    recommended_action: str

    appointment_required: bool
from uuid import uuid4

from fastapi import APIRouter, HTTPException

from app.graph.workflow import triage_graph
from app.schemas.chat import ChatRequest, ChatResponse


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):

    conversation_id = (
        request.conversation_id
        or str(uuid4())
    )

    state = {
        "conversation_id": conversation_id,
        "language": request.language,
        "patient_message": request.message,
        "messages": request.messages,
        "collected_symptoms": request.collected_symptoms,
    }

    try:
        result = triage_graph.invoke(state)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    return ChatResponse(
        conversation_id=conversation_id,
        response=result.get(
            "final_response",
            "I could not process your request.",
        ),
        triage_level=result.get("triage_level"),
        emergency=result.get("emergency", False),
        appointment_required=result.get(
            "appointment_required",
            False,
        ),
        clarification_required=bool(
            result.get("missing_information")
        ),
    )
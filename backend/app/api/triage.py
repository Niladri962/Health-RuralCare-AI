from fastapi import APIRouter

from app.schemas.triage import TriageRequest, TriageResponse
from app.graph.workflow import triage_graph


router = APIRouter(
    prefix="/api/triage",
    tags=["Triage"],
)


@router.post("", response_model=TriageResponse)
async def perform_triage(
    request: TriageRequest,
):

    state = {
        "conversation_id": request.conversation_id,
        "language": request.language,
        "patient_message": request.message,
        "messages": request.messages,
        "collected_symptoms": request.symptoms,
    }

    result = triage_graph.invoke(state)

    return TriageResponse(
        triage_level=result.get(
            "triage_level",
            "URGENT",
        ),
        emergency=result.get(
            "emergency",
            False,
        ),
        reason=result.get(
            "triage_reason",
            "",
        ),
        recommended_action=result.get(
            "recommended_action",
            "",
        ),
        appointment_required=result.get(
            "appointment_required",
            True,
        ),
    )
import json

from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)

from app.services.llm import get_llm


TRIAGE_SYSTEM_PROMPT = """
You are the Triage Agent in a rural healthcare
assistant.

You are NOT a doctor and must never provide
a definitive diagnosis.

Your job is to estimate urgency based on the
information supplied.

Allowed triage levels:

EMERGENCY
URGENT
ROUTINE

EMERGENCY may include symptoms such as:

- severe difficulty breathing
- severe chest pain
- loss of consciousness
- seizure
- stroke-like symptoms
- severe uncontrolled bleeding
- severe allergic reaction
- sudden severe neurological symptoms
- serious trauma
- immediate danger to self or others

URGENT means prompt medical assessment is appropriate.

ROUTINE means there is no obvious emergency based
on the information currently provided.

When there is meaningful uncertainty involving a
potentially serious symptom, prefer the safer
urgency classification.

Do not prescribe medication.

Do not give medication dosages.

Do not claim certainty.

Return ONLY JSON:

{
    "triage_level": "EMERGENCY",
    "emergency": true,
    "reason": "Short explanation",
    "recommended_action": "Clear next step",
    "appointment_required": true
}
"""


def triage_agent(state: dict) -> dict:

    llm = get_llm()

    payload = {
        "language": state.get(
            "language",
            "English",
        ),
        "patient_message": state.get(
            "patient_message",
            "",
        ),
        "conversation": state.get(
            "messages",
            [],
        ),
        "symptoms": state.get(
            "collected_symptoms",
            {},
        ),
    }

    messages = [
        SystemMessage(
            content=TRIAGE_SYSTEM_PROMPT
        ),
        HumanMessage(
            content=json.dumps(
                payload,
                ensure_ascii=False,
            )
        ),
    ]

    response = llm.invoke(messages)

    raw = response.content

    if isinstance(raw, list):
        raw = "".join(
            str(item)
            for item in raw
        )

    try:
        result = json.loads(raw)

    except json.JSONDecodeError:

        result = {
            "triage_level": "URGENT",
            "emergency": False,
            "reason": (
                "The system could not confidently "
                "assess the information."
            ),
            "recommended_action": (
                "Please seek assessment from "
                "a qualified healthcare professional."
            ),
            "appointment_required": True,
        }

    level = str(
        result.get(
            "triage_level",
            "URGENT",
        )
    ).upper()

    if level not in {
        "EMERGENCY",
        "URGENT",
        "ROUTINE",
    }:
        level = "URGENT"

    return {
        "triage_level": level,
        "emergency": (
            level == "EMERGENCY"
            or bool(result.get("emergency", False))
        ),
        "triage_reason": result.get(
            "reason",
            "",
        ),
        "recommended_action": result.get(
            "recommended_action",
            "",
        ),
        "appointment_required": result.get(
            "appointment_required",
            True,
        ),
    }
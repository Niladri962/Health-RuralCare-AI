import json

from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
)

from app.services.llm import get_llm


PLANNER_SYSTEM_PROMPT = """
You are the Planner Agent in a rural healthcare
triage assistant for patients in India.

You are NOT a doctor.

Your responsibility is to determine whether enough
information has been collected to safely perform
an urgency assessment.

You should identify important missing information
such as:

- primary symptom
- duration
- severity
- sudden or gradual onset
- associated symptoms
- age when relevant
- pregnancy when relevant
- important existing conditions
- relevant emergency warning signs

Do not diagnose.

Ask only one or two high-value questions at a time.

If there are enough details for an initial urgency
assessment, return enough_information=true.

Return ONLY valid JSON.

Example:

{
    "enough_information": false,
    "missing_information": [
        "duration"
    ],
    "question": "How long have you had this symptom?"
}

Or:

{
    "enough_information": true,
    "missing_information": [],
    "question": ""
}
"""


def planner_agent(state: dict) -> dict:

    llm = get_llm()

    payload = {
        "language": state.get(
            "language",
            "English",
        ),
        "current_message": state.get(
            "patient_message",
            "",
        ),
        "conversation": state.get(
            "messages",
            [],
        ),
        "known_symptoms": state.get(
            "collected_symptoms",
            {},
        ),
    }

    messages = [
        SystemMessage(
            content=PLANNER_SYSTEM_PROMPT
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

        # Safe fallback.
        result = {
            "enough_information": True,
            "missing_information": [],
            "question": "",
        }

    enough = result.get(
        "enough_information",
        True,
    )

    if enough:
        return {
            "missing_information": [],
            "clarification_question": "",
        }

    return {
        "missing_information": result.get(
            "missing_information",
            [],
        ),
        "clarification_question": result.get(
            "question",
            "",
        ),
    }
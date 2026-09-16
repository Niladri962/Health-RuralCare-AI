from typing import TypedDict


class TriageState(TypedDict, total=False):

    conversation_id: str

    language: str

    messages: list[dict]

    patient_message: str

    collected_symptoms: dict

    missing_information: list[str]

    clarification_question: str

    triage_level: str

    triage_reason: str

    recommended_action: str

    appointment_required: bool

    emergency: bool

    final_response: str

    appointment_options: list[dict]
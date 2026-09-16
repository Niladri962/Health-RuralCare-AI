from app.services.scheduling import (
    get_available_slots,
)


def scheduler_agent(state: dict) -> dict:

    if not state.get(
        "appointment_required",
        False,
    ):
        return {
            "appointment_options": []
        }

    return {
        "appointment_options": get_available_slots()
    }
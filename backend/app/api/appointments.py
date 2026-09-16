from fastapi import APIRouter

from app.schemas.appointment import (
    AppointmentRequest,
    AppointmentResponse,
)

from app.services.scheduling import (
    get_available_slots,
    book_appointment,
)


router = APIRouter(
    prefix="/api/appointments",
    tags=["Appointments"],
)


@router.get("/slots")
async def available_slots():
    return {
        "slots": get_available_slots()
    }


@router.post(
    "/book",
    response_model=AppointmentResponse,
)
async def create_appointment(
    request: AppointmentRequest,
):

    appointment = book_appointment(
        name=request.name,
        date=request.date,
        time=request.time,
        language=request.language,
    )

    return appointment
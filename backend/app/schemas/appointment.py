from pydantic import BaseModel


class AppointmentRequest(BaseModel):

    name: str

    date: str

    time: str

    language: str = "English"


class AppointmentResponse(BaseModel):

    appointment_id: str

    patient_name: str

    date: str

    time: str

    language: str

    status: str

    doctor: str

    speciality: str

    mode: str
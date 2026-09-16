from datetime import date, timedelta
from uuid import uuid4


def get_available_slots():

    tomorrow = date.today() + timedelta(days=1)

    return [
        {
            "id": "slot-1",
            "doctor": "Dr. Sharma",
            "speciality": "General Physician",
            "date": tomorrow.isoformat(),
            "time": "10:00 AM",
            "mode": "Teleconsultation",
        },
        {
            "id": "slot-2",
            "doctor": "Dr. Patel",
            "speciality": "General Physician",
            "date": tomorrow.isoformat(),
            "time": "11:30 AM",
            "mode": "Teleconsultation",
        },
        {
            "id": "slot-3",
            "doctor": "Dr. Singh",
            "speciality": "General Physician",
            "date": tomorrow.isoformat(),
            "time": "02:00 PM",
            "mode": "Teleconsultation",
        },
    ]


def book_appointment(
    name: str,
    date: str,
    time: str,
    language: str,
):

    return {
        "appointment_id": str(uuid4()),
        "patient_name": name,
        "date": date,
        "time": time,
        "language": language,
        "status": "confirmed",
        "doctor": "Dr. Sharma",
        "speciality": "General Physician",
        "mode": "Teleconsultation",
    }
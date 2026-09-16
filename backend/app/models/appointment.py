from sqlalchemy import (
    Column,
    Integer,
    String,
)

from app.models.patient import Base


class Appointment(Base):

    __tablename__ = "appointments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    patient_id = Column(
        Integer,
        nullable=True,
    )

    doctor = Column(
        String,
        nullable=False,
    )

    appointment_date = Column(
        String,
        nullable=False,
    )

    appointment_time = Column(
        String,
        nullable=False,
    )

    status = Column(
        String,
        default="confirmed",
    )
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
)

from app.models.patient import Base


class Consultation(Base):

    __tablename__ = "consultations"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    patient_id = Column(
        Integer,
        nullable=True,
    )

    conversation_id = Column(
        String,
        unique=True,
        index=True,
    )

    status = Column(
        String,
        default="active",
    )

    triage_level = Column(
        String,
        nullable=True,
    )

    summary = Column(
        Text,
        nullable=True,
    )
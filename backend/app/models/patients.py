from sqlalchemy import Column, Integer, String

from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Patient(Base):

    __tablename__ = "patients"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        nullable=True,
    )

    phone = Column(
        String,
        nullable=True,
    )

    preferred_language = Column(
        String,
        default="English",
    )
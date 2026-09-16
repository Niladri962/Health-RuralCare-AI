from langchain_groq import ChatGroq

from app.config import settings


def get_llm():

    if not settings.groq_api_key:

        raise RuntimeError(
            "GROQ_API_KEY is missing. "
            "Create a .env file and add your Groq API key."
        )

    return ChatGroq(
        api_key=settings.groq_api_key,
        model=settings.llm_model,
        temperature=0.1,
        max_tokens=1000,
    )
import os
import tempfile

from openai import OpenAI


async def transcribe_audio(
    audio_data: bytes,
    filename: str,
    language: str = "auto",
) -> str:

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured."
        )

    client = OpenAI(
        api_key=api_key
    )

    suffix = ".webm"

    if filename:
        if "." in filename:
            suffix = "." + filename.split(".")[-1]

    with tempfile.NamedTemporaryFile(
        suffix=suffix,
        delete=False,
    ) as temp:

        temp.write(audio_data)
        temp_path = temp.name

    try:

        with open(
            temp_path,
            "rb",
        ) as audio_file:

            kwargs = {
                "model": "whisper-1",
                "file": audio_file,
            }

            if language != "auto":
                kwargs["language"] = language

            result = client.audio.transcriptions.create(
                **kwargs
            )

        return result.text

    finally:

        try:
            os.remove(temp_path)
        except OSError:
            pass
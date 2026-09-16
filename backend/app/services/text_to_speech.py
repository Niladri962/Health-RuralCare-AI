async def synthesize_speech(
    text: str,
    language: str = "en",
) -> bytes:

    """
    TTS abstraction.

    The production implementation can use:
    - Coqui TTS
    - Bark
    - another multilingual TTS provider
    """

    raise NotImplementedError(
        "TTS engine has not been configured yet."
    )
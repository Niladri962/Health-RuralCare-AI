from pathlib import Path
import os
import re
import sys

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# =========================================================
# ENVIRONMENT
# =========================================================

BACKEND_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BACKEND_DIR.parent

load_dotenv(ROOT_DIR / ".env")
load_dotenv(BACKEND_DIR / ".env", override=True)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-120b"
).strip()

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="RuralCare AI Healthcare Assistant",
    description="AI-powered rural healthcare triage assistant",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def remove_vercel_api_prefix(request, call_next):
    if os.getenv("VERCEL") and request.scope["path"].startswith("/api"):
        request.scope["path"] = request.scope["path"][4:] or "/"

    return await call_next(request)


# =========================================================
# DATA MODELS
# =========================================================

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    language: str = "English"
    conversation: list[ChatMessage] = Field(
        default_factory=list
    )


class ChatResponse(BaseModel):
    response: str
    emergency: bool = False


# =========================================================
# SUPPORTED LANGUAGES
# =========================================================

SUPPORTED_LANGUAGES = {
    "English",
    "Hindi",
    "Marathi",
    "Punjabi",
    "Bengali",
}


# =========================================================
# EMERGENCY PATTERNS
# =========================================================

EMERGENCY_PATTERNS = {

    "English": [
        r"\bcan't breathe\b",
        r"\bcannot breathe\b",
        r"\bnot breathing\b",
        r"\bsevere chest pain\b",
        r"\bchest pain\b.*\bsevere\b",
        r"\bheart attack\b",
        r"\bunconscious\b",
        r"\bpassed out\b",
        r"\bseizure\b",
        r"\bheavy bleeding\b",
        r"\bsevere bleeding\b",
        r"\bstroke\b",
        r"\bface drooping\b",
        r"\bsudden weakness\b",
    ],

    "Hindi": [
        r"सांस नहीं",
        r"साँस नहीं",
        r"सीने में बहुत तेज दर्द",
        r"दिल का दौरा",
        r"बेहोश",
        r"दौरा पड़",
        r"बहुत ज्यादा खून",
        r"लकवा",
    ],

    "Marathi": [
        r"श्वास घेता येत नाही",
        r"छातीत तीव्र दुखत",
        r"हृदयविकाराचा झटका",
        r"बेशुद्ध",
        r"खूप रक्तस्त्राव",
        r"पक्षाघात",
    ],

    "Punjabi": [
        r"ਸਾਹ ਨਹੀਂ ਆ ਰਿਹਾ",
        r"ਛਾਤੀ ਵਿੱਚ ਤੇਜ਼ ਦਰਦ",
        r"ਦਿਲ ਦਾ ਦੌਰਾ",
        r"ਬੇਹੋਸ਼",
        r"ਬਹੁਤ ਖੂਨ",
        r"ਸਟ੍ਰੋਕ",
    ],

    "Bengali": [
        r"শ্বাস নিতে পারছি না",
        r"বুকে তীব্র ব্যথা",
        r"হার্ট অ্যাটাক",
        r"অজ্ঞান",
        r"প্রচুর রক্তপাত",
        r"স্ট্রোক",
    ],
}


# =========================================================
# SYSTEM PROMPT
# =========================================================

SYSTEM_PROMPT = """
You are RuralCare, a cautious AI healthcare triage assistant
designed for people in rural and semi-urban India.

Your role is to help the user describe their health concern,
ask relevant follow-up questions, identify possible urgency,
and guide them toward an appropriate level of medical care.

IMPORTANT RULES:

1. You are NOT a doctor.
2. Do NOT claim to diagnose a disease.
3. Do NOT present a diagnosis as certain.
4. Do not invent medical history.
5. Ask useful follow-up questions when information is missing.
6. Do not ask unnecessary questions.
7. Adapt questions to the user's previous answers.
8. Remember relevant information already provided.
9. Never repeat a question if the user already answered it.
10. Never restart the conversation unless the user starts a new consultation.
11. The user may change language during the conversation.
12. If the language changes, preserve ALL previous context.
13. Respond in the CURRENTLY SELECTED LANGUAGE.
14. Do not erase previous conversation messages.
15. Keep answers understandable for people with limited medical knowledge.
16. Use short paragraphs and bullet points when useful.
17. If there are possible emergency symptoms, clearly recommend immediate medical attention.
18. For emergencies in India, mention calling 112 when appropriate.
19. Do not delay emergency guidance by asking unnecessary questions.
20. Do not provide unsafe medication instructions.
21. Do not fabricate hospitals, doctors, test results, or medical records.
22. If uncertain, clearly state the limitation.
23. Always answer the latest user message.
24. Do not unnecessarily repeat a previous assistant response.
"""


# =========================================================
# LOGGING
# =========================================================

def log(text: str) -> None:

    # Windows consoles often use cp1252, which cannot
    # encode Indic scripts, so never let a log line
    # break a request.
    encoding = (
        getattr(sys.stdout, "encoding", None)
        or "ascii"
    )

    print(
        text.encode(
            encoding,
            errors="replace",
        ).decode(
            encoding,
            errors="replace",
        )
    )


# =========================================================
# LANGUAGE INSTRUCTION
# =========================================================

def language_instruction(language: str) -> str:

    instructions = {

        "English":
            "Respond entirely in English.",

        "Hindi":
            "Respond entirely in Hindi using Devanagari script.",

        "Marathi":
            "Respond entirely in Marathi using Devanagari script.",

        "Punjabi":
            "Respond entirely in Punjabi. Prefer Gurmukhi script.",

        "Bengali":
            "Respond entirely in Bengali using Bengali script.",
    }

    return instructions.get(
        language,
        instructions["English"]
    )


# =========================================================
# EMERGENCY DETECTION
# =========================================================

def detect_emergency(
    message: str,
    language: str
) -> bool:

    text = message.lower().strip()

    patterns = list(
        EMERGENCY_PATTERNS.get(
            language,
            []
        )
    )

    # Mixed-language users may use English
    # emergency terminology.
    if language != "English":
        patterns.extend(
            EMERGENCY_PATTERNS["English"]
        )

    for pattern in patterns:

        try:

            if re.search(
                pattern,
                text,
                flags=re.IGNORECASE
            ):
                return True

        except re.error:

            continue

    return False


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health():

    return {
        "status": "healthy",
        "groq_configured": bool(GROQ_API_KEY),
        "model": GROQ_MODEL,
        "supported_languages": sorted(
            SUPPORTED_LANGUAGES
        ),
    }


# =========================================================
# API INFORMATION
# =========================================================

@app.get("/api")
async def api_information():

    return {
        "application":
            "RuralCare AI Healthcare Assistant",

        "status":
            "running",

        "frontend":
            "/",

        "chat_endpoint":
            "/chat",

        "health_endpoint":
            "/health",

        "groq_configured":
            bool(GROQ_API_KEY),

        "model":
            GROQ_MODEL,
    }


# =========================================================
# CHAT ENDPOINT
# =========================================================

@app.post(
    "/chat",
    response_model=ChatResponse
)
async def chat(request: ChatRequest):

    # -----------------------------------------------------
    # VALIDATE MESSAGE
    # -----------------------------------------------------
    message = request.message.strip()

    if not message:

        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    # -----------------------------------------------------
    # VALIDATE LANGUAGE
    # -----------------------------------------------------

    language = request.language.strip()

    if language not in SUPPORTED_LANGUAGES:

        language = "English"

    # -----------------------------------------------------
    # CHECK GROQ KEY
    # -----------------------------------------------------

    if not GROQ_API_KEY:

        raise HTTPException(
            status_code=503,
            detail=(
                "GROQ_API_KEY is not configured. "
                "Add it to backend/.env or the repository root .env, then restart the backend."
            )
        )

    # -----------------------------------------------------
    # EMERGENCY DETECTION
    # -----------------------------------------------------

    emergency = detect_emergency(
        message,
        language
    )

    # -----------------------------------------------------
    # CREATE GROQ MESSAGE LIST
    # -----------------------------------------------------

    groq_messages = [

        {
            "role": "system",

            "content":
                SYSTEM_PROMPT
                + "\n\n"
                + language_instruction(language),
        }

    ]

    # -----------------------------------------------------
    # ADD CONVERSATION HISTORY
    # -----------------------------------------------------

    for item in request.conversation:

        role = item.role.strip()
        content = item.content.strip()

        if role not in {
            "user",
            "assistant"
        }:
            continue

        if not content:
            continue

        groq_messages.append(
            {
                "role": role,
                "content": content,
            }
        )

    # -----------------------------------------------------
    # ADD CURRENT MESSAGE ONLY IF NOT ALREADY LAST
    # -----------------------------------------------------

    if (
        len(groq_messages) == 1
        or groq_messages[-1]["role"] != "user"
        or groq_messages[-1]["content"] != message
    ):

        groq_messages.append(
            {
                "role": "user",
                "content": message,
            }
        )

    # -----------------------------------------------------
    # GROQ REQUEST
    # -----------------------------------------------------

    headers = {
        "Authorization":
            f"Bearer {GROQ_API_KEY}",

        "Content-Type":
            "application/json",
    }

    payload = {
        "model":
            GROQ_MODEL,

        "messages":
            groq_messages,

        "temperature":
            0.2,

        # Reasoning models spend part of this budget on
        # hidden reasoning tokens, so keep it generous.
        "max_tokens":
            1600,
    }

    # Reasoning models (gpt-oss, qwen3) accept this and
    # would otherwise burn the token budget before
    # producing any visible answer.
    if any(
        tag in GROQ_MODEL
        for tag in ("gpt-oss", "qwen3")
    ):
        payload["reasoning_effort"] = "low"

    try:

        async with httpx.AsyncClient(
            timeout=60.0
        ) as client:

            response = await client.post(
                GROQ_URL,
                headers=headers,
                json=payload,
            )

    except httpx.RequestError as exc:

        log(f"[groq] connection error: {exc!r}")

        raise HTTPException(
            status_code=502,
            detail=(
                "Unable to connect to the Groq AI service."
            )
        ) from exc

    # -----------------------------------------------------
    # HANDLE GROQ ERROR
    # -----------------------------------------------------

    if response.status_code >= 400:

        try:

            error_data = response.json()

        except Exception:

            error_data = {}

        error_object = error_data.get(
            "error",
            {}
        )

        if isinstance(
            error_object,
            dict
        ):

            detail = error_object.get(
                "message",
                "Groq API request failed."
            )

        else:

            detail = "Groq API request failed."

        log(
            f"[groq] {response.status_code} "
            f"model={GROQ_MODEL}: {detail}"
        )

        raise HTTPException(
            status_code=502,
            detail=detail
        )

    # -----------------------------------------------------
    # PARSE RESPONSE
    # -----------------------------------------------------

    try:

        data = response.json()

        choices = data.get(
            "choices",
            []
        )

        if not choices:

            raise ValueError(
                "No choices returned by Groq."
            )

        assistant_message = choices[0].get(
            "message",
            {}
        )

        assistant_response = (
            assistant_message.get("content")
            or ""
        ).strip()

        # Reasoning models sometimes return the answer
        # only in the reasoning field when the token
        # budget runs out mid-answer.
        if not assistant_response:

            assistant_response = (
                assistant_message.get("reasoning")
                or ""
            ).strip()

    except Exception as exc:

        log(f"[groq] invalid response: {exc!r}")

        raise HTTPException(
            status_code=502,
            detail=(
                "The AI service returned an invalid response."
            )
        ) from exc

    # -----------------------------------------------------
    # EMPTY RESPONSE
    # -----------------------------------------------------

    if not assistant_response:

        raise HTTPException(
            status_code=502,
            detail=(
                "The AI service returned an empty response."
            )
        )

    # -----------------------------------------------------
    # EMERGENCY PREFIX
    # -----------------------------------------------------

    if emergency:

        emergency_messages = {

            "English":
                "⚠️ **Emergency warning:** Based on what you described, you may need immediate medical attention. If the symptoms are severe or worsening, call **112** or go to the nearest emergency department immediately.\n\n",

            "Hindi":
                "⚠️ **आपातकालीन चेतावनी:** आपके बताए लक्षणों के आधार पर आपको तुरंत चिकित्सा सहायता की आवश्यकता हो सकती है। यदि लक्षण गंभीर हैं या बढ़ रहे हैं, तो **112** पर कॉल करें या तुरंत नज़दीकी आपातकालीन विभाग में जाएँ।\n\n",

            "Marathi":
                "⚠️ **आपत्कालीन सूचना:** तुम्ही सांगितलेल्या लक्षणांनुसार तुम्हाला तातडीने वैद्यकीय मदतीची आवश्यकता असू शकते. लक्षणे गंभीर असतील किंवा वाढत असतील तर **112** वर कॉल करा किंवा तात्काळ जवळच्या आपत्कालीन विभागात जा.\n\n",

            "Punjabi":
                "⚠️ **ਐਮਰਜੈਂਸੀ ਚੇਤਾਵਨੀ:** ਤੁਹਾਡੇ ਦੱਸੇ ਲੱਛਣਾਂ ਦੇ ਆਧਾਰ 'ਤੇ ਤੁਹਾਨੂੰ ਤੁਰੰਤ ਡਾਕਟਰੀ ਸਹਾਇਤਾ ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ। ਜੇ ਲੱਛਣ ਗੰਭੀਰ ਹਨ ਜਾਂ ਵੱਧ ਰਹੇ ਹਨ, ਤਾਂ **112** ਤੇ ਕਾਲ ਕਰੋ ਜਾਂ ਤੁਰੰਤ ਨੇੜਲੇ ਐਮਰਜੈਂਸੀ ਵਿਭਾਗ ਵਿੱਚ ਜਾਓ।\n\n",

            "Bengali":
                "⚠️ **জরুরি সতর্কতা:** আপনি যে উপসর্গগুলি বলেছেন, তার ভিত্তিতে আপনার অবিলম্বে চিকিৎসা সহায়তার প্রয়োজন হতে পারে। উপসর্গ গুরুতর হলে বা বাড়তে থাকলে **112** নম্বরে কল করুন অথবা দ্রুত নিকটস্থ জরুরি বিভাগে যান।\n\n",
        }

        assistant_response = (
            emergency_messages.get(
                language,
                emergency_messages["English"]
            )
            + assistant_response
        )

    # -----------------------------------------------------
    # RETURN
    # -----------------------------------------------------

    return ChatResponse(
        response=assistant_response,
        emergency=emergency,
    )
# 🏥 RuralCare AI

### Agentic AI-Powered Healthcare Triage Assistant for Rural & Semi-Urban India

<p align="center">

**Making preliminary healthcare navigation more accessible through Agentic AI, Voice AI, Multilingual NLP, and Intelligent Workflow Orchestration.**

<br/>

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge\&logo=fastapi\&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic%20AI-1C3C3C?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-LLM%20Inference-F55036?style=for-the-badge)
![Whisper](https://img.shields.io/badge/Whisper-Speech%20to%20Text-412991?style=for-the-badge)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=for-the-badge\&logo=githubactions\&logoColor=white)

</p>

---

## 🌍 The Problem

Access to timely healthcare guidance remains challenging for many rural and semi-urban communities.

Users may face:

* Limited access to healthcare professionals
* Long travel distances to healthcare facilities
* Language barriers
* Low digital literacy
* Difficulty describing symptoms
* Delays in identifying situations requiring urgent attention
* Limited availability of healthcare navigation services

Traditional healthcare applications often assume that users can type detailed medical information in English and already know which healthcare service they need.

**RuralCare AI approaches the problem differently.**

It provides a conversational, multilingual, voice-enabled interface that collects relevant information and uses an **agentic AI workflow** to determine the appropriate level of urgency and guide the user toward the next step.

> **RuralCare AI is designed for healthcare navigation and preliminary triage — not medical diagnosis.**

---

# 💡 What is RuralCare AI?

**RuralCare AI** is an agentic healthcare triage prototype built using **FastAPI, LangGraph, LangChain, Groq, and OpenAI Whisper**.

The system transforms a simple user statement such as:

> *"I have been having severe chest discomfort since morning."*

into a structured workflow:

```text
User Input
    ↓
Language / Conversation Context
    ↓
Planner Agent
    ↓
Missing Information?
    ├── YES → Clarification Question
    │
    └── NO
          ↓
      Triage Agent
          ↓
   Urgency Classification
          ↓
   Scheduler Agent
          ↓
   Structured Response
```

Instead of relying on a single LLM prompt, RuralCare AI separates responsibilities across specialized AI agents.

---

# 🧠 Core Concept — Agentic Healthcare Workflow

The key architectural principle is:

> **One agent should not be responsible for everything.**

RuralCare AI therefore decomposes the healthcare interaction into specialized stages.

### Agent Architecture

```text
                         ┌──────────────────────┐
                         │        PATIENT       │
                         │ Text / Voice Input   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI API     │
                         │ Request / Validation │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
                    ▼                               ▼
           ┌────────────────┐              ┌────────────────┐
           │ Voice Service  │              │ Conversation   │
           │    Whisper     │              │    Context     │
           └───────┬────────┘              └───────┬────────┘
                   │                               │
                   └───────────────┬───────────────┘
                                   ▼
                       ┌────────────────────────┐
                       │       LangGraph        │
                       │ Agent Orchestration    │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │     Planner Agent      │
                       │                        │
                       │ Identify missing       │
                       │ information            │
                       └───────────┬────────────┘
                                   │
                         ┌─────────┴─────────┐
                         │                   │
                         ▼                   ▼
                Missing Information     Sufficient Data
                         │                   │
                         ▼                   ▼
                Clarification         Triage Agent
                  Question                 │
                                           ▼
                                  Urgency Assessment
                                           │
                                           ▼
                                    Scheduler Agent
                                           │
                                           ▼
                                    Final Response
```

---

# 🤖 AI Agents

## 1. 🧭 Planner Agent

The Planner Agent acts as the **information-gathering and workflow-control layer**.

Its primary responsibility is to determine whether enough relevant information has been collected before the system performs triage.

### Responsibilities

* Understand the user's primary complaint
* Identify missing information
* Determine whether clarification is required
* Ask targeted follow-up questions
* Prevent premature triage

### Example

User:

> "I have stomach pain."

The Planner Agent may identify missing information such as:

```text
• Duration
• Severity
• Location
• Associated symptoms
• Vomiting / diarrhea
• Fever
```

Instead of immediately producing a triage result, the system asks for the information that materially improves the next step.

---

# 🩺 2. Triage Agent

Once sufficient information is available, the Triage Agent evaluates the situation using the available symptom context.

The system classifies urgency into three levels:

| Level          | Meaning                                                            |
| -------------- | ------------------------------------------------------------------ |
| 🔴 `EMERGENCY` | Immediate professional/emergency medical attention may be required |
| 🟠 `URGENT`    | Prompt assessment by a healthcare professional is appropriate      |
| 🟢 `ROUTINE`   | No obvious emergency identified from the available information     |

### Important Design Principle

The Triage Agent is **not designed to diagnose diseases**.

It focuses on:

```text
Symptoms
    ↓
Risk Indicators
    ↓
Urgency
    ↓
Recommended Next Step
```

rather than:

```text
Symptoms
    ↓
Disease Diagnosis
```

---

# 📅 3. Scheduler Agent

The Scheduler Agent handles the healthcare navigation layer after triage.

It can:

* Determine whether professional follow-up is appropriate
* Retrieve available appointment slots
* Present appointment options
* Support future integration with healthcare-provider systems

The current implementation uses a **mock scheduling service**, allowing the project to operate independently of an external hospital appointment platform.

This architecture makes it possible to later integrate:

```text
RuralCare AI
      ↓
Healthcare Provider API
      ↓
Hospital / Clinic
      ↓
Doctor Availability
      ↓
Appointment Booking
```

---

# 🔄 LangGraph Workflow

RuralCare AI uses **LangGraph** to orchestrate the agent workflow.

The workflow is intentionally state-driven.

```text
START
  │
  ▼
Planner
  │
  ├──────── Missing Information ────────► Clarification
  │                                           │
  │                                           ▼
  │                                          END
  │
  └──────── Sufficient Information
                  │
                  ▼
                Triage
                  │
                  ▼
              Scheduler
                  │
                  ▼
            Final Response
                  │
                  ▼
                 END
```

This approach provides several advantages:

* Explicit workflow control
* Separation of agent responsibilities
* Easier debugging
* Better observability
* Extensible architecture
* Deterministic routing around LLM decisions
* Easier testing of individual components

---

# 🎙️ Voice AI Architecture

RuralCare AI supports voice-based interaction through **OpenAI Whisper**.

```text
                 USER
                   │
                   │ Voice
                   ▼
            Audio Upload
                   │
                   ▼
          FastAPI Voice API
                   │
                   ▼
             Whisper STT
                   │
                   ▼
           Transcribed Text
                   │
                   ▼
          Agentic AI Workflow
                   │
                   ▼
             Triage Result
```

This is particularly important for users who may find typing difficult or prefer speaking in their native language.

---

# 🌐 Multilingual Architecture

RuralCare AI is designed with multilingual interaction in mind.

### Current supported languages

* 🇬🇧 English
* 🇮🇳 Hindi
* 🇮🇳 Marathi
* 🇮🇳 Punjabi
* 🇮🇳 Bengali

The selected language is maintained as part of the conversation context.

Changing the language does **not require deleting the conversation**.

### Future Expansion

The architecture can be extended to:

* Tamil
* Telugu
* Gujarati
* Kannada
* Malayalam
* Odia
* Assamese
* Urdu
* Other Indian regional languages

---

# 🏗️ Technical Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                         USER LAYER                          │
│                                                             │
│       Text Input        Voice Input        Language         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                     │
│                                                             │
│                   HTML / CSS / JavaScript                   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                           │
│                                                             │
│                         FastAPI                             │
│                                                             │
│   /api/chat   /api/triage   /api/voice   /api/appointments │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    AI ORCHESTRATION LAYER                   │
│                                                             │
│                         LangGraph                           │
│                             │                               │
│       ┌─────────────────────┼─────────────────────┐         │
│       ▼                     ▼                     ▼         │
│    Planner                Triage              Scheduler    │
│     Agent                 Agent                  Agent      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      AI SERVICES LAYER                      │
│                                                             │
│               Groq LLM          OpenAI Whisper              │
│                                                             │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                            │
│                                                             │
│                SQLAlchemy / SQLite                         │
│                                                             │
│        Patients • Consultations • Appointments             │
└─────────────────────────────────────────────────────────────┘
```

---

# 🧰 Technology Stack

| Category             | Technology            |
| -------------------- | --------------------- |
| Programming Language | Python                |
| Backend Framework    | FastAPI               |
| Agent Orchestration  | LangGraph             |
| LLM Framework        | LangChain             |
| LLM Inference        | Groq                  |
| Speech-to-Text       | OpenAI Whisper        |
| Frontend             | HTML, CSS, JavaScript |
| Data Validation      | Pydantic              |
| ORM                  | SQLAlchemy            |
| Database             | SQLite                |
| Async Database       | aiosqlite             |
| API Documentation    | OpenAPI / Swagger     |
| Testing              | pytest                |
| CI/CD                | GitHub Actions        |
| Containerization     | Docker                |

---

# 📂 Project Structure

```text
rural-healthcare-triage/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── backend/
│   │
│   ├── app/
│   │   │
│   │   ├── agents/
│   │   │   ├── planner.py
│   │   │   ├── triage.py
│   │   │   └── scheduler.py
│   │   │
│   │   ├── api/
│   │   │   ├── chat.py
│   │   │   ├── triage.py
│   │   │   ├── appointments.py
│   │   │   └── voice.py
│   │   │
│   │   ├── graph/
│   │   │   ├── state.py
│   │   │   └── workflow.py
│   │   │
│   │   ├── services/
│   │   │   ├── llm.py
│   │   │   ├── speech_to_text.py
│   │   │   ├── text_to_speech.py
│   │   │   └── scheduling.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── chat.py
│   │   │   ├── triage.py
│   │   │   └── appointment.py
│   │   │
│   │   ├── models/
│   │   │   ├── patients.py
│   │   │   ├── consultation.py
│   │   │   └── appointment.py
│   │   │
│   │   ├── static/
│   │   ├── templates/
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── tests/
│   │   ├── test_health.py
│   │   └── test_schemas.py
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pytest.ini
│   └── .env.example
│
├── .github/
├── .env.example
├── .gitignore
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
├── docker-compose.yml
└── README.md
```

---

# 🔌 API Architecture

RuralCare AI exposes a REST API through FastAPI.

## Health Check

```http
GET /health
```

Used for application health monitoring.

---

## API Information

```http
GET /api
```

Returns application metadata and API status.

---

## Chat

```http
POST /api/chat
```

Example request:

```json
{
  "message": "I have had a fever since yesterday.",
  "language": "English",
  "conversation_id": null,
  "messages": [],
  "collected_symptoms": {}
}
```

---

## Triage

```http
POST /api/triage
```

Processes structured symptom information and returns an urgency assessment.

---

## Appointment Slots

```http
GET /api/appointments/slots
```

Retrieves available appointment options from the scheduling service.

---

## Appointment Booking

```http
POST /api/appointments/book
```

Books an available appointment slot.

---

## Voice Transcription

```http
POST /api/voice/transcribe
```

Accepts audio input and returns the Whisper-generated transcription.

---

# 📖 API Documentation

Once the application is running:

### Swagger UI

```text
http://localhost:8000/docs
```

### ReDoc

```text
http://localhost:8000/redoc
```

FastAPI automatically generates the OpenAPI specification from the application's route definitions and Pydantic schemas.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Python 3.11+
* Git
* Docker *(optional)*
* Groq API key
* OpenAI API key for Whisper functionality

---

## 1. Clone the Repository

```bash
git clone https://github.com/<YOUR-USERNAME>/rural-healthcare-triage.git

cd rural-healthcare-triage
```

---

## 2. Create Virtual Environment

### Windows

```bash
cd backend

python -m venv .venv

.venv\Scripts\activate
```

### macOS / Linux

```bash
cd backend

python3 -m venv .venv

source .venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install --upgrade pip

pip install -r requirements.txt

pip install pytest
```

---

# 🔐 Environment Configuration

Create your environment file:

### Windows

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Configure:

```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key

APP_ENV=development
DEBUG=true

LLM_MODEL=openai/gpt-oss-120b

DATABASE_URL=sqlite+aiosqlite:///./rural_healthcare.db
```

### ⚠️ Never commit `.env`

The repository contains `.env.example` so developers know which environment variables are required without exposing credentials.

---

# ▶️ Running the Application

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

Application:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# 🐳 Docker Deployment

Build and run the application using Docker Compose:

```bash
docker compose up --build
```

The application will be available at:

```text
http://localhost:8000
```

Stop the containers:

```bash
docker compose down
```

---

# 🧪 Testing

Run the automated tests:

```bash
cd backend

pytest -q
```

Compile-check the application:

```bash
python -m compileall app
```

The repository also includes a GitHub Actions workflow that automatically performs these checks when code is pushed to the main branch or submitted through a pull request.

---

# 🔄 CI Pipeline

```text
Developer
    │
    ▼
git push / Pull Request
    │
    ▼
GitHub Actions
    │
    ├── Checkout
    │
    ├── Setup Python
    │
    ├── Install Dependencies
    │
    ├── Compile Python
    │
    └── Run pytest
            │
            ▼
       Build Validation
```

This creates a foundation for adding more advanced CI/CD stages such as:

* Docker image builds
* Security scanning
* Dependency vulnerability checks
* Integration tests
* Deployment automation

---

# 🛡️ Healthcare Safety Architecture

Healthcare AI requires stronger safeguards than a conventional chatbot.

RuralCare AI therefore follows a **safety-first architectural approach**.

### Safety principles

```text
                 USER
                   │
                   ▼
           Input Validation
                   │
                   ▼
        Emergency Pattern Checks
                   │
                   ▼
             Planner Agent
                   │
                   ▼
             Triage Agent
                   │
                   ▼
        Structured Urgency Level
                   │
                   ▼
          Human Healthcare Path
```

### Current safeguards include

* No intentional disease diagnosis
* No medication prescribing
* No medication dosage generation
* Emergency escalation messaging
* Structured urgency categories
* Clarification before triage where important information is missing
* Conservative handling of failed structured model output
* Separation between LLM reasoning and application workflow
* No fabricated healthcare facilities or clinical records

---

# 🚨 Emergency Handling

The application includes emergency-pattern detection outside the LLM workflow.

This is important because critical safety behavior should not depend entirely on generative model output.

Conceptually:

```text
User Message
     │
     ▼
Emergency Signal Detection
     │
 ┌───┴────┐
 │        │
 ▼        ▼
Detected  Not Detected
 │             │
 ▼             ▼
Escalation    Normal
Response      Workflow
```

This layered approach provides an additional deterministic safety mechanism around the probabilistic LLM component.

---

# 🧩 Why Agentic AI?

A conventional chatbot might operate like:

```text
User → LLM → Response
```

RuralCare AI uses:

```text
User
 ↓
Planner
 ↓
Triage
 ↓
Scheduler
 ↓
Response
```

This allows individual components to have clearly defined responsibilities.

### Benefits

**Modularity**

Each agent can be developed and tested independently.

**Control**

The application determines workflow transitions instead of allowing the LLM to control the entire application.

**Extensibility**

Additional agents can be added without redesigning the complete system.

**Observability**

Individual stages can be monitored and evaluated.

**Maintainability**

Business logic, AI logic, API logic, and external services remain separated.

---

# 🔮 Future Architecture

The current project is a prototype foundation. A production-oriented implementation could evolve toward:

```text
                    RuralCare AI
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
       ▼                 ▼                 ▼
   AI Triage        Voice AI        Healthcare Search
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
                         ▼
                  Clinical Safety
                         │
                         ▼
               Human Clinician Layer
                         │
                         ▼
               Verified Healthcare
                   Infrastructure
```

Potential future components:

* Verified hospital directory
* Real-time doctor availability
* Telemedicine integration
* Human clinician escalation
* Offline-first interaction
* Low-bandwidth mode
* Regional healthcare routing
* Multilingual TTS
* Persistent conversation history
* Authentication and authorization
* Encrypted data storage
* Audit logging
* Model observability
* Clinical evaluation framework

---

# 📊 Potential Production Evolution

| Prototype               | Production Direction              |
| ----------------------- | --------------------------------- |
| SQLite                  | PostgreSQL                        |
| Mock appointments       | Hospital scheduling APIs          |
| Basic authentication    | OAuth2 / RBAC                     |
| Local database          | Encrypted managed database        |
| Basic logs              | Centralized observability         |
| LLM-only interpretation | LLM + deterministic safety layer  |
| Mock healthcare data    | Verified healthcare directory     |
| Development deployment  | Containerized cloud deployment    |
| Prototype evaluation    | Formal clinical safety evaluation |

---

# 🔒 Security & Privacy

This project is designed as a prototype and should **not be used with real patient data in production** without appropriate safeguards.

Production deployment would require:

* Authentication
* Authorization
* Encryption in transit
* Encryption at rest
* Secure secret management
* Audit logs
* Consent management
* Data retention policies
* Data deletion mechanisms
* Rate limiting
* Input sanitization
* Access controls
* Monitoring and incident response

### Never commit

```text
.env
API keys
Passwords
Patient records
Personal identifiers
Medical reports
Voice recordings
Production databases
```

---

# 🧑‍💻 GitHub Development Workflow

Initialize Git:

```bash
git init
```

Create main branch:

```bash
git branch -M main
```

Stage files:

```bash
git add .
```

Commit:

```bash
git commit -m "feat: initialize RuralCare AI"
```

Connect remote repository:

```bash
git remote add origin https://github.com/<YOUR-USERNAME>/rural-healthcare-triage.git
```

Push:

```bash
git push -u origin main
```

---

# 📝 Recommended Commit Convention

Use conventional commit prefixes:

```text
feat:     New functionality
fix:      Bug fix
refactor: Code restructuring
test:     Tests
docs:     Documentation
chore:    Maintenance
perf:     Performance improvement
security: Security-related changes
```

Examples:

```bash
git commit -m "feat: add multilingual triage workflow"

git commit -m "feat: integrate Whisper speech recognition"

git commit -m "fix: handle invalid triage output"

git commit -m "test: add planner workflow tests"

git commit -m "docs: improve architecture documentation"
```

---

# 📈 Roadmap

## Phase 1 — Core Prototype

* [x] FastAPI backend
* [x] LangGraph workflow
* [x] Planner Agent
* [x] Triage Agent
* [x] Scheduler Agent
* [x] Conversation context
* [x] Multilingual text support
* [x] Whisper speech recognition
* [x] Mock appointment service

## Phase 2 — Engineering

* [x] Automated testing foundation
* [x] GitHub Actions CI
* [x] Docker configuration
* [x] Environment configuration
* [x] Security documentation
* [ ] Expanded integration tests
* [ ] Structured LLM output validation
* [ ] Better observability

## Phase 3 — Healthcare Infrastructure

* [ ] Verified healthcare-provider directory
* [ ] Real appointment APIs
* [ ] Telemedicine integration
* [ ] Human clinician escalation
* [ ] Regional healthcare routing

## Phase 4 — Accessibility

* [ ] Additional Indian languages
* [ ] Multilingual TTS
* [ ] Offline/low-bandwidth mode
* [ ] Voice-first UX
* [ ] Accessibility improvements

## Phase 5 — Production Readiness

* [ ] PostgreSQL
* [ ] Authentication
* [ ] Authorization
* [ ] Encryption
* [ ] Audit logging
* [ ] Monitoring
* [ ] Clinical safety evaluation
* [ ] Formal privacy/compliance review

---

# 🎯 Project Objectives

The project explores how modern AI technologies can work together to address a real-world accessibility problem.

### Primary objectives

1. Build a conversational healthcare navigation interface.
2. Use agentic AI rather than a monolithic chatbot architecture.
3. Support multilingual interaction.
4. Enable voice-based input.
5. Identify potentially urgent situations.
6. Collect missing information before triage.
7. Connect users to appointment workflows.
8. Maintain clear human oversight boundaries.
9. Create an architecture that can evolve toward real healthcare infrastructure.

---

# 💼 Why This Project Matters

RuralCare AI brings together several important areas of modern technology:

```text
Artificial Intelligence
        +
Large Language Models
        +
Agentic AI
        +
Speech AI
        +
Multilingual NLP
        +
Workflow Orchestration
        +
Healthcare Technology
        +
API Engineering
        +
Cloud / Deployment
```

The project therefore serves not only as a healthcare prototype, but also as an exploration of how **agentic AI systems can be designed around real-world constraints, safety requirements, and human workflows.**

---

# 📚 Learning & Technical Concepts Demonstrated

This project demonstrates practical implementation of:

* Agentic AI
* LLM application development
* LangGraph state machines
* LangChain
* Prompt engineering
* FastAPI REST APIs
* Pydantic schema validation
* Async Python
* Speech-to-text
* Multilingual AI
* Conversation state management
* Service-layer architecture
* Database modeling
* Docker
* GitHub Actions
* Automated testing
* API documentation
* AI safety design

---

# ⚠️ Medical Disclaimer

> **RuralCare AI is a research and technology prototype. It is not a medical diagnosis system, emergency service, or replacement for a qualified healthcare professional.**

The system may produce incorrect or incomplete information.

Users experiencing a potential medical emergency should seek appropriate emergency medical care immediately rather than relying on this application.

Any real-world clinical deployment would require appropriate medical, legal, privacy, security, regulatory, and clinical-safety review.

---

# 📜 License

This project is released under the **MIT License**.

See [`LICENSE`](LICENSE) for details.

---

# 🤝 Contributing

Contributions are welcome.

Before contributing, please read:

[`CONTRIBUTING.md`](CONTRIBUTING.md)

For security-related concerns:

[`SECURITY.md`](SECURITY.md)

---

# ⭐ If You Find This Project Interesting

Consider giving the repository a ⭐ on GitHub.

The project explores the intersection of:

**AI × Healthcare × Agentic Systems × Accessibility × India**

---

<p align="center">

### 🏥 RuralCare AI

**Building technology that helps people navigate healthcare — one conversation at a time.**

</p>

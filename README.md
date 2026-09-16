# Rural Healthcare Triage Assistant

An agentic healthcare triage prototype designed
for rural and semi-urban users in India.

## Architecture

Patient
↓
Web Interface
↓
FastAPI
↓
LangGraph
↓
Planner Agent
↓
Triage Agent
↓
Scheduling Agent
↓
Response

Voice:

Microphone
↓
Whisper
↓
Text
↓
LangGraph
↓
Response


## Features

- Chat-based healthcare interaction
- Hindi/English language support
- Planner agent
- Triage agent
- Scheduling agent
- LangGraph orchestration
- FastAPI backend
- React frontend
- Voice input architecture
- Appointment architecture
- Render deployment configuration


## Local setup

### Backend

cd backend

python -m venv venv

Windows PowerShell:

.\venv\Scripts\Activate.ps1

Install:

pip install -r requirements.txt

Create `.env`:

GROQ_API_KEY=your_key

OPENAI_API_KEY=your_key

Start:

python -m uvicorn app.main:app --reload


### Frontend

cd frontend

npm install

npm run dev


Frontend:

http://localhost:5173

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs
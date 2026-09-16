# Rural Healthcare Triage Assistant

An agentic healthcare triage prototype designed
for rural and semi-urban users in India.

## Architecture

Patient
↓
Web Interface
↓
FastAPI API
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
- Standalone frontend
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

The frontend is plain HTML, CSS, and JavaScript, so it has no install or build step.

From the repository root, run `python -m http.server 5173 --directory frontend`.
Set `window.RURALCARE_API_URL` in `frontend/config.js` to the deployed backend URL
before deploying the frontend.


Frontend:

http://localhost:5173

Backend:

http://127.0.0.1:8000

Swagger:

http://127.0.0.1:8000/docs

## Vercel deployment

Create a Vercel project from this repository and set its **Root Directory** to
`frontend`. The frontend can be deployed as a static project with no build command
and `.` as the output directory.

Deploy the `backend` separately as a Python service (for example on Render), then
set that service URL in `frontend/config.js` and add both the Vercel URL and local
frontend URLs to the backend `ALLOWED_ORIGINS` environment variable. Both folders
remain in the same repository and can be deployed from one commit.
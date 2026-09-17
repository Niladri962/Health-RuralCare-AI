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

Create `backend/.env` by copying `backend/.env.example`, then add your Groq key:

GROQ_API_KEY=your_key

OPENAI_API_KEY=your_key

The chat endpoint returns an error until `GROQ_API_KEY` is configured. Never commit
`backend/.env` or publish the key in the frontend.

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

### Start both locally with one PowerShell command

Run this from the repository root:

```powershell
Start-Process -FilePath (Resolve-Path .\venv\Scripts\python.exe).Path -ArgumentList '-m','uvicorn','app.main:app','--reload' -WorkingDirectory (Resolve-Path .\backend).Path; & .\venv\Scripts\python.exe -m http.server 5173 --directory .\frontend
```

The backend runs at `http://127.0.0.1:8000` and the frontend at
`http://localhost:5173`. Running `python -m uvicorn app.main:app` from the
repository root alone fails because the `app` package is inside `backend`.

## Vercel deployment

Create one Vercel project from the repository root. Do not set `frontend` as the
Root Directory. Vercel uses `vercel.json` to serve `frontend/` and route `/api/*`
to the FastAPI function in `api/index.py`.

In the Vercel project settings, add:

```text
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

Then deploy once. The frontend automatically calls `/api/chat` on the same Vercel
domain, so no frontend API URL needs to be changed after deployment. The same
repository still works locally with the one-command startup above.
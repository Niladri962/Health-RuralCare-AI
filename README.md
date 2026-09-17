# 🏥 RuralCare AI
## Rural Healthcare Triage Assistant

<p align="center">
  <strong>An AI-powered, multilingual, agentic healthcare triage assistant designed for rural and semi-urban communities in India.</strong>
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-Agentic%20AI-orange)
![Groq](https://img.shields.io/badge/Groq-LLM-purple)
![Whisper](https://img.shields.io/badge/Whisper-Speech--to--Text-green)
![JavaScript](https://img.shields.io/badge/JavaScript-Frontend-F7DF1E?logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)
![GitHub](https://img.shields.io/badge/Repository-GitHub-181717?logo=github)

</p>

---

# 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Complete System Architecture](#-complete-system-architecture)
- [AI Agents Architecture](#-ai-agents-architecture)
- [Planner Agent](#-1-planner-agent)
- [Triage Agent](#-2-triage-agent)
- [Scheduling Agent](#-3-scheduling-agent)
- [Agent Communication Flow](#-agent-communication-flow)
- [Conversation Memory Architecture](#-conversation-memory-architecture)
- [Multilingual Architecture](#-multilingual-architecture)
- [Voice AI Architecture](#-voice-ai-architecture)
- [Emergency Detection Architecture](#-emergency-detection-architecture)
- [Healthcare Navigation Architecture](#-healthcare-navigation-architecture)
- [API Architecture](#-api-architecture)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Deployment Architecture](#-deployment-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Local Installation](#-local-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [API Endpoints](#-api-endpoints)
- [Git and GitHub Commands](#-git-and-github-commands)
- [Vercel Deployment](#-vercel-deployment)
- [Troubleshooting](#-troubleshooting)
- [Security and Privacy](#-security-and-privacy)
- [Responsible AI](#-responsible-ai)
- [Current Project Status](#-current-project-status)
- [Future Scope](#-future-scope)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Medical Disclaimer](#-medical-disclaimer)
- [Project Information](#-project-information)

---

# 🏥 About the Project

**RuralCare AI** is an AI-powered healthcare triage prototype designed to explore how conversational AI and agentic systems can improve access to preliminary healthcare guidance for rural and semi-urban communities in India.

The system allows users to communicate their symptoms through a conversational interface and is designed to support multiple Indian languages.

The project combines:

- Generative AI
- Large Language Models
- Agentic AI
- LangGraph
- FastAPI
- Groq
- Whisper
- Multilingual interaction
- Voice-based interaction
- Emergency awareness
- Healthcare navigation
- Appointment and scheduling architecture

The system is designed as a **first-level healthcare assistance and navigation layer**.

It does not replace doctors, nurses, hospitals, or professional medical services.

---

# 🌍 Problem Statement

Healthcare accessibility can be challenging for rural and semi-urban populations because of several factors:

- Limited availability of healthcare professionals
- Long distances to healthcare facilities
- Language barriers
- Limited awareness of available healthcare services
- Difficulty describing symptoms
- Difficulty understanding urgency
- Delays in seeking appropriate medical attention
- Limited access to digital healthcare tools

A user may experience symptoms without knowing:

> "Is this something I can monitor, should I consult a doctor, or do I need urgent medical attention?"

RuralCare AI explores how conversational and agentic AI can assist with this initial interaction.

---

# 💡 Proposed Solution

RuralCare AI provides a conversational healthcare interface through which a user can:

```text
Describe Symptoms
       ↓
AI Understands Context
       ↓
AI Asks Follow-up Questions
       ↓
Risk / Urgency Assessment
       ↓
Preliminary Triage Guidance
       ↓
Healthcare Navigation
       ↓
Professional Care / Referral

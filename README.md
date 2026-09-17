# 🏥 RuralCare AI — Rural Healthcare Triage Assistant

> An AI-powered, multilingual healthcare triage assistant designed to improve access to preliminary healthcare guidance for rural and semi-urban communities in India.

RuralCare AI is an **agentic healthcare triage prototype** that combines conversational AI, multilingual interaction, voice-input architecture, emergency awareness, and agent-based workflows.

The project explores how AI can assist users in describing their health concerns, understanding the potential urgency of their symptoms, and navigating toward appropriate healthcare support.

> ⚠️ **Important:** RuralCare AI is a prototype and does not replace doctors, healthcare professionals, diagnosis, or emergency medical services.

---

## 🌍 Problem Statement

People in rural and semi-urban communities can face several barriers when accessing healthcare, including:

- Limited availability of healthcare professionals
- Long distances to healthcare facilities
- Language barriers
- Limited awareness of healthcare options
- Difficulty understanding the urgency of symptoms
- Delays in seeking appropriate medical attention

RuralCare AI explores the use of conversational AI and agentic systems to provide an accessible first layer of healthcare guidance.

The objective is **not to replace healthcare professionals**, but to explore how AI can assist users before they reach appropriate medical care.

---

# 🚀 Key Features

### 💬 Conversational Healthcare Assistant

Users can describe their health concerns using natural language.

The assistant is designed to:

- Understand symptom descriptions
- Ask relevant follow-up questions
- Maintain conversation context
- Provide preliminary triage guidance
- Identify potentially urgent situations
- Guide users toward appropriate medical care

---

### 🌐 Multilingual Interaction

RuralCare AI is designed to support multiple Indian languages:

- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Marathi
- 🇮🇳 Punjabi
- 🇮🇳 Bengali

Users can change the language during an ongoing conversation while preserving their conversation history.

---

### 🧠 Agentic Healthcare Architecture

The project is designed around an agent-based workflow using **LangGraph**.

The proposed workflow is:

```text
                    User
                     │
                     ▼
              ┌─────────────┐
              │   Planner   │
              │    Agent    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   Triage    │
              │    Agent    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │ Scheduling  │
              │    Agent    │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │  Response   │
              └─────────────┘

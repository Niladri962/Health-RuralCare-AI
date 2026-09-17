# 🏥 RuralCare AI — Rural Healthcare Triage Assistant

> An AI-powered, multilingual healthcare triage assistant designed to improve access to preliminary healthcare guidance for rural and semi-urban communities in India.

RuralCare AI is an **agentic healthcare triage prototype** that uses conversational AI, multilingual interaction, voice input architecture, and an agent-based workflow to help users describe their health concerns and receive appropriate preliminary triage guidance.

The system is designed with a focus on **accessibility, simplicity, multilingual support, emergency awareness, and responsible AI-assisted healthcare guidance**.

---

## 🌍 Why RuralCare AI?

Access to healthcare can be challenging in rural and semi-urban regions because of:

- Limited availability of healthcare professionals
- Long travel distances to healthcare facilities
- Language barriers
- Limited awareness of healthcare options
- Difficulty determining the urgency of symptoms
- Delays in seeking appropriate medical attention

RuralCare AI explores how conversational AI and agentic workflows can assist users in the **initial healthcare triage process**.

The system does **not replace doctors or medical professionals**. Instead, it aims to provide preliminary guidance and help users understand what level of care may be appropriate.

---

# 🚀 Key Features

### 💬 Conversational Healthcare Assistant

Users can describe their symptoms and health concerns using a natural-language chat interface.

The assistant can:

- Understand symptom descriptions
- Ask relevant follow-up questions
- Maintain conversation context
- Provide preliminary triage guidance
- Highlight potentially urgent situations
- Recommend seeking professional medical care when appropriate

---

### 🌐 Multilingual Support

RuralCare AI is designed to support multiple Indian languages:

- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Marathi
- 🇮🇳 Punjabi
- 🇮🇳 Bengali

Users can change the language during a conversation while retaining their existing conversation history.

---

### 🧠 Agentic Architecture

The project is designed around an agent-based workflow using **LangGraph**.

The proposed workflow consists of:

```text
User
  ↓
Planner Agent
  ↓
Triage Agent
  ↓
Scheduling Agent
  ↓
Response

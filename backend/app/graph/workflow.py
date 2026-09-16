from langgraph.graph import (
    StateGraph,
    START,
    END,
)

from app.graph.state import TriageState

from app.agents.planner import planner_agent
from app.agents.triage import triage_agent
from app.agents.scheduler import scheduler_agent


def clarification_node(
    state: TriageState,
) -> dict:

    question = state.get(
        "clarification_question",
        "",
    )

    language = state.get(
        "language",
        "English",
    )

    if not question:

        if language.lower() == "hindi":
            question = (
                "कृपया अपने लक्षणों के बारे में "
                "थोड़ी और जानकारी दें।"
            )
        else:
            question = (
                "Could you provide a little more "
                "information about your symptoms?"
            )

    return {
        "final_response": question
    }


def final_response_node(
    state: TriageState,
) -> dict:

    level = state.get(
        "triage_level",
        "URGENT",
    )

    reason = state.get(
        "triage_reason",
        "",
    )

    action = state.get(
        "recommended_action",
        "",
    )

    if level == "EMERGENCY":

        response = (
            "⚠️ Your symptoms may require immediate "
            "medical attention.\n\n"
            "Please seek emergency medical care "
            "or contact your local emergency service "
            "now.\n\n"
            f"{reason}\n\n"
            f"{action}"
        )

    elif level == "URGENT":

        response = (
            "Your symptoms should be assessed by "
            "a healthcare professional soon.\n\n"
            f"{reason}\n\n"
            f"{action}"
        )

    else:

        response = (
            "Based on the information provided, "
            "there is no obvious sign of an emergency "
            "at this time.\n\n"
            f"{reason}\n\n"
            f"{action}"
        )

    response += (
        "\n\nThis assistant provides preliminary "
        "guidance only and does not replace a "
        "qualified healthcare professional."
    )

    return {
        "final_response": response
    }


def planner_router(
    state: TriageState,
):

    missing = state.get(
        "missing_information",
        [],
    )

    if missing:
        return "clarification"

    return "triage"


def build_triage_graph():

    graph = StateGraph(TriageState)

    graph.add_node(
        "planner",
        planner_agent,
    )

    graph.add_node(
        "clarification",
        clarification_node,
    )

    graph.add_node(
        "triage",
        triage_agent,
    )

    graph.add_node(
        "scheduler",
        scheduler_agent,
    )

    graph.add_node(
        "final_response",
        final_response_node,
    )

    graph.add_edge(
        START,
        "planner",
    )

    graph.add_conditional_edges(
        "planner",
        planner_router,
        {
            "clarification": "clarification",
            "triage": "triage",
        },
    )

    graph.add_edge(
        "clarification",
        END,
    )

    graph.add_edge(
        "triage",
        "scheduler",
    )

    graph.add_edge(
        "scheduler",
        "final_response",
    )

    graph.add_edge(
        "final_response",
        END,
    )

    return graph.compile()


triage_graph = build_triage_graph()
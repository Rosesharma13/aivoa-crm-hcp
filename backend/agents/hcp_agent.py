"""
LangGraph AI Agent for HCP Interaction Management
Tools: log_interaction, edit_interaction, search_hcp, suggest_followup, analyze_sentiment
LLM: Groq gemma2-9b-it
"""
import os
import json
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.tools import tool
from sqlalchemy import select, or_
from models.database import AsyncSessionLocal, Interaction, HCP
from datetime import datetime

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

llm = ChatGroq(
    model="gemma2-9b-it",
    api_key=GROQ_API_KEY,
    temperature=0.2,
)


# ─────────────────────────────────────────
# TOOL 1: Log Interaction
# ─────────────────────────────────────────
@tool
async def log_interaction(
    hcp_name: str,
    interaction_type: str,
    topics_discussed: str,
    outcomes: str,
    sentiment: str = "Neutral",
    attendees: str = "",
    materials_shared: str = "",
    samples_distributed: str = "",
    follow_up_actions: str = "",
) -> str:
    """
    Log a new HCP interaction to the database.
    Captures all interaction details and uses LLM to extract entities from free-text.
    Automatically generates AI follow-up suggestions based on interaction content.
    """
    async with AsyncSessionLocal() as session:
        # Use LLM to generate follow-up suggestions
        followup_prompt = f"""Based on this HCP interaction, suggest 3 specific follow-up actions:
HCP: {hcp_name}
Topics: {topics_discussed}
Outcomes: {outcomes}
Sentiment: {sentiment}

Return only a JSON list of 3 short action strings."""
        
        followup_response = llm.invoke([HumanMessage(content=followup_prompt)])
        ai_followups = followup_response.content

        interaction = Interaction(
            hcp_name=hcp_name,
            interaction_type=interaction_type,
            topics_discussed=topics_discussed,
            outcomes=outcomes,
            sentiment=sentiment,
            attendees=attendees,
            materials_shared=materials_shared,
            samples_distributed=samples_distributed,
            follow_up_actions=follow_up_actions,
            ai_suggested_followups=ai_followups,
            date=datetime.utcnow(),
        )
        session.add(interaction)
        await session.commit()
        await session.refresh(interaction)
        return json.dumps({
            "status": "success",
            "interaction_id": interaction.id,
            "hcp_name": hcp_name,
            "ai_suggested_followups": ai_followups,
            "message": f"Interaction with {hcp_name} logged successfully."
        })


# ─────────────────────────────────────────
# TOOL 2: Edit Interaction
# ─────────────────────────────────────────
@tool
async def edit_interaction(
    interaction_id: int,
    field: str,
    new_value: str,
) -> str:
    """
    Edit an existing HCP interaction record.
    Accepts natural language edits — e.g., 'change sentiment to positive' or 'update outcomes'.
    Parses edit intent and updates the correct database field.
    Supported fields: topics_discussed, outcomes, sentiment, follow_up_actions, attendees, materials_shared.
    """
    allowed_fields = {
        "topics_discussed", "outcomes", "sentiment",
        "follow_up_actions", "attendees", "materials_shared",
        "samples_distributed", "interaction_type"
    }
    
    if field not in allowed_fields:
        return json.dumps({"status": "error", "message": f"Field '{field}' not editable. Allowed: {list(allowed_fields)}"})

    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Interaction).where(Interaction.id == interaction_id)
        )
        interaction = result.scalar_one_or_none()
        
        if not interaction:
            return json.dumps({"status": "error", "message": f"Interaction {interaction_id} not found."})

        setattr(interaction, field, new_value)
        interaction.updated_at = datetime.utcnow()
        await session.commit()
        
        return json.dumps({
            "status": "success",
            "interaction_id": interaction_id,
            "updated_field": field,
            "new_value": new_value,
            "message": f"Interaction {interaction_id} updated successfully."
        })


# ─────────────────────────────────────────
# TOOL 3: Search HCP
# ─────────────────────────────────────────
@tool
async def search_hcp(query: str) -> str:
    """
    Search for Healthcare Professionals (HCPs) by name, specialty, hospital, or region.
    Supports fuzzy/partial matching. Returns matching HCPs with their details.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(HCP).where(
                or_(
                    HCP.name.ilike(f"%{query}%"),
                    HCP.specialty.ilike(f"%{query}%"),
                    HCP.hospital.ilike(f"%{query}%"),
                    HCP.region.ilike(f"%{query}%"),
                )
            ).limit(5)
        )
        hcps = result.scalars().all()
        
        if not hcps:
            return json.dumps({"status": "not_found", "message": f"No HCPs found for '{query}'"})
        
        return json.dumps({
            "status": "success",
            "count": len(hcps),
            "hcps": [
                {
                    "id": h.id,
                    "name": h.name,
                    "specialty": h.specialty,
                    "hospital": h.hospital,
                    "region": h.region,
                }
                for h in hcps
            ]
        })


# ─────────────────────────────────────────
# TOOL 4: Suggest Follow-up
# ─────────────────────────────────────────
@tool
async def suggest_followup(interaction_id: int) -> str:
    """
    Generate AI-powered follow-up recommendations for a past HCP interaction.
    Analyzes the interaction's topics, outcomes, and sentiment using Groq LLM.
    Returns 3 specific, actionable follow-up suggestions.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Interaction).where(Interaction.id == interaction_id)
        )
        interaction = result.scalar_one_or_none()
        
        if not interaction:
            return json.dumps({"status": "error", "message": f"Interaction {interaction_id} not found."})

        prompt = f"""You are a life sciences sales coach. Based on this HCP interaction, provide 3 specific follow-up actions.

HCP: {interaction.hcp_name}
Type: {interaction.interaction_type}
Topics Discussed: {interaction.topics_discussed}
Outcomes: {interaction.outcomes}
Sentiment: {interaction.sentiment}
Current Follow-up: {interaction.follow_up_actions}

Return ONLY a JSON object: {{"suggestions": ["action1", "action2", "action3"]}}"""

        response = llm.invoke([HumanMessage(content=prompt)])
        
        return json.dumps({
            "status": "success",
            "interaction_id": interaction_id,
            "hcp_name": interaction.hcp_name,
            "suggestions": response.content
        })


# ─────────────────────────────────────────
# TOOL 5: Analyze Sentiment
# ─────────────────────────────────────────
@tool
async def analyze_sentiment(text: str) -> str:
    """
    Analyze HCP sentiment from interaction notes using Groq LLM (gemma2-9b-it).
    Classifies sentiment as Positive, Neutral, or Negative with a confidence score.
    Helps field reps track and monitor HCP relationship health over time.
    """
    prompt = f"""Analyze the sentiment of this HCP interaction note from a pharmaceutical sales perspective.

Text: "{text}"

Classify as one of: Positive, Neutral, Negative
Also give a confidence score (0.0 to 1.0) and a brief reason.

Return ONLY JSON: {{"sentiment": "Positive|Neutral|Negative", "confidence": 0.85, "reason": "brief explanation"}}"""

    response = llm.invoke([HumanMessage(content=prompt)])
    
    return json.dumps({
        "status": "success",
        "input_text": text[:100] + "..." if len(text) > 100 else text,
        "analysis": response.content
    })


# ─────────────────────────────────────────
# LangGraph Agent Setup
# ─────────────────────────────────────────
tools = [log_interaction, edit_interaction, search_hcp, suggest_followup, analyze_sentiment]
llm_with_tools = llm.bind_tools(tools)

class AgentState(TypedDict):
    messages: Annotated[list, lambda x, y: x + y]


def agent_node(state: AgentState):
    system_msg = SystemMessage(content="""You are an AI assistant for a pharmaceutical CRM system, 
helping field representatives log and manage HCP (Healthcare Professional) interactions.

You have access to these tools:
1. log_interaction - Log a new HCP meeting/interaction
2. edit_interaction - Edit an existing interaction record  
3. search_hcp - Search for HCPs by name, specialty, or region
4. suggest_followup - Get AI follow-up suggestions for a past interaction
5. analyze_sentiment - Analyze sentiment from interaction notes

Always be helpful, precise, and professional. Extract relevant information from the user's message to use the correct tool.""")
    
    messages = [system_msg] + state["messages"]
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def should_continue(state: AgentState):
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END


tool_node = ToolNode(tools)

graph = StateGraph(AgentState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")

hcp_agent = graph.compile()


async def run_agent(user_message: str, history: list = []) -> str:
    """Run the LangGraph agent with a user message."""
    messages = history + [HumanMessage(content=user_message)]
    result = await hcp_agent.ainvoke({"messages": messages})
    last = result["messages"][-1]
    return last.content if hasattr(last, "content") else str(last)

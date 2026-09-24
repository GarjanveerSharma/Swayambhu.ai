"""
Automatic model selection: har sawaal ke liye sahi model chunna.
Abhi simple rules hain. Baad me isme classifier laga sakte hain.
"""
from dataclasses import dataclass

from app.core.config import get_settings

# Aise words aayein to sawaal "complex" maana jayega
COMPLEX_HINTS = (
    "explain", "compare", "analyse", "analyze", "why", "difference", "design",
    "calculate", "step by step", "summar", "report",
    "samjhao", "kyu", "kyun", "fark", "vishleshan",
)
LONG_QUERY_CHARS = 200


@dataclass
class ModelChoice:
    name: str
    reason: str


def choose_model(message: str, mode: str) -> ModelChoice:
    s = get_settings()

    if mode == "fast":
        return ModelChoice(s.model_fast, "Fast mode selected")
    if mode == "smart":
        return ModelChoice(s.model_reasoning, "Smart mode selected")

    # mode == "auto"
    text = message.lower()
    if len(message) > LONG_QUERY_CHARS:
        return ModelChoice(s.model_reasoning, "Long query")
    if any(h in text for h in COMPLEX_HINTS):
        return ModelChoice(s.model_reasoning, "Complex query")
    return ModelChoice(s.model_fast, "Simple query")
"""
Air-gap ke liye: libraries ko internet use karne se rokta hai.
Ye function app start hone se PEHLE chalna chahiye (main.py me sabse upar).
"""
import os

OFFLINE_ENV = {
    # HuggingFace libraries internet se model download na karein
    "HF_HUB_OFFLINE": "1",
    "TRANSFORMERS_OFFLINE": "1",
    "HF_DATASETS_OFFLINE": "1",
    "HF_HUB_DISABLE_TELEMETRY": "1",
    # Doosri libraries ki telemetry band
    "ANONYMIZED_TELEMETRY": "False",
    "DO_NOT_TRACK": "1",
    "LANGCHAIN_TRACING_V2": "false",
}


def enforce_offline() -> None:
    for key, value in OFFLINE_ENV.items():
        os.environ[key] = value
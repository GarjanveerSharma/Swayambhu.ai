"""
Frontend camelCase expect karta hai (chatId, uploadedAt),
Python me hum snake_case likhte hain (chat_id, uploaded_at).
Har response schema is CamelModel se banana, conversion apne aap ho jayega.
"""
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,   # Python code me snake_case naam se bhi bana sakte ho
        from_attributes=True,    # baad me database objects se seedha banane ke liye
    )
"""
Pages ko chhote tukdon (chunks) me todna.
Chhote tukde search me zyada sahi milte hain, aur model ki limit me fit hote hain.
"""
from dataclasses import dataclass

from app.core.config import get_settings


@dataclass
class Chunk:
    text: str
    page: int  # 1 se shuru


def chunk_pages(pages: list[str]) -> list[Chunk]:
    s = get_settings()
    size, overlap = s.rag_chunk_chars, s.rag_chunk_overlap
    chunks: list[Chunk] = []

    for page_no, page_text in enumerate(pages, 1):
        text = " ".join(page_text.split())  # extra spaces/newlines hatao
        start = 0
        while start < len(text):
            end = min(start + size, len(text))
            # Shabd ke beech me mat kaato: pichhle space pe ruko
            if end < len(text):
                space = text.rfind(" ", start + size // 2, end)
                if space != -1:
                    end = space
            piece = text[start:end].strip()
            if len(piece) > 20:  # bahut chhote tukde bekaar hain
                chunks.append(Chunk(text=piece, page=page_no))
            if end >= len(text):
                break
            start = max(end - overlap, start + 1)

    return chunks
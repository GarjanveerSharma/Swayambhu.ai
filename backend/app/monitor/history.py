"""
Har 30 second me outbound count note karta hai (last 10 minute ka record).
Frontend ka graph isi se banta hai.
"""
import asyncio
from collections import deque
from datetime import datetime

from app.monitor.connections import count_outbound, get_connections

SAMPLE_EVERY_SECONDS = 30
MAX_POINTS = 20  # 20 x 30s = 10 minute

_history: deque[tuple[datetime, int]] = deque(maxlen=MAX_POINTS)


def record_sample() -> int:
    outbound = count_outbound(get_connections())
    _history.append((datetime.now(), outbound))
    return outbound


def get_history() -> list[tuple[datetime, int]]:
    return list(_history)


async def sampler_loop() -> None:
    while True:
        try:
            # psutil blocking hai, isliye alag thread me chalao
            await asyncio.to_thread(record_sample)
        except Exception as exc:  # monitor kabhi crash na ho
            print(f"[network-monitor] sample failed: {exc}")
        await asyncio.sleep(SAMPLE_EVERY_SECONDS)
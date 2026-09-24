from dataclasses import asdict

from fastapi import APIRouter

from app.monitor.connections import count_outbound, get_connections
from app.monitor.history import get_history
from app.schemas.network import ConnectionOut, HistoryPoint, NetworkStatus

router = APIRouter(prefix="/network", tags=["network"])


@router.get("/status", response_model=NetworkStatus)
def network_status() -> NetworkStatus:
    connections = get_connections()
    outbound = count_outbound(connections)
    history = [
        HistoryPoint(time=t.strftime("%H:%M:%S"), outbound=n) for t, n in get_history()
    ]
    return NetworkStatus(
        outbound=outbound,
        air_gapped=outbound == 0,
        connections=[ConnectionOut(**asdict(c)) for c in connections],
        history=history,
    )
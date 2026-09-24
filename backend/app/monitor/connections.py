"""
Machine ke saare network connections padhta hai aur batata hai
ki koi connection internet (bahar) ki taraf to nahi ja raha.
"""
import ipaddress
import socket
from dataclasses import dataclass

import psutil

# Sirf ye states "active" connection maane jayenge (LISTEN wale nahi)
ACTIVE_STATES = {
    psutil.CONN_ESTABLISHED,
    psutil.CONN_SYN_SENT,
    psutil.CONN_SYN_RECV,
}


@dataclass
class ConnectionInfo:
    local: str
    remote: str
    process: str
    internal: bool


def is_internal_ip(ip: str) -> bool:
    """127.x, 10.x, 172.16-31.x, 192.168.x, ::1 jaise address internal hain."""
    try:
        addr = ipaddress.ip_address(ip.split("%")[0])  # IPv6 zone id hatao
    except ValueError:
        return False
    return addr.is_private or addr.is_loopback or addr.is_link_local


def _process_name(pid: int | None, cache: dict[int, str]) -> str:
    if not pid:
        return "unknown"
    if pid not in cache:
        try:
            cache[pid] = psutil.Process(pid).name()
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            cache[pid] = f"pid {pid}"
    return cache[pid]


def _raw_connections() -> list[tuple]:
    """
    (connection, pid) ki list deta hai.
    Linux pe psutil.net_connections() seedha chal jata hai.
    macOS/Windows pe bina admin ke AccessDenied aa sakta hai,
    tab har process ke connections alag se padhte hain.
    """
    try:
        return [(c, c.pid) for c in psutil.net_connections(kind="inet")]
    except psutil.AccessDenied:
        conns = []
        for proc in psutil.process_iter():
            try:
                conns.extend((c, proc.pid) for c in proc.net_connections(kind="inet"))
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue
        return conns


def get_connections() -> list[ConnectionInfo]:
    names: dict[int, str] = {}
    result: list[ConnectionInfo] = []
    seen: set[tuple] = set()

    for c, pid in _raw_connections():
        if not c.raddr or c.status not in ACTIVE_STATES:
            continue
        key = (c.laddr, c.raddr)
        if key in seen:
            continue
        seen.add(key)

        fmt = "[{}]:{}" if c.family == socket.AF_INET6 else "{}:{}"
        result.append(
            ConnectionInfo(
                local=fmt.format(c.laddr.ip, c.laddr.port),
                remote=fmt.format(c.raddr.ip, c.raddr.port),
                process=_process_name(pid, names),
                internal=is_internal_ip(c.raddr.ip),
            )
        )

    # External connections list me sabse upar dikhein
    result.sort(key=lambda x: x.internal)
    return result


def count_outbound(connections: list[ConnectionInfo]) -> int:
    return sum(1 for c in connections if not c.internal)
'use client';

import { useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
  t: number;
}

interface Metrics {
  speed: number;
  accel: number;
  jitter: number;
  idlePattern: boolean;
}

interface MouseTrackerProps {
  targetRef?: React.RefObject<HTMLElement>; // 추적 제외 영역
  onData?: (data: { positions: Position[]; metrics: Metrics[] }) => void;
  interval?: number;
  idleThreshold?: number;
  jitterThreshold?: number;
}

const MouseTracker: React.FC<MouseTrackerProps> = ({
  targetRef,
  onData,
  interval = 1000,
  idleThreshold = 5,
  jitterThreshold = 10,
}) => {
  const positions = useRef<Position[]>([]);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const calculateMetrics = (data: Position[]): Metrics[] => {
    const result: Metrics[] = [];
    for (let i = 1; i < data.length; i++) {
      const dx = data[i].x - data[i - 1].x;
      const dy = data[i].y - data[i - 1].y;
      const dt = (data[i].t - data[i - 1].t) / 1000;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;
      const prevSpeed =
        i > 1
          ? Math.sqrt(
              (data[i - 1].x - data[i - 2].x) ** 2 + (data[i - 1].y - data[i - 2].y) ** 2
            ) / ((data[i - 1].t - data[i - 2].t) / 1000)
          : 0;
      const accel = (speed - prevSpeed) / dt;

      const angleChange =
        i > 1
          ? Math.abs(
              Math.atan2(dy, dx) -
                Math.atan2(
                  data[i - 1].y - data[i - 2].y,
                  data[i - 1].x - data[i - 2].x
                )
            )
          : 0;
      const jitter = angleChange * (180 / Math.PI);

      const idlePattern =
        Math.sqrt(dx * dx + dy * dy) < idleThreshold && jitter > jitterThreshold;

      result.push({ speed, accel, jitter, idlePattern });
    }
    return result;
  };

  const sendData = () => {
    if (!onData || positions.current.length < 2) return;
    const metrics = calculateMetrics(positions.current);
    onData({ positions: positions.current, metrics });
    positions.current = [];
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (targetRef?.current) {
        const rect = targetRef.current.getBoundingClientRect();
        if (
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        ) {
          return; // 자극 영역 안쪽 제외
        }
      }
      positions.current.push({ x: event.clientX, y: event.clientY, t: performance.now() });
    };

    const handleMouseLeave = () => console.log("커서 화면 밖으로 이동");
    const handleMouseEnter = () => console.log("커서 화면에 복귀");

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);

    timer.current = setInterval(sendData, interval);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      if (timer.current) clearInterval(timer.current);
    };
  }, [targetRef, interval, sendData]);

  return null;
};

export default MouseTracker;

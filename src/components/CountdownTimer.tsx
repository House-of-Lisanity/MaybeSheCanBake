// src/components/CountdownTimer.tsx
"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  endDate: string;
  onExpire?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calculateTimeRemaining(endDate: string): TimeRemaining {
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const difference = end - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    expired: false,
  };
}

export default function CountdownTimer({
  endDate,
  onExpire,
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(endDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining(endDate);
      setTimeRemaining(remaining);

      if (remaining.expired && onExpire) {
        onExpire();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (timeRemaining.expired) {
    return <div className="countdown-expired">Sale Ended</div>;
  }

  return (
    <div className="countdown-timer">
      <div className="countdown-unit">
        <span className="countdown-value">{timeRemaining.days}</span>
        <span className="countdown-label">Days</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-unit">
        <span className="countdown-value">
          {String(timeRemaining.hours).padStart(2, "0")}
        </span>
        <span className="countdown-label">Hours</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-unit">
        <span className="countdown-value">
          {String(timeRemaining.minutes).padStart(2, "0")}
        </span>
        <span className="countdown-label">Minutes</span>
      </div>
      <div className="countdown-separator">:</div>
      <div className="countdown-unit">
        <span className="countdown-value">
          {String(timeRemaining.seconds).padStart(2, "0")}
        </span>
        <span className="countdown-label">Seconds</span>
      </div>
    </div>
  );
}

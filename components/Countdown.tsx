"use client";

import React, { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: Date;
  onTimeReached?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export default function Countdown({ targetDate, onTimeReached }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        onTimeReached?.();
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeRemaining({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onTimeReached]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  if (timeRemaining.isExpired) {
    return <div className="text-green-600 font-semibold">Registration is now open!</div>;
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-2">Registration opens in:</p>
      <div className="flex gap-2 items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(timeRemaining.days)}
          </div>
          <div className="text-xs text-gray-600">days</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(timeRemaining.hours)}
          </div>
          <div className="text-xs text-gray-600">hrs</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(timeRemaining.minutes)}
          </div>
          <div className="text-xs text-gray-600">mins</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatNumber(timeRemaining.seconds)}
          </div>
          <div className="text-xs text-gray-600">secs</div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useJubilee } from '../context/JubileeContext.tsx';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export const Countdown: React.FC = () => {
  const { settings } = useJubilee();

  const calculateTimeLeft = (): TimeLeft => {
    const target = new Date(settings.countdownDate || '2026-12-16T08:30:00').getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.countdownDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds },
  ];

  return (
    <div className="inline-block bg-black/40 backdrop-blur-md border border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl">
      <div className="text-center mb-3">
        <span className="text-xs uppercase tracking-widest text-amber-300/90 font-semibold">
          ✦ Countdown to Grand Jubilee Celebrations ✦
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
        {units.map((unit, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-gradient-to-b from-[#2B0405] to-[#140102] border border-amber-600/30 rounded-xl px-2 sm:px-4 py-2 sm:py-3 min-w-[65px] sm:min-w-[90px] shadow-md"
          >
            <span className="font-serif text-2xl sm:text-4xl font-black text-amber-400 tracking-tight font-mono">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-amber-200/70 tracking-wider mt-0.5">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

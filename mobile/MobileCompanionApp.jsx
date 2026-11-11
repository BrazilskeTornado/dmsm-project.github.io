import { useEffect, useMemo, useState } from 'react';

const REST_OPTIONS = [60, 90, 120];
const INTENSITY_MULTIPLIERS = { Low: 0.8, Medium: 1, High: 1.25 };
const TABS = [
  { id: 'workout', label: 'Workout', icon: 'W' },
  { id: 'dosage', label: 'Dosage', icon: 'D' },
  { id: 'rewards', label: 'Rewards', icon: 'R' },
];
const TAB_SUBTITLES = {
  workout: 'Live Interval Timer — Track your rest periods and hydration between sets.',
  dosage: 'Custom Mix Calculator — Compute your ideal AuraPerform scoops and water volume.',
  rewards: 'Loyalty & Restock — Track your session streaks, earn points, and reorder.',
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const calculatePlan = (duration, intensity, weight) => {
  const safeDuration = Math.max(0, Number(duration) || 0);
  const safeWeight = Math.max(0, Number(weight) || 0);
  const multiplier = INTENSITY_MULTIPLIERS[intensity];
  return {
    scoops: Math.max(0, Math.ceil((safeDuration / 45) * multiplier * 2) / 2),
    water: Math.round(Math.max(250, safeWeight * 7 + safeDuration * 4 * multiplier)),
  };
};

function ComingSoonModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/70 p-4 sm:items-center">
      <div className="w-full max-w-md animate-[fadeIn_.2s_ease-out] rounded-3xl border border-white/10 bg-[#141a1f]/85 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <p className="text-sm font-bold text-[#a3e635]">Feature Coming Soon</p>
            <p className="mt-2 text-sm leading-6 text-[#94a3b8]">
              This module is currently in development for the upcoming AuraPerform release.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close feature coming soon modal"
            onClick={onClose}
            className="rounded-lg p-1 text-[#94a3b8] transition hover:bg-[#1a232b] hover:text-white"
          >
            x
          </button>
        </div>
      </div>
    </div>
  );
}

function CelebrationModal({ points, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0b0f12]/90 p-5">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#141a1f]/90 p-6 text-center shadow-2xl shadow-black/50 backdrop-blur-xl animate-[fadeIn_.3s_ease-out]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }, (_, index) => (
            <span
              key={index}
              className="absolute h-2 w-2 animate-pulse rounded-full bg-[#a3e635]"
              style={{
                left: `${8 + ((index * 37) % 84)}%`,
                top: `${10 + ((index * 23) % 70)}%`,
                animationDelay: `${index * 80}ms`,
              }}
            />
          ))}
        </div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#a3e635]">
            Session complete
          </p>
          <h2 className="mt-3 text-2xl font-black text-white">
            GREAT SESSION! +25 POINTS EARNED 🎉
          </h2>
          <p className="mt-4 text-5xl font-black text-[#a3e635]">{points}</p>
          <p className="mt-1 text-sm text-[#94a3b8]">lifetime points</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 min-h-12 w-full rounded-xl bg-[#a3e635] px-4 text-sm font-bold text-black transition hover:bg-lime-300 focus:outline-none focus:ring-2 focus:ring-[#a3e635]"
          >
            Back to Gym
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MobileCompanionApp({
  storeUrl = '/shop.html',
  initialLoyaltyPoints = 420,
}) {
  const [activeTab, setActiveTab] = useState('workout');
  const [selectedRest, setSelectedRest] = useState(90);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hydrationPromptVisible, setHydrationPromptVisible] = useState(false);
  const [timerAlertVisible, setTimerAlertVisible] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [duration, setDuration] = useState(47);
  const [intensity, setIntensity] = useState('Medium');
  const [weight, setWeight] = useState(75);
  const [loyaltyPoints, setLoyaltyPoints] = useState(initialLoyaltyPoints);
  const [workoutCount, setWorkoutCount] = useState(0);

  const plan = useMemo(
    () => calculatePlan(duration, intensity, weight),
    [duration, intensity, weight],
  );

  useEffect(() => {
    if (!isTimerRunning || secondsRemaining <= 0) return undefined;

    const timer = window.setInterval(() => {
      setSecondsRemaining((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsTimerRunning(false);
          setHydrationPromptVisible(false);
          setTimerAlertVisible(true);
          return 0;
        }
        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isTimerRunning, secondsRemaining]);

  const selectRestDuration = (restDuration) => {
    setSelectedRest(restDuration);
  };

  const handlePrimaryTimerAction = () => {
    if (isTimerRunning) {
      setSecondsRemaining(0);
      setIsTimerRunning(false);
      setHydrationPromptVisible(false);
      setTimerAlertVisible(true);
      return;
    }

    setSecondsRemaining(selectedRest);
    setHydrationPromptVisible(true);
    setTimerAlertVisible(false);
    setIsTimerRunning(true);
  };

  const completeWorkout = () => {
    setLoyaltyPoints((currentPoints) => currentPoints + 25);
    setWorkoutCount((currentCount) => currentCount + 1);
    setShowCelebration(true);
  };

  const openComingSoon = (event) => {
    event.preventDefault();
    setShowComingSoon(true);
  };

  const renderWorkout = () => (
    <section
      className={`rounded-3xl border p-5 shadow-2xl transition-all duration-500 ${
        timerAlertVisible
          ? 'animate-[pulse_1.2s_ease-in-out_infinite] border-[#a3e635] bg-lime-400/10 shadow-lime-400/40 backdrop-blur-xl'
          : 'border-white/10 bg-[#141a1f]/80 shadow-black/30 backdrop-blur-xl'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[#94a3b8]">Live session</p>
          <h2 className="mt-1 text-xl font-bold">Rest interval</h2>
        </div>
        <span className="rounded-full bg-[#1a232b] px-3 py-1 text-xs font-semibold text-[#94a3b8]">
          {isTimerRunning ? 'In progress' : 'Ready'}
        </span>
      </div>

      <div className="my-6 text-center">
        <p className="font-mono text-6xl font-bold tabular-nums tracking-tight">
          {formatTime(secondsRemaining)}
        </p>
        {timerAlertVisible && (
          <p role="alert" className="mt-3 animate-pulse text-sm font-black text-[#a3e635]">
            GET BACK TO WORK! SET TIME!
          </p>
        )}
        <p className="mt-2 text-xs text-[#94a3b8]">
          {isTimerRunning ? `Resting for ${selectedRest} seconds` : 'Choose your recovery time'}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {REST_OPTIONS.map((restDuration) => (
          <button
            key={restDuration}
            type="button"
            onClick={() => selectRestDuration(restDuration)}
            className={`min-h-12 rounded-full border px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-[#a3e635] ${
              selectedRest === restDuration
                ? 'border-[#a3e635] bg-[#1a232b] text-[#a3e635] shadow-[0_0_16px_rgba(163,230,53,0.22)]'
                : 'border-transparent bg-[#1a232b] text-[#94a3b8] hover:text-[#a3e635]'
            }`}
          >
            {restDuration}s
          </button>
        ))}
      </div>

      <div className="mt-5 flex justify-center">
        <button
          type="button"
          onClick={handlePrimaryTimerAction}
          aria-label={isTimerRunning ? 'End rest timer' : 'Start rest timer'}
          className={`flex h-24 w-24 items-center justify-center rounded-full border-4 text-xs font-black uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-[#a3e635] ${
            isTimerRunning
              ? 'border-red-400 bg-[#1a232b] text-red-300 shadow-[0_0_28px_rgba(248,113,113,0.24)] hover:bg-red-950/40'
              : 'border-[#a3e635] bg-[#a3e635] text-black shadow-[0_0_28px_rgba(163,230,53,0.28)] hover:bg-lime-300'
          }`}
        >
          {isTimerRunning ? 'End Rest' : 'Start Rest'}
        </button>
      </div>

      {isTimerRunning && hydrationPromptVisible && (
        <div role="status" className="mt-4 rounded-2xl border border-[#a3e635]/20 bg-lime-400/10 p-3">
          <p className="text-sm font-bold text-[#a3e635]">H2O hydration check</p>
          <p className="mt-1 text-xs leading-5 text-[#94a3b8]">
            Sip AuraPerform now to support electrolyte balance before your next set.
          </p>
        </div>
      )}

    </section>
  );

  const renderDosage = () => (
    <section className="rounded-3xl border border-white/10 bg-[#141a1f]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <p className="text-sm font-medium text-[#94a3b8]">Personalized mix</p>
      <h2 className="mt-1 text-xl font-bold">Dosage calculator</h2>
      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Workout duration</span>
          <div className="relative">
            <input type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#232d36] bg-[#0b0f12] px-4 pr-14 text-white outline-none focus:border-[#a3e635]" />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-[#94a3b8]">min</span>
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Intensity</span>
          <select value={intensity} onChange={(event) => setIntensity(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#232d36] bg-[#0b0f12] px-4 text-white outline-none focus:border-[#a3e635]">
            {Object.keys(INTENSITY_MULTIPLIERS).map((level) => <option key={level}>{level}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Body weight</span>
          <div className="relative">
            <input type="number" min="1" value={weight} onChange={(event) => setWeight(event.target.value)} className="min-h-12 w-full rounded-xl border border-[#232d36] bg-[#0b0f12] px-4 pr-12 text-white outline-none focus:border-[#a3e635]" />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-[#94a3b8]">kg</span>
          </div>
        </label>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-wider text-[#a3e635]">AuraPerform</p><p className="mt-2 text-2xl font-bold">{plan.scoops}</p><p className="text-xs text-[#94a3b8]">scoops</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs uppercase tracking-wider text-[#94a3b8]">Target water</p><p className="mt-2 text-2xl font-bold">{plan.water}</p><p className="text-xs text-[#94a3b8]">ml</p></div>
      </div>
    </section>
  );

  const renderRewards = () => (
    <div className="space-y-4">
      <section className="rounded-3xl border border-white/10 bg-[#141a1f]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        <p className="text-sm font-medium text-[#94a3b8]">Lifetime loyalty</p>
        <p className="mt-2 text-5xl font-black text-[#a3e635]">{loyaltyPoints}</p>
        <p className="mt-1 text-sm text-[#94a3b8]">points earned</p>
      </section>
      <section className="rounded-3xl border border-white/10 bg-[#141a1f]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        <p className="text-sm font-medium text-[#94a3b8]">Consistency tracker</p>
        <h2 className="mt-1 text-xl font-bold">{workoutCount} workouts completed</h2>
      </section>
      <section className="rounded-3xl border border-white/10 bg-[#141a1f]/80 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
        <h2 className="text-xl font-bold">Keep the streak going</h2>
        <p className="mt-2 text-sm leading-5 text-[#94a3b8]">Mark today's session complete and stay stocked for your next set.</p>
        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={completeWorkout} className="min-h-12 rounded-xl bg-[#a3e635] px-4 text-sm font-bold text-black hover:bg-lime-300">Complete Workout</button>
          <a href={storeUrl} onClick={openComingSoon} className="flex min-h-12 items-center justify-center rounded-xl border border-[#232d36] bg-[#1a232b] px-4 text-sm font-bold text-[#a3e635] hover:border-[#a3e635]">Quick Restock</a>
        </div>
      </section>
    </div>
  );

  const tabContent = activeTab === 'workout' ? renderWorkout() : activeTab === 'dosage' ? renderDosage() : renderRewards();

  return (
    <main className="min-h-screen bg-[#0b0f12] bg-[radial-gradient(circle_at_top,_#1a232b_0%,_#0b0f12_48%)] px-4 py-5 pb-28 font-sans text-white sm:px-6">
      <div className="mx-auto max-w-md space-y-5">
        <header className="flex items-center justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a3e635]">AuraPerform</p><h1 className="mt-1 text-2xl font-bold tracking-tight">Workout companion</h1></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-right backdrop-blur-xl"><p className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Points</p><p className="text-lg font-bold text-[#a3e635]">{loyaltyPoints}</p></div>
        </header>
        <p className="max-w-sm text-sm leading-6 text-[#94a3b8]">{TAB_SUBTITLES[activeTab]}</p>
        <div key={activeTab} className="animate-[fadeIn_.2s_ease-out]">{tabContent}</div>
      </div>
      <nav className="fixed inset-x-4 bottom-4 z-20 mx-auto max-w-md rounded-full border border-white/10 bg-[#141a1f]/80 px-3 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="grid grid-cols-3 gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex min-h-14 flex-col items-center justify-center text-xs font-bold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${activeTab === tab.id ? 'rounded-full bg-[#a3e635] text-black shadow-[0_0_18px_rgba(163,230,53,0.2)]' : 'rounded-2xl text-[#94a3b8] hover:rounded-full hover:bg-[#1a232b] hover:text-[#a3e635]'}`}>
              <span className="mb-1 text-sm">{tab.icon}</span>{tab.label}
            </button>
          ))}
        </div>
      </nav>
      {showComingSoon && <ComingSoonModal onClose={() => setShowComingSoon(false)} />}
      {showCelebration && <CelebrationModal points={loyaltyPoints} onClose={() => setShowCelebration(false)} />}
    </main>
  );
}

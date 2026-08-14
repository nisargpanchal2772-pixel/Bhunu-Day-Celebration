"use client";

import { useState, useEffect } from "react";
import { questData, QuestDay } from "@/lib/questData";
import QuestModal, { QuestSubmission } from "@/components/QuestModal";
import { Lock, Unlock, CheckCircle2, PartyPopper } from "lucide-react";
import Image from "next/image";

export default function QuestPage() {
  const [submissions, setSubmissions] = useState<Record<number, QuestSubmission>>({});
  const [selectedDay, setSelectedDay] = useState<QuestDay | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setIsClient(true);
    // Load submissions from localStorage
    const saved = localStorage.getItem("bhunu-quest-submissions");
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse submissions");
      }
    }
    // Update date for precise midnight checks (if user stays on page)
    const interval = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveSubmission = (dayNumber: number, submission: QuestSubmission) => {
    const updated = { ...submissions, [dayNumber]: submission };
    setSubmissions(updated);
    localStorage.setItem("bhunu-quest-submissions", JSON.stringify(updated));
  };

  const getDayStatus = (day: QuestDay) => {
    // Current local date in YYYY-MM-DD
    const todayStr = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000))
                      .toISOString().split("T")[0];
    
    if (day.dateStr > todayStr) {
      return "LOCKED";
    } else if (day.dateStr === todayStr) {
      return "CURRENT";
    } else {
      return "PAST";
    }
  };

  if (!isClient) return null; // Avoid hydration mismatch on dates

  const allCompleted = questData.every(day => submissions[day.dayNumber]);
  const isFinaleUnlocked = getDayStatus(questData[12]) !== "LOCKED";

  return (
    <div className="flex flex-col items-center max-w-6xl w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center mt-8 mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-4 drop-shadow-sm">
          The Love Quest 🗺️
        </h1>
        <p className="font-sans text-lg text-rose-800/80 font-medium max-w-2xl mx-auto px-4">
          Unlock a new memory every day leading up to your birthday.
        </p>
      </header>

      {/* Grand Finale Banner */}
      {isFinaleUnlocked && allCompleted && (
        <div className="w-full mb-12 animate-in zoom-in duration-1000">
          <div className="relative overflow-hidden glass-card p-10 md:p-16 rounded-3xl text-center border-4 border-amber-200/50 shadow-[0_0_50px_rgba(252,228,236,0.8)]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
            <h2 className="relative z-10 font-serif text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 animate-pulse mb-6 drop-shadow-lg">
              Happy Bhunu Day! 🎂✨
            </h2>
            <p className="relative z-10 font-sans text-xl text-rose-900 font-medium max-w-2xl mx-auto mb-10">
              You've completed the quest! Here are all our beautiful memories from the past 13 days. I love you more than words can say.
            </p>
            
            {/* Collage */}
            <div className="relative z-10 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {Object.entries(submissions).map(([dayId, sub]) => (
                <div key={dayId} className="break-inside-avoid bg-white p-2 pb-8 rounded shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
                  <div className="relative w-full aspect-square bg-gray-100 mb-2">
                    <Image src={sub.image} alt={`Day ${dayId}`} fill className="object-cover" />
                  </div>
                  <p className="font-serif text-center text-sm text-gray-600">Day {dayId}</p>
                </div>
              ))}
            </div>
            
            <div className="absolute -top-10 -left-10 text-rose-200 opacity-50"><PartyPopper size={120} /></div>
            <div className="absolute -bottom-10 -right-10 text-rose-200 opacity-50"><PartyPopper size={120} /></div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full px-4 mb-20">
        {questData.map((day, index) => {
          const status = getDayStatus(day);
          const hasSubmission = !!submissions[day.dayNumber];
          const isLocked = status === "LOCKED";
          
          return (
            <div 
              key={day.dayNumber}
              onClick={() => !isLocked && setSelectedDay(day)}
              className={`relative glass-card rounded-3xl p-6 flex flex-col items-center justify-center min-h-[160px] md:min-h-[200px] transition-all duration-300 overflow-hidden ${
                isLocked 
                  ? "opacity-60 grayscale cursor-not-allowed border-gray-200 bg-gray-50/30" 
                  : "cursor-pointer hover:scale-105 hover:shadow-xl hover:shadow-rose-200/50 border-rose-100 bg-white/40"
              } ${day.isFinale ? "col-span-2 md:col-span-3 lg:col-span-4 min-h-[200px] bg-gradient-to-br from-amber-100/40 to-rose-200/40 border-amber-200" : ""}`}
            >
              {/* Submission background preview if it exists */}
              {!isLocked && hasSubmission && submissions[day.dayNumber].image && (
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                  <Image src={submissions[day.dayNumber].image} alt="Submission" fill className="object-cover" />
                </div>
              )}
              
              <div className="relative z-10 flex flex-col items-center">
                {isLocked ? (
                  <>
                    <Lock className="w-8 h-8 text-gray-400 mb-3" />
                    <span className="font-sans font-medium text-gray-500 text-sm md:text-base text-center">Unlocks on<br/>{new Date(day.dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </>
                ) : (
                  <>
                    {hasSubmission ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3 drop-shadow-sm" />
                    ) : (
                      <Unlock className="w-8 h-8 text-rose-400 mb-3 drop-shadow-sm" />
                    )}
                    <span className="font-serif font-bold text-xl md:text-2xl text-rose-900 mb-1">{day.title}</span>
                    <span className="font-sans font-medium text-rose-700/80 text-xs md:text-sm">
                      {hasSubmission ? "Completed!" : (status === "CURRENT" ? "Tap to Play" : "Tap to View")}
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <QuestModal 
          day={selectedDay}
          isOpen={!!selectedDay}
          onClose={() => setSelectedDay(null)}
          existingSubmission={submissions[selectedDay.dayNumber]}
          onSave={(sub) => handleSaveSubmission(selectedDay.dayNumber, sub)}
          isReadOnly={getDayStatus(selectedDay) === "PAST"}
        />
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { questData, QuestDay } from "@/lib/questData";
import QuestModal, { QuestSubmission } from "@/components/QuestModal";
import { Lock, Unlock, CheckCircle2, PartyPopper, Heart } from "lucide-react";
import Image from "next/image";

export default function QuestPage() {
  const [submissions, setSubmissions] = useState<Record<number, QuestSubmission>>({});
  const [selectedDay, setSelectedDay] = useState<QuestDay | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [titleClicks, setTitleClicks] = useState(0);
  const [showAdminExport, setShowAdminExport] = useState(false);

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

  const handleTitleClick = () => {
    setTitleClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setShowAdminExport(true);
        alert("💖 Memory Book Export Feature Unlocked! You can now download the memory scrapbook using the button in the bottom right corner.");
        return 0;
      }
      return next;
    });
  };

  const exportMemoryBook = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Our Love Quest Memory Book 💖</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #db2777;
      --primary-light: #fbcfe8;
      --rose-50: #fff1f2;
      --rose-100: #ffe4e6;
      --rose-900: #881337;
      --amber-50: #fffbeb;
      --amber-100: #fef3c7;
      --amber-900: #78350f;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background: linear-gradient(135deg, #fff5f5 0%, #fff0f3 100%);
      color: #334155;
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      color: var(--rose-900);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--primary);
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .toolbar {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .btn {
      background: linear-gradient(to right, #fb7185, #f472b6);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(251, 113, 133, 0.4);
      transition: all 0.2s;
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(251, 113, 133, 0.6);
    }

    .scrapbook {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .page-card {
      background: white;
      border-radius: 2rem;
      border: 1px solid var(--rose-100);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
      padding: 2.5rem;
      position: relative;
      overflow: hidden;
    }

    .page-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(to right, #fb7185, #f59e0b);
    }

    .day-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 2px dashed var(--rose-100);
      padding-bottom: 1rem;
      margin-bottom: 2rem;
    }

    .day-title {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      font-weight: 800;
      color: var(--rose-900);
    }

    .day-date {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--primary);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .content-grid {
        grid-template-columns: 1.2fr 1fr;
      }
    }

    .journal-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .prompt-box {
      padding: 1.25rem;
      border-radius: 1rem;
      font-size: 0.95rem;
    }

    .prompt-box.question {
      background-color: var(--rose-50);
      border-left: 4px solid #f43f5e;
    }

    .prompt-box.challenge {
      background-color: var(--amber-50);
      border-left: 4px solid #d97706;
    }

    .prompt-box h4 {
      font-family: 'Playfair Display', serif;
      font-size: 1.1rem;
      margin-bottom: 0.25rem;
      color: #1e293b;
    }

    .prompt-box p {
      line-height: 1.5;
      color: #475569;
    }

    .answer-box {
      background-color: #fafaf9;
      background-image: linear-gradient(#e7e5e4 1px, transparent 1px);
      background-size: 100% 2rem;
      line-height: 2rem;
      padding: 0.5rem 1.5rem;
      border-radius: 1rem;
      border: 1px solid #e7e5e4;
      font-family: 'Caveat', cursive;
      font-size: 1.8rem;
      color: #1e293b;
      min-height: 8rem;
      word-break: break-word;
    }

    .polaroid-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .polaroid {
      background: white;
      padding: 1rem 1rem 2.5rem 1rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border: 1px solid #f1f5f9;
      border-radius: 2px;
      transform: rotate(-1.5deg);
      max-width: 100%;
      width: 320px;
      transition: transform 0.3s;
    }

    .polaroid:hover {
      transform: rotate(0deg) scale(1.02);
    }

    .polaroid-img-wrapper {
      width: 100%;
      aspect-ratio: 1;
      overflow: hidden;
      background: #f8fafc;
      position: relative;
      border: 1px solid #e2e8f0;
    }

    .polaroid img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .polaroid-caption {
      font-family: 'Caveat', cursive;
      text-align: center;
      font-size: 1.6rem;
      color: var(--rose-900);
      margin-top: 1rem;
      font-weight: 700;
    }

    .empty-submission {
      grid-column: 1 / -1;
      text-align: center;
      padding: 3rem 1rem;
      background: #fafafa;
      border: 2px dashed #e2e8f0;
      border-radius: 1.5rem;
      color: #94a3b8;
    }

    .footer {
      text-align: center;
      margin-top: 5rem;
      color: #94a3b8;
      font-size: 0.9rem;
      padding-bottom: 2rem;
    }

    /* Print layout */
    @media print {
      body {
        background: white;
        padding: 0;
      }

      .toolbar {
        display: none !important;
      }

      .page-card {
        page-break-after: always;
        box-shadow: none;
        border: none;
        padding: 1rem 0;
      }

      .page-card::before {
        display: none;
      }

      .polaroid {
        box-shadow: none;
        border: 1px solid #ddd;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Love Quest Scrapbook</h1>
      <p class="subtitle">Our Birthday Journey Memories 💖</p>
    </header>

    <div class="toolbar">
      <button class="btn" onclick="window.print()">🖨️ Print / Save to PDF</button>
    </div>

    <div class="scrapbook">
      ${questData
        .map((day) => {
          const sub = submissions[day.dayNumber];
          const dateFormatted = new Date(day.dateStr).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          });

          if (!sub) {
            return `
              <div class="page-card">
                <div class="day-header">
                  <h3 class="day-title">${day.title}</h3>
                  <span class="day-date">${dateFormatted}</span>
                </div>
                <div class="empty-submission">
                  <p>No entry submitted for this day yet.</p>
                </div>
              </div>
            `;
          }

          const photoHtml = sub.image
            ? `
                <div class="polaroid">
                  <div class="polaroid-img-wrapper">
                    <img src="${sub.image}" alt="Day ${day.dayNumber} Memory">
                  </div>
                  <div class="polaroid-caption">Day ${day.dayNumber} Memory</div>
                </div>
              `
            : `
                <div class="polaroid" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 320px; background: #fafafa; border: 2px dashed #cbd5e1;">
                  <span style="font-family: 'Caveat', cursive; font-size: 1.5rem; color: #94a3b8;">No photo uploaded</span>
                </div>
              `;

          return `
            <div class="page-card">
              <div class="day-header">
                <h3 class="day-title">${day.title}</h3>
                <span class="day-date">${dateFormatted}</span>
              </div>
              
              <div class="content-grid">
                <div class="journal-section">
                  <div class="prompt-box question">
                    <h4>Question</h4>
                    <p>${day.question}</p>
                  </div>
                  
                  <div class="prompt-box challenge">
                    <h4>Challenge</h4>
                    <p>${day.challenge}</p>
                  </div>

                  <div class="answer-box">
                    ${sub.text || "No response written."}
                  </div>
                </div>

                <div class="polaroid-container">
                  ${photoHtml}
                </div>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>

    <div class="footer">
      Generated from Bhunu Day Celebration Quest. Made with 💖
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bhunu_love_quest_memory_book.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
        <h1 
          onClick={handleTitleClick}
          className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-4 drop-shadow-sm cursor-pointer select-none"
        >
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

      {showAdminExport && (
        <button
          onClick={exportMemoryBook}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold px-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all animate-bounce"
        >
          <Heart className="w-5 h-5 fill-white" />
          <span>Export Memory Book</span>
        </button>
      )}
    </div>
  );
}

import Image from "next/image";
import CountdownTimer from "@/components/CountdownTimer";

export default function Home() {
  // Target date: August 26, 2026 at 00:00:00 (assuming current year is 2026 based on prompt metadata)
  const targetDate = new Date("2026-08-26T00:00:00");

  return (
    <div className="flex flex-col items-center max-w-4xl w-full mx-auto animate-in fade-in zoom-in duration-700">
      <header className="text-center mt-8 mb-12">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-rose-900 mb-4 drop-shadow-sm">
          Bhunu Day Celebration Quest 💖
        </h1>
        <p className="font-sans text-lg md:text-xl text-rose-800/80 font-medium max-w-2xl mx-auto px-4">
          A 13-Day Journey Celebrating You, My Love.
        </p>
      </header>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-4">
        {/* Photo Display */}
        <div className="relative group w-64 h-64 md:w-80 md:h-80 shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-300 to-amber-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card p-2 transform group-hover:scale-[1.02] transition-transform duration-500">
            <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/40">
              <Image
                src="/our photo.jpeg"
                alt="Us"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </div>

        {/* Welcome & Timer */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="glass-card p-6 md:p-8 rounded-3xl mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="font-serif text-2xl font-bold text-rose-900 mb-3">
              Welcome to Your Birthday Month! ✨
            </h2>
            <p className="font-sans text-rose-800/90 leading-relaxed text-sm md:text-base">
              Every day leading up to your birthday unlocks a new question and photo challenge. 
              Use the navigation bar above to start your <strong>Love Quest</strong> or visit the <strong>Love Notes</strong> page. 
              I love you!
            </p>
          </div>

          <div className="w-full flex flex-col items-center">
            <p className="font-sans font-semibold text-rose-900 uppercase tracking-widest text-xs opacity-70">
              Time until your special day
            </p>
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

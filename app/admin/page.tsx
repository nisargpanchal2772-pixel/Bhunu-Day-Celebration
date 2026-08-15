"use client";

import { useState, useEffect } from "react";
import { questData, QuestDay } from "@/lib/questData";
import { QuestSubmission } from "@/components/QuestModal";
import { Lock, Unlock, Calendar, Heart, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<Record<number, QuestSubmission>>({});
  const [loading, setLoading] = useState(false);

  // Load authentication status from session storage so you don't lose login on refresh
  useEffect(() => {
    const cachedAuth = sessionStorage.getItem("admin-authenticated");
    const cachedPass = sessionStorage.getItem("admin-password");
    if (cachedAuth === "true" && cachedPass) {
      setIsAuthenticated(true);
      fetchSubmissions(cachedPass);
    }
  }, []);

  const fetchSubmissions = async (pass: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/save-submissions", {
        headers: {
          "x-admin-password": pass,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
        setIsAuthenticated(true);
        sessionStorage.setItem("admin-authenticated", "true");
        sessionStorage.setItem("admin-password", pass);
        setError("");
      } else {
        setError("Invalid password. Please try again.");
        setIsAuthenticated(false);
        sessionStorage.removeItem("admin-authenticated");
        sessionStorage.removeItem("admin-password");
      }
    } catch (err) {
      setError("Failed to fetch submissions. Make sure BLOB_READ_WRITE_TOKEN is set.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    fetchSubmissions(password);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setSubmissions({});
    sessionStorage.removeItem("admin-authenticated");
    sessionStorage.removeItem("admin-password");
  };

  // Stats
  const totalDays = questData.length;
  const completedCount = Object.keys(submissions).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in zoom-in duration-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md border border-rose-100 p-8 rounded-3xl shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100">
            <Lock className="w-8 h-8 text-rose-500" />
          </div>
          
          <h1 className="font-serif text-3xl font-bold text-rose-900 mb-2">Secret Memory Admin</h1>
          <p className="font-sans text-rose-800/70 text-sm mb-6">
            Enter the admin password to view all submitted answers and photos in real-time.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-200 outline-none transition pr-10 text-center font-sans"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-600 text-sm bg-rose-50 p-3 rounded-lg border border-rose-100 justify-center">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold rounded-xl shadow-lg hover:shadow-rose-400/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Unlock Memory Book"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-5xl w-full mx-auto px-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="w-full flex flex-col md:flex-row md:items-center md:justify-between mt-8 mb-12 gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-rose-900 mb-2">
            Bhuni's Love Book 📖
          </h1>
          <p className="font-sans text-rose-700/80 font-medium">
            Real-time Submissions Dashboard
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-2xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="font-sans font-bold text-rose-900 text-sm">
              Progress: {completedCount} / {totalDays} Days
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="font-sans text-sm font-semibold text-gray-500 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 px-4 py-2 rounded-2xl border border-transparent hover:border-rose-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {completedCount === 0 ? (
        <div className="w-full text-center py-20 bg-white/60 backdrop-blur-sm border border-rose-100 rounded-3xl shadow-xl">
          <BookOpen className="w-16 h-16 text-rose-300 mx-auto mb-4" />
          <h3 className="font-serif text-2xl font-bold text-rose-900 mb-2">No Submissions Yet</h3>
          <p className="font-sans text-rose-800/60 max-w-md mx-auto">
            She hasn't started the quest or submitted any answers yet. Once she submits a quest entry, it will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-10 w-full">
          {questData.map((day) => {
            const sub = submissions[day.dayNumber];
            const dateFormatted = new Date(day.dateStr).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            });

            return (
              <motion.div
                key={day.dayNumber}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-rose-100 shadow-xl overflow-hidden flex flex-col gap-6"
              >
                {/* Visual Accent Top line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-400 to-amber-300" />

                {/* Day Header */}
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between border-b border-rose-100/60 pb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-black text-rose-900 text-3xl">
                      {day.title}
                    </span>
                    {sub && <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />}
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-700/80 font-medium text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{dateFormatted}</span>
                  </div>
                </div>

                {/* Day Content */}
                {!sub ? (
                  <div className="flex flex-col items-center justify-center py-10 bg-gray-50/40 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                    <Lock className="w-8 h-8 mb-2 opacity-60" />
                    <p className="font-sans font-medium text-sm">Waiting for her response...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left: Quest details & Her typed answer */}
                    <div className="md:col-span-7 flex flex-col gap-6">
                      {/* Prompts */}
                      <div className="flex flex-col gap-3">
                        <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                          <h4 className="font-serif font-bold text-rose-800 text-xs uppercase tracking-wider mb-1">
                            Question
                          </h4>
                          <p className="font-sans text-rose-950/80 text-sm leading-relaxed">
                            {day.question}
                          </p>
                        </div>

                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                          <h4 className="font-serif font-bold text-amber-800 text-xs uppercase tracking-wider mb-1">
                            Challenge
                          </h4>
                          <p className="font-sans text-amber-950/80 text-sm leading-relaxed">
                            {day.challenge}
                          </p>
                        </div>
                      </div>

                      {/* Her Answer styled like ruled notepad */}
                      <div>
                        <h4 className="font-sans text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                          Her Answer
                        </h4>
                        <div className="bg-stone-50 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] p-6 rounded-2xl border border-stone-200/60 font-serif italic text-rose-950 text-xl leading-relaxed shadow-inner min-h-[100px]">
                          {sub.text || "No written response submitted."}
                        </div>
                      </div>
                    </div>

                    {/* Right: Her Polaroid photo */}
                    <div className="md:col-span-5 flex items-center justify-center">
                      {sub.image ? (
                        <div className="bg-white p-4 pb-8 rounded shadow-2xl border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-300 max-w-[280px] w-full">
                          <div className="relative w-full aspect-square bg-gray-50 overflow-hidden border border-gray-100 rounded-sm mb-4">
                            <Image
                              src={sub.image}
                              alt={`Day ${day.dayNumber} Polaroid`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="font-serif text-center text-sm font-bold text-rose-900/60">
                            Day {day.dayNumber} Memory 💖
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center aspect-square max-w-[280px] w-full border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/40 text-gray-400 p-8 text-center">
                          <BookOpen className="w-8 h-8 mb-2 opacity-50" />
                          <p className="font-sans font-medium text-xs">No photo uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

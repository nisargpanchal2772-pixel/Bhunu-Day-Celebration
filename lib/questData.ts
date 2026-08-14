export interface QuestDay {
  dayNumber: number;
  dateStr: string; // "YYYY-MM-DD" format for precise midnight checks
  title: string;
  question: string;
  challenge: string;
  isFinale?: boolean;
}

export const questData: QuestDay[] = [
  {
    dayNumber: 1,
    dateStr: "2026-08-14",
    title: "Day 1",
    question: "What is your absolute favorite memory of us from this past year?",
    challenge: "Take a photo of something near you right now that makes you feel happy!",
  },
  {
    dayNumber: 2,
    dateStr: "2026-08-15",
    title: "Day 2",
    question: "Where was our very first date, or what was the very first thought you had when you met me?",
    challenge: "Take a photo holding or recreating something from our early days!",
  },
  {
    dayNumber: 3,
    dateStr: "2026-08-16",
    title: "Day 3",
    question: "What is one song that immediately makes you think of me whenever it plays?",
    challenge: "Take a screenshot or photo listening to that song!",
  },
  {
    dayNumber: 4,
    dateStr: "2026-08-17",
    title: "Day 4",
    question: "If we could instantly teleport to eat our favorite meal or treat right now, what are we eating?",
    challenge: "Snap a photo of your favorite snack or drink today!",
  },
  {
    dayNumber: 5,
    dateStr: "2026-08-18",
    title: "Day 5",
    question: "What is a small, quiet moment with me that made you feel super loved?",
    challenge: "Take a cute photo showing your best happy smile!",
  },
  {
    dayNumber: 6,
    dateStr: "2026-08-19",
    title: "Day 6",
    question: "What is the funniest or silliest memory we’ve shared that still makes you laugh?",
    challenge: "Send the goofiest selfie you can take right now!",
  },
  {
    dayNumber: 7,
    dateStr: "2026-08-20",
    title: "Day 7",
    question: "What is your favorite habit or little quirk of mine that you secretly love?",
    challenge: "Take a photo holding a handwritten note with 3 words that describe us.",
  },
  {
    dayNumber: 8,
    dateStr: "2026-08-21",
    title: "Day 8",
    question: "What is your absolute favorite picture of the two of us?",
    challenge: "Recreate your pose/expression from that favorite picture in a new selfie today!",
  },
  {
    dayNumber: 9,
    dateStr: "2026-08-22",
    title: "Day 9",
    question: "What is your ideal lazy Sunday/cozy day with me?",
    challenge: "Take a cozy photo (wrapped in a blanket, holding a mug, or holding a plushie).",
  },
  {
    dayNumber: 10,
    dateStr: "2026-08-23",
    title: "Day 10",
    question: "If we could hop on a plane tomorrow to any place in the world together, where are we going?",
    challenge: "Take a photo holding something that represents travel or adventure!",
  },
  {
    dayNumber: 11,
    dateStr: "2026-08-24",
    title: "Day 11",
    question: "What is one thing about our relationship that makes you feel safe and super grateful?",
    challenge: "Make a heart shape with your hands and snap a photo! 🫶",
  },
  {
    dayNumber: 12,
    dateStr: "2026-08-25",
    title: "Day 12",
    question: "What is one wish or hope you have for yourself in this upcoming new year of your life?",
    challenge: "Take a photo blowing a kiss to the camera for the final countdown! 💋",
  },
  {
    dayNumber: 13,
    dateStr: "2026-08-26",
    title: "Day 13: Your Birthday! 🎂",
    question: "Happy Birthday, my love! You completed all 12 days! What are you most excited for today?",
    challenge: "The ultimate Birthday Selfie! 🎂✨",
    isFinale: true,
  },
];

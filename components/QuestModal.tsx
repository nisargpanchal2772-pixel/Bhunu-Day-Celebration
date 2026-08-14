"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Sparkles } from "lucide-react";
import { QuestDay } from "@/lib/questData";
import { compressImage, base64ToBlob } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export interface QuestSubmission {
  text: string;
  image: string; // Base64
  timestamp: number;
}

interface QuestModalProps {
  day: QuestDay;
  isOpen: boolean;
  onClose: () => void;
  existingSubmission?: QuestSubmission;
  onSave: (submission: QuestSubmission) => void;
  isReadOnly: boolean;
}

export default function QuestModal({ day, isOpen, onClose, existingSubmission, onSave, isReadOnly }: QuestModalProps) {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (existingSubmission) {
        setText(existingSubmission.text);
        setImage(existingSubmission.image);
      } else {
        setText("");
        setImage("");
      }
      setShowParticles(false);
    }
  }, [isOpen, existingSubmission]);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      try {
        const compressedBase64 = await compressImage(e.target.files[0]);
        setImage(compressedBase64);
      } catch (error) {
        console.error("Failed to compress image", error);
        alert("Failed to process image. Please try a smaller one.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text && !image) return;
    
    setIsUploading(true);
    let finalImageUrl = image;

    try {
      // If it's a new upload (base64 string), try to upload it to Vercel Blob
      if (image.startsWith('data:')) {
        try {
          const file = base64ToBlob(image);
          const formData = new FormData();
          formData.append('file', file, `quest-day-${day.dayNumber}.jpg`);
          formData.append('dayNumber', day.dayNumber.toString());

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (res.ok) {
            const data = await res.json();
            finalImageUrl = data.url; // The URL from Vercel Blob
          } else {
            const errData = await res.json().catch(() => ({}));
            console.warn('Vercel Blob upload failed, falling back to local base64 storage. Error:', errData.error || res.statusText);
          }
        } catch (uploadError) {
          console.warn('Network or error uploading to Vercel Blob, falling back to local base64 storage:', uploadError);
        }
      }

      setShowParticles(true);
      setTimeout(() => {
        onSave({
          text,
          image: finalImageUrl,
          timestamp: existingSubmission?.timestamp || Date.now(),
        });
        setIsUploading(false);
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white/90 backdrop-blur-md border border-rose-100 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {showParticles && (
            <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/80">
              <Sparkles className="w-16 h-16 text-rose-400 animate-spin" />
              <span className="ml-3 font-serif text-2xl text-rose-600 font-bold animate-pulse">Yay! Saved!</span>
            </div>
          )}

          <div className="p-6 md:p-8">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <h2 className="font-serif text-3xl font-bold text-rose-900 mb-2">{day.title}</h2>
            <p className="font-sans text-rose-700 font-medium mb-6">{new Date(day.dateStr).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            
            <div className="bg-rose-50/50 p-4 rounded-xl mb-4 border border-rose-100">
              <h3 className="font-serif font-bold text-rose-800 text-lg mb-1">Question:</h3>
              <p className="font-sans text-rose-900/80">{day.question}</p>
            </div>
            
            <div className="bg-amber-50/50 p-4 rounded-xl mb-6 border border-amber-100">
              <h3 className="font-serif font-bold text-amber-800 text-lg mb-1">Challenge:</h3>
              <p className="font-sans text-amber-900/80">{day.challenge}</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block font-sans text-sm font-semibold text-gray-600 mb-2">Your Answer</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isReadOnly}
                  className="w-full p-4 rounded-xl border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-200 outline-none transition resize-none h-28"
                  placeholder="Type your response here..."
                  required
                />
              </div>

              <div>
                <label className="block font-sans text-sm font-semibold text-gray-600 mb-2">Photo Upload</label>
                {image ? (
                  <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group">
                    <Image src={image} alt="Uploaded" fill className="object-contain" />
                    {!isReadOnly && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <label className="cursor-pointer bg-white px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-100 transition">
                          Change Photo
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 transition ${!isReadOnly ? "cursor-pointer hover:bg-gray-100 hover:border-rose-300" : "opacity-60 cursor-not-allowed"}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        {isUploading ? "Processing..." : (isReadOnly ? "No photo uploaded" : "Tap to upload a photo")}
                      </p>
                    </div>
                    {!isReadOnly && <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />}
                  </label>
                )}
              </div>

              {!isReadOnly ? (
                <button 
                  type="submit"
                  disabled={isUploading || (!text && !image)}
                  className="w-full py-4 mt-2 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-bold rounded-xl shadow-lg hover:shadow-rose-400/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {existingSubmission ? "Update Quest" : "Submit Quest"}
                </button>
              ) : (
                <div className="w-full py-4 mt-2 bg-gray-100 text-gray-500 font-bold rounded-xl text-center border border-gray-200">
                  Read Only (Time Expired)
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

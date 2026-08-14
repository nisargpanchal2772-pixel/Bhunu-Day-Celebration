"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "My Home", icon: Home },
    { href: "/quest", label: "Love Quest", icon: Sparkles },
    { href: "/notes", label: "Love Notes", icon: Heart },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 px-4 py-4 md:py-6 flex justify-center pointer-events-none">
      <div className="glass-card rounded-full px-6 py-3 flex items-center gap-6 pointer-events-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 flex items-center gap-2 rounded-full transition-colors duration-300 ${
                isActive ? "text-rose-900" : "text-rose-900/60 hover:text-rose-900/90"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white/50 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 ${isActive ? "text-rose-500" : ""}`} />
              <span className="font-medium text-sm hidden sm:block font-sans">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

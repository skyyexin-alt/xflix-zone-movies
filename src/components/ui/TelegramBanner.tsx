"use client";

import { Send } from 'lucide-react';

export default function TelegramBanner() {
  return (
    <div className="w-full my-6 bg-gradient-to-r from-[#6c5ce7]/20 via-[#1e90ff]/15 to-[#6c5ce7]/10 border border-[#6c5ce7]/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="w-11 h-11 rounded-xl bg-[#6c5ce7] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#6c5ce7]/30 text-white">
          <Send className="w-5 h-5 translate-x-[-1px] translate-y-[1px]" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            Join NextZone Telegram Group
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-normal max-w-xl">
            If the site ever closes, this is where we'll post the new link. Be the first to know about news and updates.
          </p>
        </div>
      </div>

      <a
        href="https://t.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-[#6c5ce7] hover:bg-[#5a49df] text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
      >
        <Send className="w-4 h-4" />
        <span>Join</span>
      </a>
    </div>
  );
}

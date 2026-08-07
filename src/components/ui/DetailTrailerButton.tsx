"use client";

import { Play } from 'lucide-react';

interface DetailTrailerButtonProps {
  videoKey: string;
  title: string;
}

export default function DetailTrailerButton({ videoKey, title }: DetailTrailerButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-storyline-with-trailer'));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full sm:w-auto text-center px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-violet-600 hover:bg-violet-500 text-xs sm:text-sm font-black text-white shadow-xl shadow-violet-600/40 transition-all flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 cursor-pointer"
    >
      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> Watch Full Movies Now!
    </button>
  );
}

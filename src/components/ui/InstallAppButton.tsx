"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Share, Download, Shield, Zap, Smartphone, Sparkles } from "lucide-react";

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleTrigger = () => {
        setIsOpen(true);
      };

      window.addEventListener('trigger-install-popup', handleTrigger);
      return () => {
        window.removeEventListener('trigger-install-popup', handleTrigger);
      };
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowIosInstructions(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 w-full max-w-md border border-[#6c5ce7]/40 bg-[#14142f] shadow-[0_0_60px_rgba(108,92,231,0.5)] text-center">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#6c5ce7]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={() => {
            setIsOpen(false);
            setShowIosInstructions(false);
          }}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!showIosInstructions ? (
          <div className="space-y-6 relative z-10">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 px-3.5 py-1 rounded-full text-xs font-black text-[#a29bfe] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official XFlix App</span>
            </div>

            {/* App Icon & Title */}
            <div className="space-y-3">
              <div className="relative w-24 h-24 mx-auto rounded-3xl overflow-hidden shadow-2xl shadow-[#6c5ce7]/60 border-2 border-fuchsia-500/40">
                <Image
                  src="/xflix-logo.png"
                  alt="XFlix Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                XFlix Movies
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                Install our official XFlix App for the fastest, ad-free full-screen movie streaming experience on your device.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 gap-2.5 text-left bg-white/3 border border-white/8 p-4 rounded-2xl">
              <div className="flex items-center gap-3 text-xs text-zinc-200 font-semibold">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>1080p Full HD Instant Streaming</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-200 font-semibold">
                <div className="w-6 h-6 rounded-lg bg-[#6c5ce7]/20 text-[#a29bfe] flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span>Zero Ads & Built-in Anti-Popup Protection</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-200 font-semibold">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
                <span>Fullscreen App Experience on iOS & Android</span>
              </div>
            </div>

            {/* Install CTA Button */}
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 bg-gradient-to-r from-[#6c5ce7] to-fuchsia-600 hover:from-[#5a49df] hover:to-fuchsia-500 active:scale-[0.98] transition-all text-white font-extrabold rounded-2xl text-sm sm:text-base shadow-lg shadow-[#6c5ce7]/50 flex items-center justify-center gap-2.5"
            >
              <Download className="w-5 h-5" />
              <span>Install XFlix App</span>
            </button>
          </div>
        ) : (
          /* iOS Instructions View */
          <div className="space-y-6 relative z-10 text-center">
            <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden shadow-lg shadow-[#6c5ce7]/40 mb-2 border border-fuchsia-500/30">
              <Image
                src="/xflix-logo.png"
                alt="XFlix Logo"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white">Install XFlix on iPhone / iPad</h3>
              <p className="text-xs text-zinc-400 mt-1">Follow these quick steps to add XFlix to your home screen:</p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-left space-y-3">
              <div className="flex items-start gap-3 text-xs text-zinc-200">
                <span className="bg-[#6c5ce7] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                <span>Tap the <strong>Share</strong> button <Share className="inline w-3.5 h-3.5 text-[#a29bfe] mx-1" /> at the bottom of Safari.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-zinc-200">
                <span className="bg-[#6c5ce7] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowIosInstructions(false);
                setIsOpen(false);
              }}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all text-xs"
            >
              Got it
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

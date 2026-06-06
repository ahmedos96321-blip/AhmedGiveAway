import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Bell, Copy, Check, ShieldCheck } from 'lucide-react';
import { playChime } from '../utils/audio';

interface SimulatedSMSProps {
  code: string;
  onAutoPaste: (code: string) => void;
  triggerCount: number;
}

export default function SimulatedSMS({ code, onAutoPaste, triggerCount }: SimulatedSMSProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (triggerCount > 0) {
      setIsOpen(true);
      playChime();
      
      // Auto dismiss after 15 seconds, but user can open it manually
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 15000);
      
      return () => clearTimeout(timer);
    }
  }, [triggerCount, code]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Absolute top warning / notifier to trigger simulated SMS manually */}
      <div className="absolute top-2 w-full flex justify-center z-40 pointer-events-none px-4">
        <motion.button
          onClick={() => {
            setIsOpen(true);
            playChime();
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto text-[11px] sm:text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm transition-all focus:outline-none"
        >
          <Bell className="w-3.5 h-3.5 animate-bounce" />
          <span>رسالة التحقق لم تصل؟ اضغط للمحاكاة وإرسال رسالة AhmedOS Pro جديدة</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -100, x: '-50%', opacity: 0, scale: 0.95 }}
            animate={{ y: 24, x: '-50%', opacity: 1, scale: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18, stiffness: 120 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel text-gray-100 p-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.25)] border-t-2 border-emerald-500 z-50 pointer-events-auto select-none"
            dir="rtl"
          >
            {/* Header of push notification */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-lg shadow-inner text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-white tracking-wide">AhmedOS Pro Security</span>
                  <span className="text-[9px] text-emerald-400 font-mono tracking-wider">SMS SERVER (SECURE)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                <span>الآن</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-200 text-sm font-semibold px-2"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Notification Body */}
            <div className="text-right">
              <p className="text-[13px] text-gray-300 leading-relaxed font-sans">
                اهلا بك معنا في تطبيق <span className="text-emerald-400 font-bold">AhmedOS GiveAway</span> رمز التحقق الخاص بك هو:
              </p>
              
              {/* Animated Verification Code Banner */}
              <div className="my-3 bg-slate-950/80 rounded-xl p-3 border border-gray-800 flex items-center justify-between gap-4 font-mono">
                <span className="text-xl font-bold tracking-[0.3em] text-emerald-400 pl-2">
                  {code}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={copyToClipboard}
                    className="p-1 px-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white rounded border border-gray-800 flex items-center gap-1 text-[11px] font-sans transition-all active:scale-95"
                    title="نسخ الرمز"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم' : 'نسخ'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onAutoPaste(code);
                      setIsOpen(false);
                    }}
                    className="p-1 px-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-emerald-200 rounded border border-emerald-500/30 flex items-center gap-1 text-[11px] font-sans transition-all active:scale-95"
                  >
                    <span>تعبئة تلقائية</span>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-500/80">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                <span>تم التحقق من المرسل عبر خوادم AhmedOS Pro المعتمدة</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3, Clock, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { playSuccessSound } from '../utils/audio';

interface DailyPollPanelProps {
  level: 1 | 2 | 3;
  lastPollTime: string | null;
  onComplete: (pointsEarned: number) => void;
  onResetTime: () => void; // Fast forward demo action
}

export default function DailyPollPanel({ level, lastPollTime, onComplete, onResetTime }: DailyPollPanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // Seconds left

  const options = [
    { key: 'excellent', text: 'ممتاز / جيد جداً جداً', pct: 88, color: 'bg-emerald-500 shadow-emerald-500/20' },
    { key: 'good', text: 'جيد', pct: 2.5, color: 'bg-blue-500 shadow-blue-500/20' },
    { key: 'bad', text: 'سيء', pct: 1.0, color: 'bg-amber-500 shadow-amber-500/20' },
    { key: 'very_bad', text: 'سيء جداً', pct: 0.0, color: 'bg-rose-500 shadow-rose-500/20' }
  ];

  const getPointsReward = () => {
    if (level === 3) return 600;
    if (level === 2) return 20;
    return 10;
  };

  useEffect(() => {
    if (!lastPollTime) {
      setTimeLeft(0);
      setVotedOption(null);
      return;
    }

    // Set voted Option since user already completed it
    setVotedOption('excellent'); // Mock previous selection or default for display state

    const calculateTimeLeft = () => {
      const pollDate = new Date(lastPollTime);
      const now = new Date();
      const difference = (pollDate.getTime() + 24 * 60 * 60 * 1000) - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft(0);
        setVotedOption(null);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [lastPollTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoteSubmit = () => {
    if (!selectedOption) return;
    const pointsReward = getPointsReward();
    setVotedOption(selectedOption);
    playSuccessSound();
    onComplete(pointsReward);
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 relative overflow-hidden" dir="rtl">
      {/* Absolute high-tech aesthetic background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent blur-2xl rounded-full"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">الاستفتاء اليومي (Daily Poll)</h3>
            <p className="text-xs text-gray-400">سجل رأيك واحصل على نقاط فورية كل ٢٤ ساعة</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-mono text-emerald-400 font-bold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>+{getPointsReward()} نقطة</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!votedOption ? (
          <motion.div
            key="poll-voting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-slate-950/60 p-4 rounded-xl border border-gray-800/80">
              <span className="text-xs text-emerald-500 uppercase tracking-widest font-mono block mb-1">سؤال اليوم</span>
              <p className="text-sm font-semibold text-gray-100">ما هو تقييمك العام لتجربة تطبيق ونظام AhmedOS ؟</p>
            </div>

            <div className="space-y-2.5">
              {options.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedOption(opt.key)}
                  className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                    selectedOption === opt.key
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/5'
                      : 'bg-gray-900/40 border-gray-800 hover:border-gray-700 hover:bg-gray-900/80 text-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{opt.text}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedOption === opt.key ? 'border-emerald-400 bg-emerald-500' : 'border-gray-600'
                  }`}>
                    {selectedOption === opt.key && <div className="w-1.5 h-1.5 bg-slate-950 rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleVoteSubmit}
              disabled={!selectedOption}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedOption
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/15 cursor-pointer active:scale-98'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>إرسال التصويت وتقييد النقاط</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="poll-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Visual feedback of completion */}
            <div className="bg-emerald-950/20 text-emerald-400 border border-emerald-500/20 p-3 rounded-xl flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold">تم إرسال تصويتك بنجاح!</p>
                <p className="text-xs text-emerald-500/80">أنت في المستوى {level} - وحصلت على {getPointsReward()} نقطة</p>
              </div>
            </div>

            {/* Simulated Live Results of public polls */}
            <div className="bg-slate-950/50 p-4 rounded-xl border border-gray-800/80 space-y-4">
              <h4 className="text-xs text-gray-400 font-semibold mb-3">نتائج التصويت الحية لمجتمع AhmedOS:</h4>
              
              <div className="space-y-3">
                {options.map((opt) => {
                  const isUserPick = votedOption === opt.key;
                  return (
                    <div key={opt.key} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className={`${isUserPick ? 'text-emerald-400 font-bold' : 'text-gray-300'}`}>
                          {opt.text} {isUserPick && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full mr-1">اختيارك</span>}
                        </span>
                        <span className="font-mono text-gray-400">{opt.pct}%</span>
                      </div>
                      
                      {/* Bar indicator */}
                      <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/50">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(opt.pct, 1.5)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${opt.color}`}
                        ></motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Countdown or next attempt timer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-900/40 p-3 rounded-xl border border-gray-800/60">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>الاستفتاء القادم متاح خلال:</span>
                <span className="font-mono text-white font-semibold bg-slate-950 px-2 py-0.5 rounded border border-gray-800">{formatTime(timeLeft)}</span>
              </div>

              {/* Dynamic skip button for demo */}
              <button
                onClick={onResetTime}
                className="w-full sm:w-auto text-[11px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 border border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center justify-center gap-1 font-sans transition-all active:scale-95"
                title="تخطى الـ ٢٤ ساعة لأغراض اختبار التطبيق"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>تخطي ٢٤ ساعة (عرض توضيحي)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

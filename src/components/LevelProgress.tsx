import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Trophy, Sparkles, AlertCircle, ArrowUpCircle } from 'lucide-react';
import { playSuccessSound } from '../utils/audio';

interface LevelProgressProps {
  level: 1 | 2 | 3;
  completedSurveysCount: number;
  completedDailyPollsCount: number;
  onUpgradeLevel: (nextLevel: 1 | 2 | 3) => void;
}

export default function LevelProgress({ level, completedSurveysCount, completedDailyPollsCount, onUpgradeLevel }: LevelProgressProps) {
  
  // Calculate requirements for level 2
  const lvl2SurveysNeed = 2;
  const lvl2PollsNeed = 1;
  const canUpgradeTo2 = level === 1 && completedSurveysCount >= lvl2SurveysNeed && completedDailyPollsCount >= lvl2PollsNeed;

  // Calculate requirements for level 3
  const lvl3SurveysNeed = 785;
  const canUpgradeTo3 = level === 2 && completedSurveysCount >= lvl3SurveysNeed;

  const handleUpgradeClick = () => {
    if (canUpgradeTo2) {
      playSuccessSound();
      onUpgradeLevel(2);
    } else if (canUpgradeTo3) {
      playSuccessSound();
      onUpgradeLevel(3);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 relative select-none" dir="rtl">
      {/* Background element */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-transparent blur-2xl rounded-full"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-850 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">بوابة الترقية (Rank & Levels)</h3>
            <p className="text-xs text-gray-400">طوّر مستوى حسابك لمضاعفة أرباحك وتفعيل عروض الملايين</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-xs text-indigo-300 font-bold font-mono">
          <span>المستوى الحالي: {level}</span>
        </div>
      </div>

      {/* Level indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* lvl 1 */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          level === 1 
            ? 'bg-indigo-600/15 border-indigo-500/40 text-white shadow-md' 
            : 'bg-slate-950/40 border-gray-900 text-gray-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono">Level 1 (مبتدئ)</span>
            <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded text-gray-400">البداية</span>
          </div>
          <p className="text-[11px] mt-2 text-gray-300 opacity-90 leading-relaxed">
            الاستفتاء اليومي: <span className="font-bold text-indigo-400 font-mono">10 نقاط</span><br />
            الاستطلاعات: قصيرة، قليلة، متباعدة
          </p>
        </div>

        {/* lvl 2 */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          level === 2 
            ? 'bg-azure-500/15 bg-indigo-600/10 border-indigo-500/50 text-white shadow-md' 
            : level > 2
              ? 'bg-slate-950/20 border-gray-900 text-gray-400 opacity-80'
              : 'bg-slate-950/40 border-gray-900 text-gray-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono">Level 2 (متقدم)</span>
            {level > 1 && <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono">نشط</span>}
          </div>
          <p className="text-[11px] mt-2 text-gray-300 opacity-90 leading-relaxed">
            الاستفتاء اليومي: <span className="font-bold text-cyan-400 font-mono">20 نقطة</span><br />
            الاستطلاعات: مستمرة بدون انتظار ومكافآت بـ 4000 نقطة!
          </p>
        </div>

        {/* lvl 3 */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          level === 3 
            ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border-emerald-500/50 text-white shadow-md' 
            : 'bg-slate-950/40 border-gray-900 text-gray-400'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold font-mono">Level 3 (القصوى)</span>
            {level === 3 && <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 px-1.5 py-0.5 rounded font-bold">بطل</span>}
          </div>
          <p className="text-[11px] mt-2 text-gray-300 opacity-90 leading-relaxed">
            الاستفتاء اليومي: <span className="font-bold text-emerald-400 font-mono">600 نقطة</span><br />
            الاستطلاعات: مفتوحة بأرباح حتى 5,000 نقطة، وعروض بالملايين!
          </p>
        </div>
      </div>

      {/* Upgrade requirements display and actions */}
      {level === 1 && (
        <div className="bg-slate-950/50 p-4 rounded-xl border border-gray-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-gray-200">الترقية إلى مستوى Level 2 مطلوب:</span>
            <span className="text-indigo-400">متقدم</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Surveys status */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>استكمال استطلاعات:</span>
                <span className="font-mono text-white">{completedSurveysCount} / {lvl2SurveysNeed}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min((completedSurveysCount / lvl2SurveysNeed) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Polls status */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>الاشتراك بالاستفتاء اليومي:</span>
                <span className="font-mono text-white">{completedDailyPollsCount} / {lvl2PollsNeed}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min((completedDailyPollsCount / lvl2PollsNeed) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {canUpgradeTo2 ? (
            <button
              onClick={handleUpgradeClick}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-98 animate-bounce mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpCircle className="w-4 h-4 animate-spin-slow text-slate-950" />
              <span>ترقية فورية إلى LEVEL 2 مفعّل! اضغط الآن</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 bg-slate-900/40 p-2 rounded border border-gray-900 mt-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>متبقي لك إنهاء المتطلبات لترقية حسابك مجانًا.</span>
            </div>
          )}
        </div>
      )}

      {level === 2 && (
        <div className="bg-slate-950/50 p-4 rounded-xl border border-gray-850 space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-gray-200">الترقية إلى مستوى Level 3 (النخبة والأقصى) مطلوب:</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>أقصى نطاق معتمد</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>إكمال الاستطلاعات المطلوبة (785 استطلاع):</span>
              <span className="font-mono text-white">{completedSurveysCount} / {lvl3SurveysNeed}</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-gray-800">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min((completedSurveysCount / lvl3SurveysNeed) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {canUpgradeTo3 ? (
            <button
              onClick={handleUpgradeClick}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-lg active:scale-98 animate-pulse mt-2 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowUpCircle className="w-4 h-4 animate-spin-slow text-slate-950" />
              <span>ترقية فورية إلى LEVEL 3 مفعّل! اضغط الآن</span>
            </button>
          ) : (
            <div className="flex items-center justify-between text-[10px] text-gray-500 bg-slate-900/40 p-2 rounded border border-gray-900 mt-2">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>أنجز {lvl3SurveysNeed - completedSurveysCount} استطلاع آخر للترقية الكبرى!</span>
              </div>
              
              {/* Cheat demo button: add substantial surveys back-to-back */}
              <button
                onClick={() => onUpgradeLevel(3)}
                className="text-[9px] text-indigo-400 hover:text-indigo-300 font-medium underline border border-indigo-500/20 px-2 py-0.5 rounded bg-indigo-500/5 transition-all"
                title="تخطي متطلب الـ 785 استطلاع لتجربة ليفل 3 فورًا"
              >
                تخطي لـ Level 3 (عرض توضيحي)
              </button>
            </div>
          )}
        </div>
      )}

      {level === 3 && (
        <div className="bg-gradient-to-r from-emerald-950/30 to-slate-950 border border-emerald-500/30 p-4 rounded-xl text-center space-y-1 mt-2">
          <div className="text-xl">👑</div>
          <h4 className="text-sm font-bold text-emerald-400">تهانينا! أنت في مستوى النخبة الأقصى Level 3</h4>
          <p className="text-[11px] text-gray-300 leading-relaxed max-w-md mx-auto">
            لقد فتحت كافة المزايا! أرباح الاستفتاءات هي الأعلى بـ <span className="text-emerald-400 font-bold font-mono">600 نقطة</span>، والاستطلاعات والعروض متدفقة دائمًا بأسعار خيالية. أنت الأقرب للفوز بلابتوب AhmedOS وموبايل نظام Kale7AhmedOS.
          </p>
        </div>
      )}
    </div>
  );
}

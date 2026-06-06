import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, Trophy, Sparkles, User, BadgeAlert, Laptop, Phone, 
  HelpCircle, RefreshCw, Send, ShieldAlert, LogOut, Heart, ArrowUpRight, Flame
} from 'lucide-react';
import { UserProfile, Competitor } from '../types';
import SurveyPanel from './SurveyPanel';
import DailyPollPanel from './DailyPollPanel';
import OffersPanel from './OffersPanel';
import LeaderboardPanel from './LeaderboardPanel';
import LevelProgress from './LevelProgress';
import { INITIAL_COMPETITORS, tickCompetitorsPoints } from '../utils/competitors';
import { playSuccessSound } from '../utils/audio';

interface MainScreenProps {
  user: UserProfile;
  onChangeUser: (updater: (prev: UserProfile) => UserProfile) => void;
  onLogout: () => void;
}

export default function MainScreen({ user, onChangeUser, onLogout }: MainScreenProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>(INITIAL_COMPETITORS);
  const [completedOffers, setCompletedOffers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'hub' | 'leaderboard' | 'offers'>('hub');
  
  // Real-time simulated logs of wins or claims by other people
  const [liveActivityLog, setLiveActivityLog] = useState<string[]>([
    '🟢 بدأ "سارة القحطاني" بجمع النقاط وعينها على اللابتوب الجديد!',
    '🔥 "أحمد البكري" وصل للتو إلى المستوى Level 3 بنجاح!'
  ]);

  // Handle periodic competitors score updates is awesome to make it feel "live and real"!
  useEffect(() => {
    const timer = setInterval(() => {
      setCompetitors(prev => tickCompetitorsPoints(prev));
      
      // Randomly append a message to activity logs
      if (Math.random() > 0.75) {
        const events = [
          '⚡ عاد لقائمة المتصدرين: "يوسف العتيبي" بعد إنهاء استطلاع 300 نقطة.',
          '🎁 أحد المشاركين قام بتقديم طلب سحب على هاتف AhmedOS بنظام Kale7AhmedOS Andoried.',
          '📈 "رنيم الشريف" طوّرت حسابها الآن بنجاح إلى المستوى Level 2!',
          '💻 شركة AhmedOS Pro تؤكد: لابتوب 17.8 الفاخر متاح للتسليم لأعلى جامع نقاط اليوم!'
        ];
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        setLiveActivityLog(prev => [randomEvent, prev[0]].slice(0, 4)); // Keep last 4
      }
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  // Update user state helper
  const handlePointsAccrued = (pointsReward: number, sourceName: string, countsValue: number = 1) => {
    onChangeUser(prev => {
      const newSurveysCount = prev.completedSurveysCount + (sourceName === 'survey' ? countsValue : 0);
      const newPollsCount = prev.completedDailyPollsCount + (sourceName === 'poll' ? 1 : 0);
      
      return {
        ...prev,
        points: prev.points + pointsReward,
        completedSurveysCount: newSurveysCount,
        completedDailyPollsCount: newPollsCount,
        lastDailyPollTime: sourceName === 'poll' ? new Date().toISOString() : prev.lastDailyPollTime,
        lastSurveyTime: sourceName === 'survey' ? new Date().toISOString() : prev.lastSurveyTime,
      };
    });
    
    // Add activity log
    setLiveActivityLog(prev => [
      `🎉 لقد كسبت +${pointsReward} نقطة من [${sourceName === 'survey' ? 'الاستطلاع السريع' : sourceName === 'poll' ? 'الاستفتاء اليومي' : 'العروض الخاصة'}]!`,
      prev[0]
    ].slice(0, 4));
  };

  // Skip delay helper (demos)
  const handleResetSurveyTimer = () => {
    onChangeUser(prev => ({
      ...prev,
      lastSurveyTime: null
    }));
  };

  const handleResetPollTimer = () => {
    onChangeUser(prev => ({
      ...prev,
      lastDailyPollTime: null
    }));
  };

  const handleUpgradeLevel = (nextLevel: 1 | 2 | 3) => {
    onChangeUser(prev => ({
      ...prev,
      level: nextLevel
    }));
    playSuccessSound();
    
    setLiveActivityLog(prev => [
      `🔥 تهانينا! قمت بترقية مستواك تلقائيًا إلى Level ${nextLevel} بامتياز!`,
      prev[0]
    ].slice(0, 4));
  };

  const handleCompleteOffer = (points: number, title: string) => {
    // Collect ID
    const uniqueId = `completed_${Date.now()}`;
    setCompletedOffers(prev => [...prev, uniqueId, 'f_diagnostic']); // Add both
    handlePointsAccrued(points, 'العرض الخاص: ' + title);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4" dir="rtl">
      
      {/* Dynamic Navigation/App Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
        
        {/* User Badge Info Left */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/10 shrink-0">
            {user.name.trim().charAt(0) || <User className="w-4 h-4" />}
          </div>
          <div className="text-right">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 leading-none">
              <span>{user.name}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                مستوى {user.level}
              </span>
            </h4>
            <p className="text-[11px] text-gray-400 mt-1.5 font-mono">{user.phone} • {user.email}</p>
          </div>
        </div>

        {/* Navigation Tabs Center */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-gray-850">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'hub' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            مركز المكافآت (Hub)
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'leaderboard' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            المتصدرين
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'offers' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-slate-950 shadow-md font-bold' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            العروض الخاصة
          </button>
        </div>

        {/* Points Display Right */}
        <div className="flex items-center gap-3">
          <div className="text-left font-mono">
            <span className="text-[10px] text-gray-400 font-sans block">رصيد نقاطك المتراكم</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight flex items-center justify-end gap-1 font-mono">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse shrink-0" />
              <span>{user.points.toLocaleString()}</span>
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/10 transition-colors cursor-pointer"
            title="تعديل البيانات الشخصية"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'hub' && (
          <motion.div
            key="hub-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Massive Giveaway Showcase Banner */}
            <div className="glass-panel rounded-3xl p-6 border border-gray-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_15px_50px_rgba(16,185,129,0.04)]">
              {/* Absolutes */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/10 via-slate-950/20 to-transparent pointer-events-none"></div>
              
              <div className="space-y-4 max-w-2xl text-right z-10">
                <div className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-[11px] font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>السحب النشط لشركة AhmedOS Pro</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  اجمع أعلى عدد نقاط وتنافس للفوز بجوائز حقيقية كل يوم!
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  تجميع اعلى عدد نقاط من الأشخاص الأخرين الذين دخلو الموقع ستحصل على <span className="text-emerald-400 font-bold">Give</span> من الشركة منها <span className="text-emerald-400 font-bold">لابتوب بنظام 17.8</span> من الشركة مجانا كهدية او موبايل <span className="text-emerald-400 font-bold">AhmedOS</span> بنظام <span className="font-mono font-bold text-amber-400">Kale7AhmedOS Andoried</span> وغيرها من الهدايا الجميلة عندما تجمع اعلى عدد تستطيعه من النقاط كل يوم.
                </p>

                {/* Simulated Stats metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-gray-850/80 text-right">
                    <span className="text-[10px] text-gray-400 block font-normal">جائزة السحب الأولى:</span>
                    <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 mt-1 font-sans">
                      <Laptop className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>لابتوب AhmedOS v17.8</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-gray-850/80 text-right">
                    <span className="text-[10px] text-gray-400 block font-normal">جائزة السحب الثانية:</span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mt-1 font-sans">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>موبايل Kale7AhmedOS</span>
                    </span>
                  </div>

                  <div className="bg-slate-950/85 p-3 rounded-xl border border-gray-850/80 text-right col-span-2 md:col-span-1">
                    <span className="text-[10px] text-gray-400 block font-normal">إجمالي السحوبات اليومية:</span>
                    <span className="text-xs font-extrabold text-amber-400 block mt-1 font-mono">
                      $24,000 VALUE
                    </span>
                  </div>
                </div>
              </div>

              {/* Graphic item visualization */}
              <div className="relative shrink-0 flex items-center justify-center w-52 h-52 lg:w-60 lg:h-60 rounded-full bg-slate-950/80 border border-gray-850 shadow-inner z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent blur-xl rounded-full"></div>
                <div className="flex flex-col items-center justify-center text-center p-4 space-y-2">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg animate-pulse-slow">
                    <Laptop className="w-10 h-10 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">AhmedOS GiveAway</h5>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-44">الشحنة القادمة جاهزة للتوصيل مجاناً للفائزين بالمركز الأول</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Live Action Notification Stream */}
            <div className="bg-slate-950 p-3 rounded-xl border border-gray-900/60 flex items-center justify-between gap-3 text-right">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-ping"></div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0">آخر النشاطات:</span>
                <span className="text-[11px] text-gray-300 font-sans truncate transition-all">
                  {liveActivityLog[0]}
                </span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono pr-2 hidden sm:inline">خادم التلفزة المباشر نشط</span>
            </div>

            {/* Dashboard main core panels grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column (Main panels): Surveys & Daily Poll (Total 7/12 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Daily Poll Component */}
                <DailyPollPanel
                  level={user.level}
                  lastPollTime={user.lastDailyPollTime}
                  onComplete={(points) => handlePointsAccrued(points, 'poll')}
                  onResetTime={handleResetPollTimer}
                />

                {/* 2. Surveys Component */}
                <SurveyPanel
                  level={user.level}
                  lastSurveyTime={user.lastSurveyTime}
                  onComplete={(points, countsValue) => handlePointsAccrued(points, 'survey', countsValue)}
                  onResetTime={handleResetSurveyTimer}
                />

                {/* 3. Underneath Level indicators */}
                <LevelProgress
                  level={user.level}
                  completedSurveysCount={user.completedSurveysCount}
                  completedDailyPollsCount={user.completedDailyPollsCount}
                  onUpgradeLevel={handleUpgradeLevel}
                />
              </div>

              {/* Right Column (Community & Competitions): Leaderboard (Total 5/12 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <LeaderboardPanel
                  competitors={competitors}
                  userName={user.name}
                  userPoints={user.points}
                  userLevel={user.level}
                />

                {/* Brand information guidelines footer */}
                <div className="glass-panel rounded-2xl p-4 border border-gray-850 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-200">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>مواصفات كمبيوتر AhmedOS 17.8 المالي المهدى</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    يضم معالج AhmedOS Quantum المسرع بالذكاء الاصطناعي، شاشة بقياس 17.8 إنش OLED مع نظام التشفير التلقائي الفائق من شركة AhmedOS Pro، مع رخصة مجانية بالكامل مدى الحياة.
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* Tab 2: Standard standalone leaderboard view */}
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-2xl mx-auto"
          >
            <LeaderboardPanel
              competitors={competitors}
              userName={user.name}
              userPoints={user.points}
              userLevel={user.level}
            />
          </motion.div>
        )}

        {/* Tab 3: Standard standalone Offers view */}
        {activeTab === 'offers' && (
          <motion.div
            key="offers-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto"
          >
            <OffersPanel
              level={user.level}
              completedOffers={completedOffers}
              onCompleteOffer={handleCompleteOffer}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Star, Users2, ShieldCheck } from 'lucide-react';
import { Competitor } from '../types';

interface LeaderboardPanelProps {
  competitors: Competitor[];
  userName: string;
  userPoints: number;
  userLevel: 1 | 2 | 3;
}

export default function LeaderboardPanel({ competitors, userName, userPoints, userLevel }: LeaderboardPanelProps) {
  // Combine user with other competitors
  const [sortedLeaders, setSortedLeaders] = useState<Competitor[]>([]);

  useEffect(() => {
    const userAsCompetitor: Competitor = {
      id: 'user_active_profile',
      name: userName || 'أنت (مشارك)',
      points: userPoints,
      avatar: '👑',
      active: true,
      level: userLevel
    };

    const combinedList = [...competitors, userAsCompetitor];
    // Sort descending by points
    combinedList.sort((a, b) => b.points - a.points);
    setSortedLeaders(combinedList);
  }, [competitors, userPoints, userName, userLevel]);

  // Find user's position
  const userRankIndex = sortedLeaders.findIndex(item => item.id === 'user_active_profile') + 1;

  // Icons or medal for top 3
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="font-mono text-xs text-gray-400">#{rank}</span>;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 relative" dir="rtl">
      {/* Background glowing glow */}
      <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-amber-500/5 to-transparent blur-2xl rounded-full"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">قائمة المتصدرين الحية (Leaderboard)</h3>
            <p className="text-xs text-gray-400">تابع ترتيبك المباشر مع المشاركين الآخرين للفوز بالجوائز!</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-gray-800">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          <span className="text-[10px] text-emerald-400 font-mono font-medium">مباشر الآن</span>
        </div>
      </div>

      {/* User current standing highlights */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-600/5 to-transparent border border-amber-500/25 p-3.5 rounded-xl flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-right">
          <div className="text-2xl">🏆</div>
          <div>
            <h4 className="text-xs font-bold text-amber-300">ترتيبك الحالي في السحب اليومي:</h4>
            <p className="text-[11px] text-gray-300">
              أنت تحتل المرتبة <span className="font-bold text-amber-300 font-mono text-xs bg-amber-500/20 px-2 py-0.5 rounded-full">المركز #{userRankIndex}</span> من أصل <span className="font-mono">{sortedLeaders.length}</span> مشاركين ممتلئين بالنشاط.
            </p>
          </div>
        </div>
        <div className="text-left shrink-0">
          <span className="text-[10px] text-gray-400 block font-mono">النقاط الإجمالية</span>
          <span className="text-base font-bold text-amber-400 font-mono font-bold tracking-tight">
            {userPoints.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Leaders Table list */}
      <div className="space-y-2 max-h-76 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {sortedLeaders.map((leader, i) => {
            const isUser = leader.id === 'user_active_profile';
            const rank = i + 1;
            return (
              <motion.div
                key={leader.id}
                layoutId={`leader-${leader.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'bg-gray-900/40 border-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="w-8 shrink-0 flex justify-center">
                    {getRankBadge(rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-gray-800 text-sm">
                    {leader.avatar}
                  </div>

                  {/* Username and tag */}
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 matches-align">
                      <span className={`text-xs font-semibold ${isUser ? 'text-emerald-400 font-bold' : 'text-gray-200'}`}>
                        {leader.name}
                      </span>
                      {leader.active && !isUser && (
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" title="متصل الآن لجمع النقاط"></span>
                      )}
                      {isUser && (
                        <span className="text-[8px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">أنت</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-[9px] text-gray-500 font-sans mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-indigo-400" />
                      <span>مستوى {leader.level}</span>
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="text-left font-mono">
                  <span className={`text-xs font-bold leading-none ${isUser ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {leader.points.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-gray-500 block">نقطة</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

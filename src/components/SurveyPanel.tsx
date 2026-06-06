import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Star, Sparkles, Clock, Globe2, Heart, RefreshCw } from 'lucide-react';
import { playSuccessSound } from '../utils/audio';

interface SurveyPanelProps {
  level: 1 | 2 | 3;
  lastSurveyTime: string | null;
  onComplete: (points: number, countsValue?: number) => void;
  onResetTime: () => void;
}

export default function SurveyPanel({ level, lastSurveyTime, onComplete, onResetTime }: SurveyPanelProps) {
  const [surveyType, setSurveyType] = useState<'A' | 'B'>('A');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Form states for Survey A
  const [country, setCountry] = useState('');
  const [zipcode, setZipcode] = useState('');

  // Form states for Survey B
  const [fullName, setFullName] = useState('');
  const [hasPet, setHasPet] = useState<string>('');
  const [referral, setReferral] = useState('');

  // Determine cooldown setting
  const hasCooldown = level === 1;

  // Toggle survey content each time they load
  useEffect(() => {
    // Alternate or randomize survey template
    setSurveyType(Math.random() > 0.5 ? 'A' : 'B');
  }, [lastSurveyTime]);

  useEffect(() => {
    if (!hasCooldown || !lastSurveyTime) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const surveyDate = new Date(lastSurveyTime);
      const now = new Date();
      const difference = (surveyDate.getTime() + 5 * 60 * 1000) - now.getTime(); // 5-minute cooldown
      
      if (difference <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [lastSurveyTime, hasCooldown]);

  const getPointsReward = () => {
    if (level === 3) {
      // Level 3 awards 300 to 5000 points
      return Math.floor(Math.random() * 4700) + 300;
    }
    if (level === 2) {
      // Level 2 offers higher points (can be 4000 or count as 3 completed surveys)
      const rand = Math.random();
      if (rand > 0.8) return 4000; // Special 4000 points
      return Math.floor(Math.random() * 80) + 50; // High default
    }
    // Level 1: 5, 10, or 30 points
    const rewards = [5, 10, 30];
    return rewards[Math.floor(Math.random() * rewards.length)];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetForm = () => {
    setCountry('');
    setZipcode('');
    setFullName('');
    setHasPet('');
    setReferral('');
  };

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate rewards
    const pointsRewarded = getPointsReward();
    
    // Level 2 special perk: may count as 3 completed surveys sometimes
    let countsValue = 1;
    if (level === 2 && pointsRewarded !== 4000 && Math.random() > 0.6) {
      countsValue = 3;
    }

    playSuccessSound();
    onComplete(pointsRewarded, countsValue);
    resetForm();
  };

  const isFormValid = () => {
    if (surveyType === 'A') {
      return country.trim().length > 1 && zipcode.trim().length > 1;
    } else {
      return fullName.trim().length > 1 && hasPet !== '' && referral !== '';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 relative" dir="rtl">
      {/* Background radial accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent blur-2xl rounded-full"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">استطلاع سريع (Surveys)</h3>
            <p className="text-xs text-gray-400">
              {level === 1 
                ? 'استطلاع متجدد كل ٥ دقائق لمستوى ١' 
                : level === 2 
                  ? 'استطلاعات مستمرة بدون انتظار بمكافآت فائقة!' 
                  : 'استطلاعات مفتوحة دائمًا: أرباح هائلة تصل ٥,٠٠٠ نقطة!'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {level === 1 && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
              مستوى ١: مؤقت ٥ د
            </span>
          )}
          {level === 2 && (
            <span className="text-[11px] bg-blue-500/20 border border-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-semibold animate-pulse">
              مستوى ٢: استطلاعات متتالية
            </span>
          )}
          {level === 3 && (
            <span className="text-[11px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full font-bold animate-pulse">
              مستوى ٣: الأعلى ربحاً 🔥
            </span>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {timeLeft > 0 ? (
          <motion.div
            key="cooldown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center space-y-4"
          >
            <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center border-2 border-dashed border-cyan-500/30 animate-spin-slow">
              <Clock className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-200">الاستطلاع القادم قيد التجهيز</p>
              <p className="text-xs text-gray-400">يرجى الانتظار لتجميع الأسئلة الجديدة من خوادم AhmedOS Pro</p>
            </div>

            <div className="font-mono text-2xl font-bold text-cyan-400 tracking-wider bg-slate-950 px-4 py-2 rounded-xl border border-gray-800">
              {formatTime(timeLeft)}
            </div>

            {/* Test bypass button */}
            <button
              onClick={onResetTime}
              className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all mt-2 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تخطي الانتظار ٥ دقائق (عرض توضيحي)</span>
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="survey-form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleSurveySubmit}
            className="space-y-4"
          >
            {/* Template A: Location Survey */}
            {surveyType === 'A' ? (
              <div className="space-y-4">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-gray-800/80 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-cyan-400">استطلاع البلد والرمز البريدي الدولي</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">اسم بلدك الحالي:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: مصر، السعودية، الإمارات..."
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl border border-gray-800 p-3 text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all text-right"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">الرمز البريدي (Postal Code):</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 11511"
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl border border-gray-800 p-3 text-sm focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all text-right font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Template B: Profile & Referral Survey */
              <div className="space-y-4">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-gray-800/80 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span className="text-xs font-semibold text-pink-400">استبيان الاهتمامات الشخصية والوصول</span>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-400 font-medium">الاسم المستعار أو الكامل:</label>
                    <input
                      type="text"
                      required
                      placeholder="اكتب اسمك هنا"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl border border-gray-800 p-3 text-sm focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30 transition-all text-right"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-medium">هل تمتلك حيوان أليف؟</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setHasPet('yes')}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                            hasPet === 'yes'
                              ? 'bg-pink-500/15 border-pink-500/50 text-pink-300'
                              : 'bg-slate-950 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          نعم، أمتلك 🐾
                        </button>
                        <button
                          type="button"
                          onClick={() => setHasPet('no')}
                          className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                            hasPet === 'no'
                              ? 'bg-pink-500/15 border-pink-500/50 text-pink-300'
                              : 'bg-slate-950 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          لا أمتلك ❌
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs text-gray-400 font-medium">من أين رأيت موقعنا لأول مرة؟</label>
                      <select
                        required
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        className="w-full bg-slate-950 text-white rounded-xl border border-gray-800 p-3 text-xs focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/30 transition-all text-right cursor-pointer"
                      >
                        <option value="" disabled>--- اختر المصدر ---</option>
                        <option value="google">بحث جوجل (Google)</option>
                        <option value="internet">تصفح الإنترنت العام</option>
                        <option value="chatgpt">ذكاء اصطناعي ChatGPT</option>
                        <option value="youtube">قنوات يوتيوب (YouTube)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit survey button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                isFormValid()
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-500/10 cursor-pointer active:scale-98'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>إرسال الاستطلاع وحصد النقاط العشوائية</span>
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Laptop, Phone, User, Mail, PhoneCall, Check, ShieldCheck, 
  ArrowLeft, ArrowRight, Square, CheckSquare, Sparkles, Flame, RefreshCw 
} from 'lucide-react';
import { UserProfile } from './types';
import MainScreen from './components/MainScreen';
import SimulatedSMS from './components/SimulatedSMS';
import { playSuccessSound, playErrorSound, playChime } from './utils/audio';

type Stage = 'welcome' | 'register' | 'verify' | 'terms' | 'dashboard';

export default function App() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  
  // Verification code states
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [smsTriggerCount, setSmsTriggerCount] = useState(0);

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Load from local storage on mount (allows persistence, great UX!)
  useEffect(() => {
    const saved = localStorage.getItem('ahmedos_giveaway_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
        setStage('dashboard');
      } catch (e) {
        localStorage.removeItem('ahmedos_giveaway_user');
      }
    }
  }, []);

  // Sync state to local storage when profile updates
  const saveUserProfile = (newProfile: UserProfile | null) => {
    setUserProfile(newProfile);
    if (newProfile) {
      localStorage.setItem('ahmedos_giveaway_user', JSON.stringify(newProfile));
    } else {
      localStorage.removeItem('ahmedos_giveaway_user');
    }
  };

  // Generate a random 4 digit code for stage 3
  const generateNewCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpInput('');
    setSmsTriggerCount(prev => prev + 1);
  };

  const handleWelcomeNext = () => {
    playSuccessSound();
    setStage('register');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      playErrorSound();
      return;
    }
    
    // Prepare validation code & transition
    generateNewCode();
    playSuccessSound();
    setStage('verify');
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      playSuccessSound();
      setStage('terms');
    } else {
      playErrorSound();
    }
  };

  const handleTermsSubmit = () => {
    if (!isTermsChecked) {
      playErrorSound();
      return;
    }

    // Success! Prepare user profile & register
    const finalProfile: UserProfile = {
      name,
      phone,
      email,
      points: 40000, // Starts with a welcome points asset!
      level: 1,
      completedSurveysCount: 0,
      completedDailyPollsCount: 0,
      lastDailyPollTime: null,
      lastSurveyTime: null,
      hasAgreedToTerms: true,
      verificationCode: generatedOtp
    };

    saveUserProfile(finalProfile);
    playSuccessSound();
    setStage('dashboard');
  };

  const handleLogout = () => {
    // Return back to welcome screen and reset stats
    saveUserProfile(null);
    setName('');
    setPhone('');
    setEmail('');
    setOtpInput('');
    setIsTermsChecked(false);
    setStage('welcome');
    playSuccessSound();
  };

  // Modify user profile state from dashboard sub-panels
  const handleUpdateUserProfile = (updater: (prev: UserProfile) => UserProfile) => {
    if (!userProfile) return;
    const updated = updater(userProfile);
    saveUserProfile(updated);
  };

  // Safe checks for verifying code
  const isOtpCorrect = otpInput === generatedOtp;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between select-none relative" dir="rtl">
      
      {/* Absolute high-tech floating vector elements */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-zinc-800/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      {/* Top Banner Branding */}
      <header className="p-5 border-b border-zinc-800/40 glass-panel relative z-20 flex justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-zinc-950 font-bold shadow-md shadow-emerald-500/10">
            <Laptop className="w-4 h-4 text-emerald-950" />
          </div>
          <span className="font-sans font-black text-lg tracking-wider bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
            AhmedOS GiveAWay
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-medium">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
          <span>ONLINE COMPILER v14.3</span>
        </div>
      </header>

      {/* Main Container Stage switcher */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8 z-10">
        <AnimatePresence mode="wait">
          
          {/* STAGE 1: Welcome message & continuation */}
          {stage === 'welcome' && (
            <motion.div
              key="welcome-stage"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel text-center space-y-6 border border-zinc-800 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative overflow-hidden"
            >
              {/* Dynamic light glows */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-emerald-500/20 rounded-full blur-xl"></div>
              
              <div className="space-y-4">
                <div className="inline-block p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-400 rounded-2xl border border-emerald-500/25 shadow-lg shadow-emerald-500/5 animate-pulse-slow">
                  <Laptop className="w-12 h-12" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  مرحباً بك في تطبيق
                  <br />
                  <span className="text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg inline-block mt-1">AhmedOS GiveAWay</span>
                </h2>
                
                <p className="text-xs sm:text-sm text-zinc-350 leading-relaxed font-medium">
                  بوابتك الحصرية للفوز بأروع الهدايا المضمونة المقدمة مجاناً لعملائنا الكرام من شركة <span className="text-emerald-400 font-bold">AhmedOS Pro</span>.
                </p>
                
                <div className="bg-zinc-950/60 p-3.5 rounded-xl text-[11px] sm:text-xs text-zinc-400 border border-zinc-900/80 leading-relaxed text-right space-y-2">
                  <div className="flex items-start gap-1 text-emerald-400">
                    <span className="text-sm">⚡</span>
                    <p className="font-semibold">تأهيل فوري لجوائز حصرية للمنضمين اليوم:</p>
                  </div>
                  <ul className="list-disc list-inside pr-1 space-y-1">
                    <li>لابتوب فائقة التطور بشاشة 17.8 بوصة من الشركة.</li>
                    <li>هاتف AhmedOS المتميز بنظام <span className="font-mono text-amber-400">Kale7AhmedOS Android</span>.</li>
                  </ul>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleWelcomeNext}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-emerald-500/15 cursor-pointer hover:scale-102 flex items-center justify-center gap-2 active:scale-98"
              >
                <span>ابدأ المتابعة والدخول</span>
                <ArrowLeft className="w-4 h-4 shrink-0 text-zinc-950" />
              </button>
            </motion.div>
          )}

          {/* STAGE 2: Register user details form */}
          {stage === 'register' && (
            <motion.form
              key="register-stage"
              onSubmit={handleRegisterSubmit}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border border-zinc-800 shadow-xl"
            >
              <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-zinc-800/10 text-emerald-400 rounded-xl">
                  <User className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-extrabold text-white">سجل هذه البيانات المطلوبة الآن</h3>
                <p className="text-xs text-zinc-400">لإنشاء رخصة أمان مجانية في خادم AhmedOS Pro والبدء بجمع النقاط</p>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                {/* 1. Name */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>الاسم الكامل:</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أحمد عسيري"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 text-white rounded-xl border border-zinc-800 p-3 text-sm focus:border-emerald-550/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all text-right"
                  />
                </div>

                {/* 2. Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>رقم الهاتف الفريد:</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="مثال: +966 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 text-white rounded-xl border border-zinc-800 p-3 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all text-right font-mono"
                  />
                </div>

                {/* 3. Email */}
                <div className="space-y-1.5">
                  <label className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>حساب الإيميل (Email):</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 text-white rounded-xl border border-zinc-800 p-3 text-sm focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all text-right font-mono"
                  />
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <div className="w-5 h-1.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>

              {/* Actions submit */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStage('welcome')}
                  className="w-1/3 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs rounded-xl border border-zinc-800 transition-all hover:text-white"
                >
                  السابق
                </button>
                <button
                  type="submit"
                  disabled={!name || !phone || !email}
                  className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 text-zinc-950 font-black text-sm rounded-xl transition-all shadow-lg hover:scale-102 flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4 shrink-0 text-zinc-950" />
                </button>
              </div>
            </motion.form>
          )}

          {/* STAGE 3: SMS SECURE OTP VERIFICATION */}
          {stage === 'verify' && (
            <motion.div
              key="verify-stage"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border border-zinc-800 shadow-xl"
            >
              {/* Floating on-screen SMS Simulator overlay */}
              <SimulatedSMS
                code={generatedOtp}
                triggerCount={smsTriggerCount}
                onAutoPaste={(code) => setOtpInput(code)}
              />

              <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-zinc-850 text-amber-400 rounded-xl">
                  <ShieldCheck className="w-6 h-6 animate-bounce" />
                </div>
                <h3 className="text-lg font-extrabold text-white">تأكيد رمز التحقق الأمني</h3>
                <p className="text-xs text-zinc-400">
                  يرجى تفقد إشعارات جهازك الآن حيث تم بث رسالة حقيقية فعلية من شركة <span className="text-emerald-400 font-bold">AhmedOS Pro</span>
                </p>
              </div>

              {/* Code indicator display guidance */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 text-right space-y-2">
                <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                  ستتلقى إشعارا للرسائل يحمل الصياغة المعتمدة للشركة:
                </p>
                <p className="text-xs text-emerald-400 font-mono italic pr-2 border-r border-emerald-500/40">
                  "اهلا بك معنا في تطبيق AhmedOS GiveAway رمز التحقق الخاص بك هو : <span className="underline font-bold">{generatedOtp}</span>"
                </p>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1">
                  <span>ℹ️ الرمز يتغير في كل مرة وهو مشفر بالكامل ضد التلاعب.</span>
                </div>
              </div>

              {/* OTP code Input - enforcing "impossible to enter a wrong code" logic */}
              <div className="space-y-2 text-right">
                <label className="text-xs text-zinc-400 font-semibold block">اكتب رمز التحقق المكون من ٤ أرقام:</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="####"
                    value={otpInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      // Block inputs that diverge from characters of generatedOtp (impossible to enter a wrong code!)
                      if (val !== '' && !generatedOtp.startsWith(val)) {
                        playErrorSound(); // Rejection audio
                        return; // Disallow updating state with wrong character
                      }
                      setOtpInput(val);
                    }}
                    className={`w-full text-center bg-zinc-950 text-white rounded-xl border p-3.5 text-lg font-mono tracking-[0.6em] focus:outline-none transition-all ${
                       isOtpCorrect 
                        ? 'border-emerald-500 text-emerald-400 font-extrabold bg-emerald-950/20' 
                        : otpInput.length === 4 
                          ? 'border-rose-500 text-rose-400' 
                          : 'border-zinc-800 focus:border-amber-500/50'
                    }`}
                  />
                  
                  {isOtpCorrect && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs bg-emerald-500/15 px-2 py-1 rounded-md flex items-center gap-1 font-sans">
                      <Check className="w-3 h-3" />
                      <span>مطابق ومضمون</span>
                    </span>
                  )}
                </div>

                {otpInput.length > 0 && !isOtpCorrect && (
                  <p className="text-[11px] text-amber-500/80 font-medium">
                    * يقوم النظام بقبول الأرقام الصحيحة فقط. إذا تغير الرمز، يمكنك طلب رسالة جديدة.
                  </p>
                )}
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <div className="w-5 h-1.5 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
              </div>

              {/* Buttons actions */}
              <div className="flex gap-2 md:gap-3.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    generateNewCode();
                    playChime();
                  }}
                  className="w-1/3 py-3 bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 font-semibold rounded-xl border border-zinc-800 transition-all flex items-center justify-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة بث</span>
                </button>

                <button
                  onClick={handleVerifySubmit}
                  disabled={!isOtpCorrect}
                  className={`flex-1 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    isOtpCorrect
                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer active:scale-98'
                      : 'bg-zinc-850 text-zinc-550 cursor-not-allowed'
                  }`}
                >
                  <span>زر التالي</span>
                  <ArrowLeft className="w-4 h-4 text-zinc-950" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 4: AGREE TO TERMS & CONDITIONS */}
          {stage === 'terms' && (
            <motion.div
              key="terms-stage"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              className="w-full max-w-sm p-6 sm:p-8 rounded-3xl glass-panel space-y-6 border border-zinc-800 shadow-xl"
            >
              <div className="text-center space-y-2">
                <div className="inline-block p-3 bg-teal-500/10 text-teal-400 rounded-xl">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-extrabold text-white">الخطوة الأخيره: الشروط والأحكام</h3>
                <p className="text-xs text-zinc-400">يرجى قراءة والموافقة لضمان حصولك الهام على الجائزة</p>
              </div>

              {/* Beautiful custom contract text area */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-900 max-h-48 overflow-y-auto text-right space-y-2 text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                <p className="font-semibold text-zinc-300">📜 ميثاق المشاركة في AhmedOS GiveAway:</p>
                <ol className="list-decimal list-inside pr-1 space-y-1">
                  <li>يلتزم المشارك بجمع كود المزامنة من جهازه الشخصي بطريقة شرعية بدون اللجوء لمحاولات بوت وتزوير.</li>
                  <li>توفير الهدايا مثل اللابتوب 17.8 والموبايل ذو نظام <span className="font-mono text-amber-400">Kale7AhmedOS</span> يتم شحنها وتوزيعها مجانا للفائزين بالمركز الأول.</li>
                  <li>الموافقة على تحديثات ترقية المستوى Level 2 و Level 3 واستكمال المهام لتحقيق سقف الأرباح.</li>
                  <li>يتعهد موقع AhmedOS Pro بضمان سرية معلومات الاتصال الخاصة بكم.</li>
                </ol>
              </div>

              {/* Click interactive checkbox with feedback */}
              <button
                type="button"
                onClick={() => setIsTermsChecked(!isTermsChecked)}
                className={`w-full p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${
                  isTermsChecked 
                    ? 'bg-teal-500/10 border-teal-500/50 text-white shadow-md shadow-teal-500/5' 
                    : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-800'
                }`}
              >
                <div className="mt-0.5">
                  {isTermsChecked ? (
                    <CheckSquare className="w-5 h-5 text-teal-400" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-600" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-zinc-200">وافق على الشروط والأحكام بالكامل</h4>
                  <p className="text-[10px] text-zinc-400">أوافق على استحقاق المكافآت بحسابي والتوصيل المجاني الشامل.</p>
                </div>
              </button>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                <div className="w-5 h-1.5 rounded-full bg-teal-500 shadow-lg shadow-teal-500/50"></div>
              </div>

              {/* Action next terms */}
              <button
                onClick={handleTermsSubmit}
                disabled={!isTermsChecked}
                className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  isTermsChecked
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-950 shadow-lg shadow-teal-500/20 cursor-pointer active:scale-98'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>موافق وزر التالي</span>
                <ArrowLeft className="w-4 h-4 text-zinc-950" />
              </button>
            </motion.div>
          )}

          {/* STAGE 5: COMPREHENSIVE REWARDS HUB (MainScreen) */}
          {stage === 'dashboard' && userProfile && (
            <motion.div
              key="dashboard-stage"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <MainScreen
                user={userProfile}
                onChangeUser={handleUpdateUserProfile}
                onLogout={handleLogout}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Modern High-End Page footer credits */}
      <footer className="p-4 text-center text-[10px] text-zinc-500 border-t border-zinc-900/40 bg-zinc-950/20 font-sans z-10">
        <p className="tracking-wide">© 2026 AhmedOS Pro Corporation. جميع الحقوق محفوظة للمنتجات الرقمية واللوح الفريد.</p>
      </footer>

    </div>
  );
}

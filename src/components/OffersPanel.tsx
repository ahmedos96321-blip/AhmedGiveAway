import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Award, Download, ShieldAlert, Cpu, CheckCircle2, ChevronLeft, Play } from 'lucide-react';
import { playSuccessSound, playErrorSound } from '../utils/audio';

interface OffersPanelProps {
  level: 1 | 2 | 3;
  onCompleteOffer: (points: number, title: string) => void;
  completedOffers: string[];
}

export default function OffersPanel({ level, onCompleteOffer, completedOffers }: OffersPanelProps) {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'AhmedOS Diagnostics Core v14.3',
    'جاهز لتلقي كود المزامنة والفحص المعتمد...'
  ]);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticSuccess, setDiagnosticSuccess] = useState(false);
  const [activeOfferTab, setActiveOfferTab] = useState<'all' | 'terminal'>('all');

  // Triggering simulated core diagnostics for Command Offer
  const executeAhmedOSCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (terminalInput.trim() === 'I oLA 00AhmedOS') {
      setIsDiagnosticRunning(true);
      setTerminalInput('');
      setTerminalLogs(prev => [...prev, '⚡ جاري الاتصال بالكمبيوتر المحمل بنظام AhmedOS 14.3...']);

      let step = 0;
      const logs = [
        '🔍 فحص نواة النظام (Kernel OS Verification)... [ناجح]',
        '📂 استخراج بيانات شهادة الترخيص الأصلية... [مكتمل]',
        '✅ تأكيد موثوقية رمز AhmedOS الأصلي: I oLA 00AhmedOS',
        '⚙️ تهيئة مصفوفة النقاط السحابية الآمنة لشركة AhmedOS Pro...',
        '🎉 تم فحص هويتك بنجاح وجاري إرسال 12,000 نقطة إلى حسابك!'
      ];

      const interval = setInterval(() => {
        if (step < logs.length) {
          setTerminalLogs(prev => [...prev, logs[step]]);
          step++;
        } else {
          clearInterval(interval);
          setIsDiagnosticRunning(false);
          setDiagnosticSuccess(true);
          playSuccessSound();
          onCompleteOffer(12000, 'فحص ترخيص نظام AhmedOS 14.3 المعتمد');
        }
      }, 900);
    } else {
      playErrorSound();
      setTerminalLogs(prev => [
        ...prev,
        `❌ خطأ: الكود "${terminalInput}" غير مطابق لمعايير فحص AhmedOS 14.3. يرجى التأكد وكتابته بدقة.`
      ]);
    }
  };

  // High paying offers configuration
  const handleStaticOfferComplete = (id: string, title: string, points: number) => {
    if (completedOffers.includes(id)) return;
    
    // Simulate complex background action and award points
    playSuccessSound();
    onCompleteOffer(points, title);
  };

  const getOffersForLevel = () => {
    const list = [
      {
        id: 'o_lite',
        title: 'تحميل متصفح AhmedOS Pro الآمن السريع',
        description: 'قم بتثبيت حزمة تصفح AhmedOS المشفرة بالكامل لحماية خصوصيتك وتسريع التصفح بنسبة 200%.',
        points: level === 3 ? 1200000 : 40000,
        badge: 'موصى به',
        actionText: 'تنزيل وتثبيت المتصفح'
      },
      {
        id: 'o_mid',
        title: 'تفعيل اشتراك سحابة AhmedOS Cloud المفتوح',
        description: 'سعة تخزينية غير محدودة لملفاتك الحساسة مع تشفير كمي عسكري من سيرفرات AhmedOS Pro.',
        points: level === 3 ? 2400000 : 200000,
        badge: 'نقاط فائقة',
        actionText: 'بدء النسخ الاحتياطي السحابي'
      },
      {
        id: 'o_max',
        title: 'المشاركة في معسكر تطوير لغات البرمجة الخاص بـ AhmedOS',
        description: 'احصل على شهادات معتمدة لتلقين وتطوير أنظمة التشغيل وحل المشاكل التقنية المعقدة لمجتمعنا.',
        points: level === 3 ? 3000000 : 500000,
        badge: 'مستوى النخبة',
        actionText: 'التسجيل في المعسكر البرمجي'
      }
    ];
    return list;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-gray-800 relative" dir="rtl">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl rounded-full"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-800 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">العروض المتاحة (Exclusive Offers)</h3>
            <p className="text-xs text-gray-400">نفّذ العروض لربح مئات الآلاف من النقاط بضغطة واحدة</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-gray-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveOfferTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeOfferTab === 'all'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            جميع العروض
          </button>
          <button
            onClick={() => setActiveOfferTab('terminal')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeOfferTab === 'terminal'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>محاكي نظام 14.3</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeOfferTab === 'all' ? (
          <motion.div
            key="offers-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Promo Banner about huge items */}
            <div className="bg-gradient-to-r from-indigo-950/40 via-purple-950/10 to-transparent border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-right">
                <h4 className="text-xs font-bold text-indigo-300">عروض مضاعفة لنقاطك الحالية</h4>
                <p className="text-[11px] text-gray-300 leading-relaxed mt-1">
                  أنت مؤهل الآن لبدء تجميع نقاط ترحيبية ضخمة تتراوح بين <span className="text-indigo-400 font-bold font-mono">40,000</span> إلى <span className="text-indigo-400 font-bold font-mono">500,000</span> في المستوى الحالي!
                  وفي المستوى ٣، تفتح لك عروض برصيد <span className="text-indigo-400 font-bold font-mono">3,000,000</span> نقطة لضمان ربح لابتوب AhmedOS ذو الشاشة 17.8 بوصة.
                </p>
              </div>
            </div>

            {/* Terminal Command Highlight banner if not completed */}
            {!completedOffers.includes('f_diagnostic') && (
              <div className="bg-slate-950/70 border-x-2 border-emerald-500 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-400">العرض الرئيسي الفوري لشركة AhmedOS Pro</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
                    حمل نظام 14.3 الأصلى على جهازك واستعمل ال Command AhmedOS واكتب الكود التالي للحصول على <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/20 text-[10px]">12,000 نقطة</span> فورية!
                  </p>
                  <p className="text-[11px] text-gray-400 font-mono">الكود المطلوب: <span className="text-amber-400 font-bold select-all bg-slate-900 border border-gray-800 px-1.5 py-0.5 rounded">I oLA 00AhmedOS</span></p>
                </div>
                <button
                  onClick={() => setActiveOfferTab('terminal')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1 shrink-0 self-end sm:self-auto shadow-md hover:scale-103"
                >
                  <span>افتح الـ Terminal وجرب الآن</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* List of other offers */}
            <div className="space-y-3">
              {getOffersForLevel().map((offer) => {
                const isDone = completedOffers.includes(offer.id);
                return (
                  <div
                    key={offer.id}
                    className={`bg-slate-900/40 border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-900/60 ${
                      isDone ? 'border-emerald-500/20 opacity-70' : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-semibold text-white">{offer.title}</h4>
                        <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded">
                          {offer.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-lg">{offer.description}</p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-xs sm:text-sm font-mono font-bold text-indigo-400">
                        +{offer.points.toLocaleString()} نقطة
                      </span>
                      
                      {isDone ? (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مكتمل ومضاف</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStaticOfferComplete(offer.id, offer.title, offer.points)}
                          className="bg-slate-950 hover:bg-indigo-600 hover:text-white text-gray-300 border border-gray-800 hover:border-indigo-500 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all active:scale-95 flex items-center gap-1"
                        >
                          <Play className="w-3 h-3 fill-current shrink-0" />
                          <span>{offer.actionText}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Terminal simulator for the special Command Offer */
          <motion.div
            key="terminal-simulator"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-slate-950 border border-gray-800 rounded-xl p-4 overflow-hidden shadow-inner">
              {/* Terminal window buttons */}
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-gray-900">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>AhmedOS_Terminal_v14.3.sh</span>
                </div>
              </div>

              {/* Logs terminal container */}
              <div className="h-44 overflow-y-auto space-y-1.5 text-[11px] font-mono text-emerald-400 text-right select-none pr-1">
                {terminalLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    {log.startsWith('❌') ? (
                      <span className="text-rose-400">{log}</span>
                    ) : log.startsWith('⚡') || log.startsWith('👀') || log.startsWith('🔍') ? (
                      <span className="text-cyan-400">{log}</span>
                    ) : log.startsWith('✅') || log.startsWith('🎉') ? (
                      <span className="text-emerald-300 font-bold">{log}</span>
                    ) : (
                      <span>{log}</span>
                    )}
                  </div>
                ))}
                {isDiagnosticRunning && (
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                    <span>خط فحص AhmedOS نشط... الرجاء عدم إغلاق النافذة</span>
                  </div>
                )}
              </div>

              {/* Terminal code prompt form */}
              {!diagnosticSuccess && !completedOffers.includes('f_diagnostic') ? (
                <form onSubmit={executeAhmedOSCommand} className="mt-4 pt-3 border-t border-gray-900 flex gap-2">
                  <input
                    type="text"
                    disabled={isDiagnosticRunning}
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="اكتب كود AhmedOS 14.3 الأصلي هنا (مثال: I oLA 00AhmedOS)"
                    className="flex-1 bg-slate-900 text-emerald-400 border border-gray-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-right"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    type="submit"
                    disabled={isDiagnosticRunning || !terminalInput.trim()}
                    className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-gray-800 text-slate-950 font-mono font-bold text-xs px-4 py-2 rounded-lg transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    تشغيل الكود
                  </button>
                </form>
              ) : (
                <div className="mt-4 pt-3 border-t border-gray-900 flex items-center justify-between text-xs text-emerald-400 font-medium">
                  <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تم فحص ومطابقة كود نظام 14.3 بنجاح! تم قيد 12,000 نقطة بحسابك.</span>
                  </div>
                  <button
                    onClick={() => {
                      setDiagnosticSuccess(false);
                      setTerminalLogs([
                        'AhmedOS Diagnostics Core v14.3',
                        'جاهز لتلقي كود المزامنة والفحص المعتمد...'
                      ]);
                    }}
                    className="text-[10px] text-gray-500 hover:text-gray-300 font-normal underline"
                  >
                    أعد تصفير المحاكاة
                  </button>
                </div>
              )}
            </div>

            {/* Instruction block */}
            <div className="bg-gray-900/40 border border-gray-800/80 p-3.5 rounded-xl space-y-1.5 text-right">
              <h5 className="text-xs font-bold text-gray-200">طريقة فحص النظام واستحقاق النقاط:</h5>
              <ol className="list-decimal list-inside text-[11px] text-gray-300 space-y-1">
                <li>ثبّت نظام تشغيل <span className="text-emerald-400 font-semibold font-mono">AhmedOS 14.3</span> الأصلي على كمبيوترك.</li>
                <li>افتح لوحة موجه الأوامر <span className="text-emerald-400 font-semibold font-mono">AhmedOS Command Prompt</span>.</li>
                <li>انسخ واكتب الكود الفريد التالي: <span className="text-amber-400 font-bold font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-gray-800 select-all">I oLA 00AhmedOS</span> ثم اضغط Enter.</li>
                <li>سيتحقق الخادم تلقائيًا من رخصة جهازك ويربطها برصيد حسابك، مانحاً إياك <span className="text-emerald-400 font-mono font-bold">12,000 نقطة</span> فورية!</li>
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

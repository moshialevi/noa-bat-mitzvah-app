import React, { useState, useEffect } from 'react';
import { EventDetails } from '../types';
import Confetti from '../components/Confetti';
import { MapPin, Send, Sparkles, Clock, Heart, Navigation, User, Baby, Gamepad2, Minus, Plus, Crown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestViewProps {
  eventDetails: EventDetails;
}

const GuestView: React.FC<GuestViewProps> = ({ eventDetails }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'rsvp'>('home');
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number}>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // RSVP State
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  
  // Detailed Guest Counts
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  
  const [showConfetti, setShowConfetti] = useState(false);
  
  // State to manage image error fallback
  const [imageSrc, setImageSrc] = useState(eventDetails.celebrantImage || eventDetails.heroImage);

  // Update imageSrc when eventDetails changes
  useEffect(() => {
    setImageSrc(eventDetails.celebrantImage || eventDetails.heroImage);
  }, [eventDetails.celebrantImage, eventDetails.heroImage]);

  // Countdown Logic
  useEffect(() => {
    if (!eventDetails?.date) return;
    const targetDate = new Date(eventDetails.date).getTime(); 
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval); return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [eventDetails.date]);

  const handleWhatsAppRSVP = () => {
    // 1. Show Confetti effect
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    // 2. Construct the message
    // "שרי נכנסת לאפליקציה... מקבל ווטספ מהטלפון של שרי: מגיעים 3 מבוגרים 3 ילדים 0 תינוקות"
    const total = adults + children + babies;
    const message = `היי, כאן ${name} 👋
אנחנו מגיעים לחגוג איתכם! (${total} סה"כ)

*פירוט:*
מבוגרים: ${adults}
ילדים: ${children}
תינוקות: ${babies}

נתראה בשמחות! 🎉`;

    // 3. Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${eventDetails.hostPhone}?text=${encodedMessage}`;
    
    // Slight delay to let the confetti pop before switching app
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 800);
  };

  const formattedDate = new Date(eventDetails.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
  const formattedTime = new Date(eventDetails.date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  // Variants for animations
  const fadeIn = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } } };
  const staggerContainer = { visible: { transition: { staggerChildren: 0.15 } } };

  const timeLabels: {[key: string]: string} = {
    days: 'ימים',
    hours: 'שעות',
    minutes: 'דקות',
    seconds: 'שניות'
  };

  // Helper component for count stepper
  const CounterRow = ({ 
    label, 
    subLabel, 
    value, 
    onChange, 
    icon: Icon 
  }: { 
    label: string, 
    subLabel: string, 
    value: number, 
    onChange: (val: number) => void, 
    icon: any 
  }) => (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 mb-3 hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-cyber-accent/20 flex items-center justify-center text-cyber-accent">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{label}</h4>
          <p className="text-xs text-gray-400">{subLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-black/30 rounded-full p-1 border border-white/10">
        <button 
          onClick={() => onChange(Math.max(0, value - 1))}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${value === 0 ? 'text-gray-600' : 'text-white hover:bg-white/10'}`}
        >
          <Minus size={14} />
        </button>
        <span className="font-english font-bold text-lg min-w-[20px] text-center">{value}</span>
        <button 
          onClick={() => onChange(Math.min(10, value + 1))}
          className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="pb-32 min-h-screen font-sans text-cyber-silver overflow-x-hidden selection:bg-cyber-accent selection:text-white">
      <Confetti active={showConfetti} />

      {/* --- Premium Floating Glass Navigation (Only 2 Buttons) --- */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[280px]">
        <div className="glass-panel rounded-full p-1.5 flex justify-between items-center shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-2xl bg-cyber-dark/40">
          {[
            { id: 'home', icon: Heart, label: 'הזמנה' },
            { id: 'rsvp', icon: Send, label: 'אישור הגעה' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex flex-col items-center justify-center w-full py-3 rounded-full transition-all duration-500 relative ${
                activeTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-cyber-accent'
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="nav-pill" 
                  className="absolute inset-0 bg-gradient-to-tr from-cyber-accent/40 to-cyber-neon/40 rounded-full border border-white/10 shadow-[0_0_15px_rgba(167,139,250,0.3)]"
                  transition={{type: "spring", bounce: 0.15, duration: 0.6}} 
                />
              )}
              <tab.icon size={20} className="relative z-10 drop-shadow-md" strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span className="text-[12px] font-medium mt-1 relative z-10 tracking-wide">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.main 
            key="home"
            initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }}
            variants={staggerContainer}
            className="max-w-lg mx-auto px-4 pt-6 space-y-6"
          >
            {/* NEW: Special Portrait Hero Section */}
            <motion.div variants={fadeIn} className="relative mt-8 text-center flex flex-col items-center z-10">
               {/* Ambient Glow */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyber-neon/30 rounded-full blur-[80px] pointer-events-none"></div>
               
               {/* Portrait Container with Float Animation */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                 className="relative mb-6 group cursor-pointer"
               >
                 {/* Rotating Border */}
                 <div className="absolute inset-[-4px] rounded-full border border-dashed border-cyber-accent/60 w-[168px] h-[168px] animate-[spin_10s_linear_infinite]"></div>
                 
                 {/* Main Image Circle */}
                 <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-cyber-accent via-white to-cyber-neon shadow-[0_0_30px_rgba(167,139,250,0.6)] relative z-10">
                    <img 
                      src={imageSrc} 
                      onError={() => {
                          console.log("Failed to load Noa image, falling back to hero.");
                          setImageSrc(eventDetails.heroImage);
                      }}
                      className="w-full h-full object-cover rounded-full border-4 border-black/50 transition-transform duration-700 group-hover:scale-105" 
                      alt="The Celebrant" 
                    />
                 </div>
                 
                 {/* Floating Crown Icon */}
                 <motion.div 
                   animate={{ rotate: [-10, 10, -10] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                   className="absolute -top-4 -left-4 bg-gradient-to-br from-yellow-300 to-amber-500 text-white p-2.5 rounded-full shadow-lg border-2 border-white/20 z-20"
                 >
                   <Crown size={20} fill="currentColor" />
                 </motion.div>

                 {/* Sparkles */}
                 <Sparkles className="absolute top-0 -right-6 text-cyber-accent animate-pulse" size={24} />
                 <Sparkles className="absolute bottom-0 -left-6 text-pink-400 animate-pulse delay-700" size={18} />
               </motion.div>

               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
                  <h2 className="text-sm tracking-[0.3em] text-cyber-accent uppercase mb-1 font-bold drop-shadow-lg flex items-center justify-center gap-2">
                    <span className="h-[1px] w-8 bg-cyber-accent/50"></span>
                    החגיגה מתחילה
                    <span className="h-[1px] w-8 bg-cyber-accent/50"></span>
                  </h2>
                  <h1 className="font-sans text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] tracking-tight">
                    {eventDetails.name}
                  </h1>
                  <p className="font-sans text-xl font-medium text-gray-300 mt-2 bg-white/5 inline-block px-4 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                     {eventDetails.eventType}
                  </p>
               </motion.div>

               {/* Countdown */}
               <div className="flex justify-center gap-3 mt-8" dir="ltr">
                  {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                    <div key={unit} className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl glass-panel flex items-center justify-center border border-white/20 bg-white/5 backdrop-blur-md shadow-lg">
                        <span className="font-english font-bold text-xl text-white drop-shadow-md">
                          {(timeLeft as any)[unit]}
                        </span>
                      </div>
                      <span className="text-[10px] uppercase mt-2 text-gray-400 tracking-wider font-bold">{timeLabels[unit]}</span>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Background Image (Abstract Atmosphere) */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
               <img src={eventDetails.heroImage} className="w-full h-full object-cover blur-[2px]" alt="Atmosphere" />
               <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/80 to-transparent"></div>
            </div>

            {/* Event Info */}
            <motion.div variants={fadeIn} className="glass-panel rounded-[2rem] p-6 relative overflow-hidden group hover:border-cyber-accent/30 hover:scale-[1.01] hover:shadow-2xl transition-all duration-500 z-10 mt-8">
               <div className="absolute -right-12 -top-12 w-40 h-40 bg-cyber-neon/10 rounded-full blur-[60px] pointer-events-none"></div>
               <div className="flex items-center gap-5 mb-6 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-accent/20 to-transparent flex items-center justify-center text-cyber-accent border border-white/10 shadow-[0_0_15px_rgba(167,139,250,0.1)]">
                   <MapPin size={22} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-white tracking-tight">{eventDetails.locationName}</h3>
                   <p className="text-gray-400 text-sm">{eventDetails.address}</p>
                 </div>
               </div>
               <div className="flex items-center gap-5 mb-8 relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-accent/20 to-transparent flex items-center justify-center text-cyber-accent border border-white/10 shadow-[0_0_15px_rgba(167,139,250,0.1)]">
                   <Clock size={22} />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg text-white tracking-tight">{formattedDate}</h3>
                   <p className="text-gray-400 text-sm">קבלת פנים: {formattedTime}</p>
                 </div>
               </div>
               <a href={eventDetails.wazeLink} target="_blank" rel="noreferrer" className="glass-button w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 group relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/20 to-cyber-neon/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <Navigation size={18} className="group-hover:text-cyber-accent transition-colors relative z-10" />
                 <span className="relative z-10">נווט עם Waze</span>
               </a>
            </motion.div>
          </motion.main>
        )}

        {activeTab === 'rsvp' && (
          <motion.main 
            key="rsvp"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-lg mx-auto px-4 pt-10 min-h-[70vh] flex flex-col justify-center relative z-10"
          >
            <div className="glass-panel rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl">
               {/* Decorative Elements */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-accent via-white to-cyber-neon opacity-70"></div>
               
               <div className="mb-8 text-center">
                 <h2 className="text-4xl font-black tracking-tight text-white mb-2 drop-shadow-lg">אישור הגעה</h2>
                 <p className="text-gray-400 text-sm tracking-wide">אנא מלאו פרטים ונשלח ווטסאפ לאישור</p>
               </div>

               <div className="space-y-6">
                 {step === 1 && (
                   <motion.div initial={{x:20, opacity:0}} animate={{x:0, opacity:1}} className="space-y-5">
                     <div>
                       <label className="text-xs text-cyber-accent uppercase font-bold tracking-wider mb-3 block px-1">שם מלא</label>
                       <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/20 border border-white/10 rounded-2xl p-5 text-white focus:border-cyber-accent focus:bg-white/5 outline-none text-lg transition-all placeholder:text-gray-700" placeholder="השם שלך / שם המשפחה" autoFocus />
                     </div>
                     <button onClick={() => name && setStep(2)} className="glass-button w-full bg-cyber-accent hover:bg-cyber-neon text-white font-bold py-5 rounded-2xl mt-4 transition-all text-lg shadow-[0_0_20px_rgba(167,139,250,0.3)]">הבא</button>
                   </motion.div>
                 )}

                 {step === 2 && (
                    <motion.div initial={{x:20, opacity:0}} animate={{x:0, opacity:1}} className="space-y-2">
                      <h3 className="text-white font-bold text-lg mb-4 text-center">כמה מגיעים?</h3>
                      
                      <CounterRow 
                        label="מבוגרים" 
                        subLabel="גיל 15 ומעלה" 
                        value={adults} 
                        onChange={setAdults} 
                        icon={User} 
                      />
                      
                      <CounterRow 
                        label="ילדים" 
                        subLabel="גילאי 3-15" 
                        value={children} 
                        onChange={setChildren} 
                        icon={Gamepad2} 
                      />
                      
                      <CounterRow 
                        label="תינוקות" 
                        subLabel="עד גיל 3" 
                        value={babies} 
                        onChange={setBabies} 
                        icon={Baby} 
                      />
                      
                      <div className="text-center text-sm text-gray-500 my-4 bg-white/5 p-2 rounded-xl border border-white/5">
                         סה"כ אורחים: <span className="text-cyber-accent font-bold">{adults + children + babies}</span>
                      </div>

                      <div className="flex gap-4 mt-6">
                        <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-white/10 text-gray-400 hover:bg-white/5 transition-colors">חזור</button>
                        <button onClick={handleWhatsAppRSVP} className="glass-button flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2">
                          <MessageCircle size={20} />
                          שלח לווטסאפ
                        </button>
                      </div>
                    </motion.div>
                 )}
               </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GuestView;
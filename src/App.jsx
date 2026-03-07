import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Search, CheckCircle2, 
  TrendingUp, Users, MapPin, Twitter, Instagram, 
  Linkedin, Youtube, Star
} from 'lucide-react';

// --- CUSTOM HOOKS ---
const useCounter = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * (end - start) + start));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, start, inView]);

  return [count, ref];
};

// --- DATA ---
const CREATORS = [
  { id: 1, handle: '@foodie_lisa', name: 'Lisa Sharma', followers: '52K', er: '7.3%', niche: 'Food & Dining', icon: '🍕', grad: 'from-orange-400 to-pink-500', rate: '₹3,500', city: 'Delhi' },
  { id: 2, handle: '@travelwithme', name: 'Arjun Patel', followers: '80K', er: '8.1%', niche: 'Travel', icon: '✈️', grad: 'from-blue-400 to-cyan-400', rate: '₹5,000', city: 'Mumbai' },
  { id: 3, handle: '@streetfoodking', name: 'Vikram Das', followers: '120K', er: '6.8%', niche: 'Street Food', icon: '🔥', grad: 'from-yellow-400 to-orange-500', rate: '₹7,000', city: 'Kolkata' },
  { id: 4, handle: '@fashionista_priya', name: 'Priya Menon', followers: '65K', er: '9.2%', niche: 'Fashion', icon: '👗', grad: 'from-pink-400 to-purple-500', rate: '₹4,500', city: 'Bangalore' },
  { id: 5, handle: '@techguru_raj', name: 'Raj Kumar', followers: '45K', er: '5.5%', niche: 'Tech', icon: '💻', grad: 'from-indigo-400 to-blue-500', rate: '₹4,000', city: 'Hyderabad' },
  { id: 6, handle: '@fitnessmaya', name: 'Maya Singh', followers: '90K', er: '7.8%', niche: 'Fitness', icon: '💪', grad: 'from-green-400 to-teal-500', rate: '₹6,000', city: 'Pune' },
  { id: 7, handle: '@artbyneha', name: 'Neha Gupta', followers: '38K', er: '10.2%', niche: 'Art & Design', icon: '🎨', grad: 'from-purple-400 to-pink-400', rate: '₹2,500', city: 'Jaipur' },
  { id: 8, handle: '@delhifoodie', name: 'Rohan Malhotra', followers: '150K', er: '6.1%', niche: 'Food', icon: '🍜', grad: 'from-red-400 to-orange-400', rate: '₹8,000', city: 'Delhi' },
];

const FILTERS = ['All', 'Food', 'Travel', 'Fashion', 'Tech', 'Fitness', 'Lifestyle'];

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700;800&display=swap');
    
    :root {
      --primary: #6A5AE0;
      --primary-light: #4F7DF3;
      --secondary: #7C4DFF;
      --secondary-light: #00C6FF;
      --bg-main: #F7F8FC;
      --text-dark: #1A1A2E;
    }

    body {
      font-family: 'Inter', sans-serif;
      background-color: var(--bg-main);
      color: var(--text-dark);
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6, .font-display {
      font-family: 'Space Grotesk', sans-serif;
      letter-spacing: -0.02em;
    }

    .text-gradient-primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-light), var(--secondary-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .bg-gradient-primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
    }

    .bg-gradient-dark {
      background: linear-gradient(135deg, #0F0E17 0%, #1A1A3E 50%, #1E1E4A 100%);
    }

    .bg-gradient-cta {
      background: linear-gradient(135deg, #6A5AE0 0%, #4F7DF3 40%, #7C4DFF 100%);
    }

    .shadow-primary-glow {
      box-shadow: 0 10px 40px -10px rgba(106, 90, 224, 0.4);
    }

    .glass-nav {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    /* Animations */
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    .animate-float { animation: float 5s ease-in-out infinite; }
    .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite 1.5s; }
    .animate-marquee { animation: marquee 30s linear infinite; }
    
    .hover-underline::after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      transition: width 0.3s ease;
    }
    .hover-underline:hover::after { width: 100%; }

    /* Dot pattern */
    .bg-dots {
      background-image: radial-gradient(#6A5AE0 1px, transparent 1px);
      background-size: 30px 30px;
    }
    .bg-dots-white {
      background-image: radial-gradient(white 1px, transparent 1px);
      background-size: 40px 40px;
    }
  `}} />
);

// --- COMPONENTS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav border-b border-gray-200 shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-[#6A5AE0]/30 group-hover:shadow-[#6A5AE0]/50 transition-shadow">
            <span className="text-white font-display font-bold text-lg">L</span>
          </div>
          <span className="font-display font-bold text-xl text-[#1A1A2E]">Localyse</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How It Works', 'Creators', 'For Business'].map((item) => (
            <a key={item} href={`#${item.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-medium text-gray-600 hover:text-[#6A5AE0] transition-colors relative hover-underline">
              {item}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-4">
          <button className="px-5 py-2.5 rounded-xl border border-[#6A5AE0]/20 text-[#6A5AE0] font-semibold text-sm hover:bg-[#6A5AE0]/5 transition-colors">
            Join as Creator
          </button>
          <button className="px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-primary-glow hover:scale-105 hover:shadow-lg transition-all duration-300">
            Start Campaign
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full glass-nav border-b border-gray-200 py-6 px-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {['Features', 'How It Works', 'Creators', 'For Business'].map((item) => (
              <a key={item} href={`#${item.replace(/\s+/g, '-').toLowerCase()}`} className="text-base font-medium text-gray-800 py-2 border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
              <button className="w-full py-3 rounded-xl border border-[#6A5AE0]/20 text-[#6A5AE0] font-semibold">Join as Creator</button>
              <button className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold">Start Campaign</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden flex items-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-dots opacity-[0.03] z-0 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#6A5AE0] rounded-full blur-[100px] opacity-12 animate-float z-0"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#00C6FF] rounded-full blur-[120px] opacity-10 animate-float-delayed z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F7DF3] rounded-full blur-[150px] opacity-5 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, staggerChildren: 0.1 }}
          className="max-w-[540px]"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6A5AE0]/5 border border-[#6A5AE0]/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-[#6A5AE0]">🚀 India's #1 Hyper-Local Influencer Platform</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-[72px] font-display font-extrabold leading-[1.1] text-[#1A1A2E] mb-6"
          >
            Turn Local Creators Into <span className="text-gradient-primary">Brand Powerhouses</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-10 max-w-[500px]"
          >
            Localyse connects influencers with local businesses to create authentic marketing collaborations that drive real foot traffic and measurable results.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="group px-8 py-4 rounded-2xl bg-gradient-primary text-white font-semibold text-base shadow-primary-glow hover:shadow-[0_20px_50px_-15px_rgba(106,90,224,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
              Start a Campaign
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-2xl bg-white border-2 border-[#6A5AE0]/15 text-[#6A5AE0] font-semibold text-base shadow-lg shadow-gray-200/50 hover:bg-[#6A5AE0]/5 hover:border-[#6A5AE0]/30 hover:scale-105 transition-all duration-300">
              Find Influencers
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}
            className="mt-12 flex items-center gap-6"
          >
            <div className="flex -space-x-3">
              {['#FF4D6D', '#00C6FF', '#6A5AE0', '#FFD84D'].map((color, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: color }}>
                  {['LS', 'AP', 'VD', 'PM'][i]}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold z-10">
                +1K
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A2E]">Trusted by 1,000+ creators</p>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-[#FFD84D] text-[#FFD84D]" />)}
                <span className="text-xs text-gray-500 font-medium ml-1">4.9/5 rating</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content - Dashboard Mockup */}
        <div className="hidden lg:block relative ml-8 h-full min-h-[500px]">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute top-1/2 -translate-y-1/2 w-full bg-white rounded-[24px] shadow-[0_25px_50px_-12px_rgba(106,90,224,0.15)] border border-gray-100 p-6 z-10"
          >
            {/* Window Controls */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-[10px] text-gray-400 font-medium ml-2">Localyse Dashboard</span>
            </div>

            {/* Active Campaigns */}
            <div className="bg-gradient-to-r from-[#6A5AE0]/5 to-transparent rounded-2xl p-4 flex justify-between items-center mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Active Campaigns</p>
                <p className="text-2xl font-display font-bold text-[#1A1A2E]">24</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-[#6A5AE0]/20 text-xl">
                🚀
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50">
                <p className="text-[10px] text-gray-500 mb-1">Total Reach</p>
                <div className="flex items-end gap-2">
                  <p className="text-lg font-bold text-[#1A1A2E]">2.4M</p>
                  <p className="text-[10px] font-bold text-green-600 mb-1">↑ 18%</p>
                </div>
              </div>
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
                <p className="text-[10px] text-gray-500 mb-1">Avg ROI</p>
                <div className="flex items-end gap-2">
                  <p className="text-lg font-bold text-[#1A1A2E]">4.2x</p>
                  <p className="text-[10px] font-bold text-[#4F7DF3] mb-1">↑ 23%</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-[10px] text-gray-500 mb-4">Campaign Performance</p>
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-primary rounded-t-sm opacity-80" style={{ height: 0 }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 1, delay: 0.8 + (i * 0.05), ease: "easeOut" }}
                      className="w-full h-full bg-gradient-primary rounded-t-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
            className="absolute -left-6 top-16 bg-white rounded-2xl shadow-xl shadow-green-500/10 p-4 border border-gray-100 max-w-[220px] z-20 animate-float"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl">📈</div>
              <div>
                <p className="text-xs font-semibold text-green-600">Campaign Success</p>
                <p className="text-[11px] text-gray-500">Burger Bros: +32% traffic</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
            className="absolute -right-8 bottom-32 bg-white rounded-2xl shadow-xl shadow-[#6A5AE0]/10 p-4 border border-gray-100 z-20 animate-float-delayed"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">AP</div>
              <div>
                <p className="text-xs font-semibold text-[#1A1A2E]">@travelwithme</p>
                <p className="text-[11px] text-gray-500">Completed 5 partnerships</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }}
            className="absolute right-4 top-4 bg-gradient-to-r from-[#FFD84D] to-orange-400 rounded-2xl shadow-xl shadow-orange-500/20 px-5 py-3 z-0 animate-float"
            style={{ animationDuration: '4s' }}
          >
            <p className="text-xs font-bold text-white">⚡ Avg ROI: 4.2x</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const MarqueeSection = () => {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-block px-4 py-1.5 rounded-full bg-[#6A5AE0]/5 text-[#6A5AE0] text-sm font-semibold mb-4"
        >
          Creator Network
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#1A1A2E]"
        >
          Trusted by <span className="text-gradient-primary">Top Local Creators</span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 max-w-2xl"
        >
          Our platform hosts thousands of verified influencers across every niche and city
        </motion.p>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        {/* Scrolling Track */}
        <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused] py-4">
          {/* First Set */}
          <div className="flex w-1/2 justify-around">
            {CREATORS.map((creator) => (
              <CreatorCard key={`first-${creator.id}`} creator={creator} />
            ))}
          </div>
          {/* Second Set (Duplicate for seamless loop) */}
          <div className="flex w-1/2 justify-around">
            {CREATORS.map((creator) => (
              <CreatorCard key={`second-${creator.id}`} creator={creator} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const CreatorCard = ({ creator }) => (
  <div className="w-72 mx-3 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-[#6A5AE0]/10 hover:border-[#6A5AE0]/20 hover:-translate-y-2 transition-all duration-300 cursor-pointer flex-shrink-0 group">
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${creator.grad} flex items-center justify-center text-xl shadow-lg border-2 border-white`}>
        {creator.icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm text-[#1A1A2E]">{creator.name}</h4>
        <p className="text-xs font-medium text-[#6A5AE0]">{creator.handle}</p>
      </div>
    </div>
    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
      <div>
        <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">Followers</p>
        <p className="text-xs font-bold text-[#1A1A2E]">{creator.followers}</p>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">Engagement</p>
        <p className="text-xs font-bold text-green-600">{creator.er}</p>
      </div>
    </div>
    <div className="flex justify-between items-center">
      <span className="px-3 py-1 rounded-full bg-[#6A5AE0]/5 text-[#6A5AE0] text-[11px] font-medium">
        {creator.niche}
      </span>
      <span className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin size={10}/> {creator.city}</span>
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    { num: '01', icon: '🔍', title: 'Discover Creators', desc: 'Browse thousands of verified local influencers filtered by city, niche, engagement rate, and audience demographics.', grad: 'from-[#6A5AE0] to-[#4F7DF3]' },
    { num: '02', icon: '🚀', title: 'Launch Campaigns', desc: 'Create campaigns with built-in briefs, set budgets, timelines, and deliverables. Send collaboration requests in one click.', grad: 'from-[#7C4DFF] to-[#00C6FF]' },
    { num: '03', icon: '📊', title: 'Track & Grow', desc: 'Monitor real-time analytics, measure footfall impact, track ROI, and scale winning campaigns across cities.', grad: 'from-[#FF4D6D] to-[#FFD84D]' }
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6A5AE0] rounded-full blur-[120px] opacity-5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#00C6FF] rounded-full blur-[100px] opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-semibold mb-4 shadow-sm">
            Simple Process
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#1A1A2E]">
            How <span className="text-gradient-primary">Localyse</span> Works
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-gray-500 max-w-2xl mx-auto">
            Three simple steps to launch powerful hyper-local influencer campaigns
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line Desktop */}
          <div className="hidden md:block absolute top-[68px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#6A5AE0]/20 via-[#00C6FF]/20 to-[#FF4D6D]/20 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#6A5AE0]/10 hover:border-[#6A5AE0]/10 hover:-translate-y-2 transition-all duration-500 h-full group flex flex-col items-center text-center md:items-start md:text-left"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.grad} flex items-center justify-center text-2xl shadow-lg shadow-gray-200 mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <p className="font-display font-bold text-[#6A5AE0]/40 text-xs uppercase tracking-wider mb-2">STEP {step.num}</p>
                <h3 className="font-display font-bold text-xl text-[#1A1A2E] mb-3">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    { title: 'For Creators', icon: '🎬', grad: 'from-[#6A5AE0] to-[#4F7DF3]', items: ['Monetize your local influence', 'Get matched with relevant brands', 'Manage collaborations in one dashboard', 'Build your professional creator portfolio', 'Get paid securely & on time'] },
    { title: 'For Businesses', icon: '🏪', grad: 'from-[#7C4DFF] to-[#00C6FF]', items: ['Affordable influencer marketing', 'Authentic local reach & trust', 'Data-driven campaign management', 'Increase foot traffic & sales', 'No minimum budget required'] },
    { title: 'For Brands', icon: '🏢', grad: 'from-[#FF4D6D] to-[#6A5AE0]', items: ['Scale hyper-local campaigns', 'Access verified creator network', 'Advanced targeting & filters', 'Enterprise-grade analytics', 'Multi-city campaign management'] }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full bg-[#6A5AE0]/5 text-[#6A5AE0] text-sm font-semibold mb-4">
            Platform Benefits
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#1A1A2E]">
            Built for <span className="text-gradient-primary">Everyone</span> in the Creator Economy
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-gray-500 max-w-2xl mx-auto">
            Whether you're a creator, business, or brand — Localyse has the tools you need
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#6A5AE0]/10 hover:-translate-y-2 transition-all duration-500 h-full relative overflow-hidden group"
            >
              {/* Top hover bar */}
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.grad} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="text-4xl mb-6">{card.icon}</div>
              <h3 className="font-display font-bold text-2xl text-[#1A1A2E] mb-6">{card.title}</h3>
              
              <ul className="space-y-4 mb-8">
                {card.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#6A5AE0] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto pt-4 border-t border-gray-50">
                <a href="#" className="inline-flex items-center text-[#6A5AE0] font-semibold text-sm group-hover:text-[#4F7DF3] transition-colors">
                  Learn More <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsCounter = ({ value, label, delay }) => {
  const [count, ref] = useCounter(value, 2000);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-8 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-500"
    >
      <div className="font-display font-bold text-4xl lg:text-5xl text-white mb-2 tracking-tight">
        {count.toLocaleString()}<span className="text-[#FFD84D]">+</span>
      </div>
      <div className="text-sm font-medium text-white/60">{label}</div>
    </motion.div>
  );
};

const LiveStats = () => {
  return (
    <section className="py-24 bg-gradient-dark relative overflow-hidden">
      <div className="absolute inset-0 bg-dots-white opacity-4 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#6A5AE0] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#00C6FF] rounded-full blur-[120px] opacity-15 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-semibold mb-4">
            Live Platform Stats
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold text-white">
            Growing Every <span className="text-[#FFD84D]">Single Day</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <StatsCounter value={12500} label="Creators Onboarded" delay={0.1} />
          <StatsCounter value={3200} label="Campaigns Launched" delay={0.2} />
          <StatsCounter value={1100} label="Brands Joined" delay={0.3} />
          <StatsCounter value={150} label="Cities Covered" delay={0.4} />
        </div>
      </div>
    </section>
  );
};

const DiscoverUI = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filteredCreators = CREATORS.filter(c => activeFilter === 'All' || c.niche.includes(activeFilter)).slice(0, 4);

  return (
    <section id="creators" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6A5AE0] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full bg-[#6A5AE0]/5 text-[#6A5AE0] text-sm font-semibold mb-4 border border-[#6A5AE0]/10">
            Creator Discovery
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#1A1A2E]">
            Discover the <span className="text-gradient-primary">Perfect Creator</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-gray-500 max-w-2xl mx-auto">
            Search, filter, and connect with verified local influencers in your city
          </motion.p>
        </div>

        {/* Dashboard UI Frame */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(106,90,224,0.1)] border border-gray-100 overflow-hidden"
        >
          {/* Top Window Bar */}
          <div className="bg-gray-50 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="text-[11px] text-gray-400 font-medium font-mono bg-white px-3 py-1 rounded-md border border-gray-200">app.localyse.in/discover</div>
            <div className="w-16"></div>
          </div>

          <div className="p-6 md:p-8">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search influencers in your city..." 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#6A5AE0] focus:ring-2 focus:ring-[#6A5AE0]/10 transition-all"
                />
              </div>
              <button className="bg-gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-[#6A5AE0]/25 hover:opacity-90 transition-opacity whitespace-nowrap">
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-8">
              {FILTERS.map(filter => (
                <button 
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    activeFilter === filter 
                    ? 'bg-gradient-primary text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-[#6A5AE0]/10 hover:text-[#6A5AE0]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Results Table */}
            <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-6 bg-gray-50 p-4 border-b border-gray-100">
                <div className="col-span-2 text-xs uppercase tracking-wider text-gray-500 font-semibold">Creator</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">City</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Followers</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Engagement</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Rate</div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col">
                <AnimatePresence mode="popLayout">
                  {filteredCreators.map((creator, idx) => (
                    <motion.div 
                      key={creator.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: idx * 0.05 }}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-0 p-4 border-b border-gray-50 last:border-0 hover:bg-[#6A5AE0]/[0.02] transition-colors cursor-pointer group items-center"
                    >
                      <div className="col-span-2 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${creator.grad} flex items-center justify-center text-sm shadow-sm border border-white`}>
                          {creator.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A2E]">{creator.name}</p>
                          <p className="text-xs font-medium text-[#6A5AE0]">{creator.handle}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1">📍 {creator.city}</div>
                      <div className="text-sm font-bold text-[#1A1A2E]">{creator.followers}</div>
                      <div>
                        <span className="inline-block px-2.5 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold">
                          {creator.er}
                        </span>
                      </div>
                      <div className="flex items-center justify-between relative">
                        <span className="text-sm font-bold text-[#1A1A2E] group-hover:opacity-0 transition-opacity md:static absolute">{creator.rate}</span>
                        <button className="opacity-0 group-hover:opacity-100 absolute right-0 bg-[#6A5AE0] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all transform translate-x-4 group-hover:translate-x-0">
                          Invite
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredCreators.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm">No creators found for this filter.</div>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <a href="#" className="inline-flex items-center text-[#6A5AE0] font-semibold text-sm hover:text-[#4F7DF3] transition-colors">
                View all 12,500+ creators <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SuccessStories = () => {
  const stories = [
    { brand: 'Burger Bros', handle: '@foodie_lisa', metric: '+32%', label: 'Foot Traffic', emoji: '🍔', desc: 'A 2-week Instagram Reels campaign with Lisa drove massive local awareness and a 32% surge in store visits.' },
    { brand: 'StyleUp Boutique', handle: '@fashionista_priya', metric: '5K+', label: 'Website Visits', emoji: '👗', desc: "Priya's styling content generated 5,000+ website visits and 200+ online orders within the first week." },
    { brand: 'TrekNature Tours', handle: '@travelwithme', metric: '1M+', label: 'Impressions', emoji: '🏔️', desc: "Arjun's travel vlogs showcasing monsoon packages generated over 1 million impressions and 300+ bookings." }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4 border border-blue-100">
            Success Stories
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-display font-bold mb-4 text-[#1A1A2E]">
            Real Results. <span className="text-gradient-primary">Real Growth.</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-gray-500 max-w-2xl mx-auto">
            See how businesses are growing with local creator partnerships
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.15 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#6A5AE0]/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden group flex flex-col"
            >
              <div className="bg-gradient-primary p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                <div className="text-5xl mb-2 relative z-10">{story.emoji}</div>
                <div className="font-display font-bold text-4xl text-white relative z-10">{story.metric}</div>
                <div className="text-white/80 text-sm font-medium relative z-10">{story.label}</div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="font-display font-bold text-xl text-[#1A1A2E]">{story.brand}</h3>
                <p className="text-xs font-semibold text-[#6A5AE0] mb-3">Campaign with {story.handle}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{story.desc}</p>
                
                <div className="border-t border-gray-50 pt-4 mt-auto">
                  <a href="#" className="inline-flex items-center text-[#6A5AE0] font-semibold text-sm group-hover:text-[#4F7DF3] transition-colors">
                    Read Case Study <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-cta rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#6A5AE0]/30"
        >
          {/* Abstract background elements */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute top-1/2 left-[10%] w-32 h-32 bg-[#FFD84D]/10 rounded-full blur-2xl pointer-events-none"></div>
          
          {/* Floating Shapes */}
          <div className="absolute top-[20%] right-[15%] w-8 h-8 bg-[#FFD84D]/30 rounded-lg animate-float rotate-12 backdrop-blur-sm border border-white/20 hidden md:block"></div>
          <div className="absolute bottom-[20%] right-[25%] w-6 h-6 bg-white/20 rounded-full animate-float-delayed backdrop-blur-sm hidden md:block"></div>
          <div className="absolute top-[30%] left-[15%] w-4 h-4 bg-[#FF4D6D]/30 rounded-full animate-float backdrop-blur-sm hidden md:block" style={{animationDuration: '3s'}}></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.1]">
              Start Growing With <span className="text-[#FFD84D]">Local Creators</span> Today
            </h2>
            <p className="text-white/80 text-lg max-w-[640px] mx-auto mb-10">
              Join thousands of businesses and creators who are already building authentic local partnerships on Localyse.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-4 rounded-2xl bg-white text-[#6A5AE0] font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Get Started Free
              </button>
              <button className="px-10 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base hover:bg-white/20 hover:scale-105 transition-all duration-300">
                Join as Creator
              </button>
            </div>
            
            <p className="text-white/50 text-sm mt-8">
              No credit card required • Free forever for creators • Setup in 2 minutes
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0F0E17] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-16">
          {/* Brand Col */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-display font-bold text-lg">L</span>
              </div>
              <span className="font-display font-bold text-xl text-white">Localyse</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[320px] mb-6">
              India's leading hyper-local influencer marketing platform. Connecting creators with local businesses for authentic collaborations.
            </p>
            <div className="flex gap-3">
              {[Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#6A5AE0] hover:border-[#6A5AE0] hover:text-white transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          {[
            { title: 'Platform', links: ['Find Creators', 'Launch Campaign', 'Analytics', 'Pricing', 'API'] },
            { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press Kit', 'Contact'] },
            { title: 'Resources', links: ['Help Center', 'Creator Guide', 'Business Guide', 'Case Studies', 'Community'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Data Processing'] }
          ].map((col, idx) => (
            <div key={idx}>
              <h4 className="font-display font-semibold text-sm text-white/90 mb-6">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-400 hover:text-[#6A5AE0] transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-8 pb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h4 className="font-semibold text-white mb-1">Stay in the loop</h4>
            <p className="text-gray-400 text-sm">Get the latest updates on new features, creator spotlights, and tips.</p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-[#6A5AE0] focus:ring-1 focus:ring-[#6A5AE0] w-full md:w-[250px] transition-all"
            />
            <button className="bg-gradient-primary text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2025 Localyse. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(link => (
              <a key={link} href="#" className="text-gray-500 text-sm hover:text-[#6A5AE0] transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <MarqueeSection />
        <HowItWorks />
        <Benefits />
        <LiveStats />
        <DiscoverUI />
        <SuccessStories />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { userService } from '../services/userService';
import RegisterForm from './RegisterForm';

const LaunchScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [tempGoogleData, setTempGoogleData] = useState<any>(null);
  const [userIP, setUserIP] = useState<string>('---.---.---.---');
  const [latency, setLatency] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');

  const fetchProfile = async () => {
    try {
      const profileRes = await userService.getProfile();
      const profile = profileRes.data || profileRes;
      setUser({ ...profile, isLoggedIn: true });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      // If profile fails but we have token, maybe user needs to register
      if (tempGoogleData) {
        setShowRegisterForm(true);
      } else {
        localStorage.removeItem('synapse_auth_token');
        setUser(null);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('synapse_auth_token');
    if (token) {
      fetchProfile();
    }

    // Set current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
    setCurrentDate(formattedDate);

    // Fetch user IP and measure latency
    const fetchNetworkInfo = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch('https://api.ipify.org?format=json');
        const endTime = performance.now();
        const data = await response.json();
        
        setUserIP(data.ip);
        setLatency(Math.round(endTime - startTime));
      } catch (error) {
        console.error('Failed to fetch network info:', error);
        setUserIP('Unknown');
      }
    };

    fetchNetworkInfo();
  }, []);

  const handleLoginSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        // 1. Exchange Google Token for Synapse JWT
        const synapseToken = await userService.authenticate(credentialResponse.credential);

        // 2. Store Synapse JWT (this is what the backend expects)
        localStorage.setItem('synapse_auth_token', synapseToken);

        const decoded: any = jwtDecode(credentialResponse.credential);
        setTempGoogleData(decoded);

        // 3. Fetch profile with the new token
        const profileRes = await userService.getProfile();
        const profile = profileRes.data || profileRes;
        setUser({ ...profile, isLoggedIn: true });
      } catch (err) {
        console.error('Auth/Profile error:', err);
        // If profile fetch fails, user likely needs to register
        setShowRegisterForm(true);
      }
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('synapse_auth_token');
    setUser(null);
    setTempGoogleData(null);
  };

  const scrollToSchedule = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const scheduleElement = document.getElementById('schedule');
    if (scheduleElement) {
      scheduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden h-screen w-screen selection:bg-primary selection:text-white relative flex flex-col">
      {showRegisterForm && tempGoogleData && (
        <RegisterForm
          user={{ email: tempGoogleData.email, name: tempGoogleData.name }}
          onSuccess={() => {
            setShowRegisterForm(false);
            fetchProfile();
          }}
          onCancel={() => {
            setShowRegisterForm(false);
            handleLogout();
          }}
        />
      )}
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.15]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0579c7]/10 via-transparent to-transparent"></div>
        <div className="scanline"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full w-full">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#213a4a]/50 bg-background-dark/80 backdrop-blur-md px-6 py-4 lg:px-10 z-50">
          <div className="flex items-center gap-3 text-white">
            <div className="size-8 flex items-center justify-center rounded bg-primary/20 text-primary border border-primary/30">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <div>
              <h2 className="text-white text-lg font-bold leading-tight tracking-tight">IEEE Synapse</h2>
              <p className="text-[10px] text-gray-400 font-mono leading-none tracking-widest uppercase opacity-70">v.2026.1.0-RC</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  <span className="text-xs text-slate-300 font-medium hidden lg:block">{user.name}</span>
                  <div className="size-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => {
                    console.log('Login Failed');
                  }}
                  theme="filled_black"
                  shape="pill"
                  size="medium"
                />
              </div>
            )}
            <Link to="/ide" className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary hover:bg-primary/90 transition-all text-white text-sm font-bold shadow-[0_0_15px_rgba(5,121,199,0.5)] hover:shadow-[0_0_25px_rgba(5,121,199,0.7)] border border-primary/50">
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span className="truncate">Launch Editor</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-y-auto relative" style={{ scrollBehavior: 'smooth' }}>
          {/* Floating Code Fragments */}
          <div className="absolute top-20 left-10 opacity-10 hidden lg:block font-mono text-xs text-primary select-none pointer-events-none">
            <p>function initSynapse() {'{'}</p>
            <p>&nbsp;&nbsp;const core = new NeuralNet();</p>
            <p>&nbsp;&nbsp;core.connect();</p>
            <p>{'}'}</p>
          </div>
          <div className="absolute bottom-40 right-10 opacity-10 hidden lg:block font-mono text-xs text-primary select-none pointer-events-none text-right">
            <p>// Optimizing pathways...</p>
            <p>if (ready) return true;</p>
            <p>await loadModules(['algo', 'dev']);</p>
          </div>

          {/* Hero Section - Centered */}
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="layout-content-container flex flex-col items-center max-w-[960px] w-full z-20 -translate-y-16">
              <div className="flex flex-col gap-6 items-center justify-center p-4 text-center">

              <div className="flex flex-col gap-1 text-center relative">
                <h1 className="glitch-text text-white text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter" data-text="SYNAPSE">
                  SYNAPSE
                </h1>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50"></span>
                  <span className="text-primary text-2xl md:text-4xl font-bold tracking-[0.2em] opacity-90">2026</span>
                  <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50"></span>
                </div>
              </div>
              <h2 className="text-gray-400 font-mono text-sm md:text-base lg:text-lg max-w-xl mt-4">
                <span className="text-primary mr-2">&gt;</span>IEEE’s Flagship Week<span className="animate-pulse">_</span>
              </h2>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
                <Link to="/ide" className="group relative flex min-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-14 px-8 bg-primary hover:bg-[#046cb3] text-white transition-all duration-300 shadow-[0_0_20px_rgba(5,121,199,0.4)] hover:shadow-[0_0_40px_rgba(5,121,199,0.6)] border border-primary/50">
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] hover:animate-[shimmer_2s_linear_infinite]"></div>
                  <style>{`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                  `}</style>
                  <span className="relative text-lg font-bold tracking-wide mr-2">INITIALIZE IDE</span>
                  <span className="material-symbols-outlined relative group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <a href="#schedule" onClick={scrollToSchedule} className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-14 px-6 border border-[#213a4a] bg-[#15232d]/50 hover:bg-[#213a4a] text-gray-300 hover:text-white font-medium transition-colors backdrop-blur-sm">
                  <span className="text-sm tracking-wide">VIEW SCHEDULE</span>
                </a>
              </div>
            </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="w-full max-w-[1400px] mx-auto px-4">
            <section id="schedule" className="w-full py-20">
              <div className="flex flex-col gap-2 mb-12">
                <h3 className="text-primary font-mono text-sm tracking-[0.3em] uppercase">Timeline</h3>
                <h2 className="text-white text-4xl font-bold">Event Schedule 2026</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    day: "Day 1",
                    date: "16 Feb",
                    events: [
                      { name: "Inauguration", venue: "E-Block", prize: "Lamp Lighting" },
                      { name: "Locked In Hackathon", venue: "AIC/TnP", prize: "Prize: Rs. 12,000" },
                      { name: "Podcast", venue: "E-Block", prize: "Gifts: Rs. 4,000" },
                      { name: "Imagium", venue: "—", prize: "Rs. 2,000 (Winners)" },
                    ]
                  },
                  {
                    day: "Day 2",
                    date: "17 Feb",
                    events: [
                      { name: "Designathon", venue: "AIC/TnP", prize: "Prizes: Rs. 3,000" },
                      { name: "Gaming Event", venue: "AIC", prize: "Prize: Rs. 3,000" },
                    ]
                  },
                  {
                    day: "Day 3",
                    date: "18 Feb",
                    events: [
                      { name: "EarthWear", venue: "Amphi Theatre", prize: "Prizes/Gifts: Rs. 14,200" },
                      { name: "FrameSync", venue: "—", prize: "Prizes: Rs. 5,000" },
                      { name: "Spin the Wheel", venue: "Amphi Theatre", prize: "Gifts: Rs. 8,000" },
                    ]
                  },
                  {
                    day: "Day 4",
                    date: "19 Feb",
                    events: [
                      { name: "IEEE Startup Sprint", venue: "AIC", prize: "Prizes: Rs. 22,500" },
                      { name: "IPL Auction", venue: "E-Block", prize: "Prize: Rs. 3,000" },
                    ]
                  },
                  {
                    day: "Day 5",
                    date: "20 Feb",
                    events: [
                      { name: "Treasure Hunt", venue: "TnP", prize: "Prize: Rs. 2,000" },
                      { name: "Stock Trading", venue: "TnP", prize: "Prizes: Rs. 3,000" },
                      { name: "Closing Ceremony", venue: "E-Block", prize: "IEEE Mentors" },
                    ]
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#15232d]/40 border border-[#213a4a]/50 rounded-xl p-6 backdrop-blur-sm group hover:border-primary/50 transition-all">
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <span className="text-primary font-mono text-xs uppercase tracking-widest">{item.day}</span>
                        <h4 className="text-white text-2xl font-bold">{item.date}</h4>
                      </div>
                      <span className="material-symbols-outlined text-primary/20 group-hover:text-primary/100 transition-colors text-3xl">calendar_month</span>
                    </div>
                    <div className="space-y-4">
                      {item.events.map((ev, eIdx) => (
                        <div key={eIdx} className="relative pl-4 border-l border-primary/20">
                          <div className="text-slate-200 font-bold text-sm">{ev.name}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">
                            <span className="material-symbols-outlined text-[12px]">location_on</span>
                            {ev.venue}
                            <span className="mx-1 opacity-20">|</span>
                            <span className="text-primary/80">{ev.prize}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-[#213a4a] bg-[#0f1b23] py-2 px-4 z-50">
          <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-mono text-[#5b7a8c] gap-2">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]">public</span>
                IP: {userIP}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px] text-emerald-500">wifi</span>
                ONLINE
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] sm:text-[14px]">speed</span>
                LATENCY: {latency !== null ? `${latency}ms` : '---ms'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="opacity-50">© IEEE 2026</span>
              <span className="hidden sm:inline-block w-[1px] h-3 bg-[#213a4a]"></span>
              <span className="hidden sm:inline-block">{currentDate || 'LOADING...'}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LaunchScreen;
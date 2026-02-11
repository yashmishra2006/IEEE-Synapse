import React, { useState, useEffect } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import {
  LogOut,
  Activity,
  Globe,
  Info,
  ArrowRight
} from 'lucide-react';
import { userService } from '../services/userService';
import RegisterForm from './RegisterForm';
import { Spotlight } from './ui/Spotlight';
import FlickeringGrid from './ui/FlickeringGrid';
import DecryptedText from './ui/DecryptedText';
import ShinyText from './ui/ShinyText';
import { EventsSection } from './sections/EventsSection';
import { TeamSection } from './sections/TeamSection';
import { ScheduleSection } from './sections/ScheduleSection';
import { AboutSection } from './sections/AboutSection';
import TeamRegistrationModal from './TeamRegistrationModal';

import { useAuth } from '../context/AuthContext';
import ViewTeamModal from './ViewTeamModal';

const LaunchScreen: React.FC = () => {
  const {
    user,
    handleLoginSuccess,
    handleLogout,
    fetchProfile,
    showRegisterForm,
    setShowRegisterForm,
    handleRegisterEvent,
    handleUnregisterEvent,
    refreshRegistrationData,
    showTeamModal,
    setShowTeamModal,
    showViewTeamModal,
    setShowViewTeamModal,
    selectedTeam,
    registeringFor,
    availableEvents,
    triggerLogin,
    setSelectedTeam
  } = useAuth();

  // Find event and check if it's the exempt hackathon
  const event = registeringFor ? availableEvents.find(e => e.id === registeringFor) : null;
  const eventName = event?.event_name || 'Event';
  const isHackathon = eventName.toLowerCase().includes('hackathon');

  const [userIP, setUserIP] = useState<string>('---.---.---.---');
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-display selection:bg-primary/30 selection:text-white overflow-x-hidden scroll-smooth">
      {showRegisterForm && (
        <RegisterForm
          user={user}
          onSuccess={() => {
            setShowRegisterForm(false);
            fetchProfile();
            if (registeringFor) handleRegisterEvent(registeringFor);
          }}
          onCancel={() => {
            setShowRegisterForm(false);
          }}
        />
      )}

      {showTeamModal && registeringFor && (
        <TeamRegistrationModal
          eventId={registeringFor}
          eventName={eventName}
          onSuccess={() => {
            setShowTeamModal(false);
            refreshRegistrationData();
            alert('Team synchronization successful!');
          }}
          onCancel={() => {
            setShowTeamModal(false);
            if (!isHackathon) {
              handleUnregisterEvent(registeringFor);
              alert('Team is mandatory for this event. You have been unregistered.');
            }
          }}
        />
      )}

      {showViewTeamModal && selectedTeam && (
        <ViewTeamModal
          team={selectedTeam}
          onClose={() => setShowViewTeamModal(false)}
        />
      )}

      {/* Header */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-6">
        <header className="flex h-16 items-center justify-between gap-4 w-full max-w-6xl px-6 md:px-10 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col">
              <h1 className="text-lg font-black tracking-tighter uppercase leading-none">IEEE GGSIPU</h1>
              <p className="text-[8px] font-mono text-primary tracking-[0.2em] uppercase mt-0.5">Synapse 2026</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Events', 'Schedule', 'About', 'Team'].map((item) => (
              item === 'Events' ? (
                <Link
                  key={item}
                  to="/events"
                  className="text-[10px] font-bold text-white/40 hover:text-white transition-all uppercase tracking-[0.2em] relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"></span>
                </Link>
              ) : (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-[10px] font-bold text-white/40 hover:text-white transition-all uppercase tracking-[0.2em] relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full"></span>
                </button>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-sm shadow-[0_0_15px_rgba(5,121,199,0.2)]">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all shadow-inner"
                >
                  <LogOut className="h-3.5 w-3.5 text-white/70 group-hover:text-red-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={triggerLogin}
                className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/10 transition-all active:scale-95 group"
              >
                <div className="absolute opacity-0 pointer-events-none scale-0">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log('Login Failed')}
                    shape="circle"
                    type="icon"
                  />
                </div>
                <svg className="h-4 w-4 relative z-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.1c-.22-.66-.35-1.39-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {/* Hidden real button to maintain auth logic */}
                <div className="absolute opacity-0 pointer-events-none scale-0">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.log('Login Failed')}
                    shape="circle"
                    type="icon"
                  />
                </div>
              </button>
            )}
            <Link
              to="/events"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] font-bold text-black hover:bg-white/90 transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)] group"
            >
              <Activity className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
              <span className="tracking-widest">REGISTER NOW</span>
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-20 px-6 min-h-screen overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />

        <div className="absolute inset-0 z-0">
          <FlickeringGrid
            squareSize={3}
            gridGap={5}
            color="rgb(5, 121, 199)"
            flickerChance={0.2}
            maxOpacity={0.15}
            className="opacity-40"
          />
        </div>

        <div className="relative z-10 max-w-5xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-mono tracking-[0.4em] uppercase bg-primary/10 border border-primary/20 rounded-full text-primary">
              The Flagship Week • Feb 16-20, 2026
            </span> */}

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-10 leading-[0.85]">
              <DecryptedText
                text="SYNAPSE 11.0"
                animateOn="view"
                className="inline-block"
              />
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-16 font-light leading-relaxed">
              Experience the convergence of technology, creativity, and competition.
              Five days of high-stakes innovation at <span className="text-white font-medium">IEEE GGSIPU</span>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/events"
                className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
              >
                <span className="tracking-widest">REGISTER NOW</span>
                <div className="h-6 w-px bg-black/20"></div>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => scrollToSection('about')}
                className="flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full font-bold transition-all"
              >
                <span>CORE MISSION</span>
                <Info className="h-5 w-5 text-primary" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating elements/scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer" onClick={() => scrollToSection('events')}>
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Explore More</span>
          <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
        </div>
      </section>

      {/* Components mapped to Navbar buttons */}
      <EventsSection />
      <ScheduleSection />
      <AboutSection />
      <TeamSection />

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-black tracking-tighter uppercase">IEEE Synapse 11.0</h2>
              </div>
              <p className="text-white/40 text-sm max-w-sm font-light leading-relaxed">
                The annual tech-fest of IEEE GGSIPU. Bringing together the brightest minds to innovate, collaborate, and transcend.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm text-white/40">
                <li><button onClick={() => scrollToSection('schedule')} className="hover:text-primary transition-colors">Event Schedule</button></li>
                <li><button onClick={() => scrollToSection('schedule')} className="hover:text-primary transition-colors">Registration Hub</button></li>
                <li><button className="hover:text-primary transition-colors">Code of Conduct</button></li>
                <li><button className="hover:text-primary transition-colors">Sponsorships</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-white/40">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
            <div className="flex items-center gap-8 text-[10px] font-mono text-white/20 uppercase tracking-widest">
              <span>© 2026 IEEE GGSIPU</span>
              <span className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                IP: {userIP}
              </span>
              <span className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-emerald-500" />
                LATENCY: {latency || '--'}ms
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition-all">
                <Info className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LaunchScreen;
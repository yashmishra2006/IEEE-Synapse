import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code, Mic, Image as ImageIcon, PenTool, Gamepad2, ChevronRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredEvents = [
    {
        name: "Locked In Hackathon",
        desc: "An 8-hour sprint to build the future. Innovation at its peak.",
        icon: Code,
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/20"
    },
    {
        name: "Gaming Event",
        desc: "Show your competitive skills in the gaming arena.",
        icon: Gamepad2,
        color: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/20"
    },
    {
        name: "Designathon",
        desc: "Craft experiences that matter. UI/UX design challenge.",
        icon: PenTool,
        color: "from-orange-500/20 to-red-500/20",
        border: "border-orange-500/20"
    },
    {
        name: "Startup Sprint",
        desc: "Pitch your startup idea and win prizes of Rs. 22,500.",
        icon: Rocket,
        color: "from-emerald-500/20 to-teal-500/20",
        border: "border-emerald-500/20"
    }
];

export const EventsSection: React.FC = () => {
    return (
        <section id="events" className="py-32 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="text-left">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            Featured Events
                        </motion.h2>
                        <p className="text-white/40 max-w-2xl">
                            Discover the flagship competitions and sessions that define Synapse 2026.
                        </p>
                    </div>

                    <Link
                        to="/events"
                        className="flex items-center gap-2 group px-6 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all"
                    >
                        <span className="text-sm font-bold tracking-widest uppercase">View All Events</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredEvents.map((event, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-[2rem] bg-gradient-to-br ${event.color} border ${event.border} hover:scale-[1.02] transition-all cursor-default group`}
                        >
                            <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-black transition-all">
                                <event.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{event.name}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">
                                {event.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

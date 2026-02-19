import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Cpu, Mic, Image as ImageIcon, PenTool, Gamepad2,
    Leaf, Camera, RotateCw, Rocket, Gavel, Map as MapIcon,
    TrendingUp, Award, Activity, MapPin, Trophy
} from 'lucide-react';
import { cn } from '../../utils/cn';

const scheduleData = [
    {
        day: "Day 1",
        date: "23 Feb",
        events: [
            { name: "Inauguration Day", venue: "E-Block", prize: "Lamp Lighting", icon: "sparkles" },
            { name: "Treasure Hunt", venue: "TnP Room", prize: "Rs. 2,000", icon: "map" },
            { name: "Designathon", venue: "TnP Room", prize: "Rs. 3,000", icon: "pen-tool" },
            { name: "Gaming Event", venue: "TnP Room", prize: "Rs. 3,000", icon: "gamepad" },
        ]
    },
    {
        day: "Day 2",
        date: "24 Feb",
        events: [
            { name: "IPL Auction", venue: "E-Block", prize: "Rs. 3,000", icon: "gavel" },
        ]
    },
    {
        day: "Day 3",
        date: "25 Feb",
        events: [
            { name: "Podcast", venue: "E-Block", prize: "Rs. 4,000", icon: "mic" },
            { name: "FrameSync", venue: "E-Block", prize: "Rs. 5,000", icon: "camera" },
            { name: "Spin the Wheel", venue: "E-Block", prize: "Rs. 8,000", icon: "rotate-cw" },
        ]
    },
    {
        day: "Day 4",
        date: "26 Feb",
        events: [
            { name: "Locked In Hackathon", venue: "AIC", prize: "Rs. 12,000", icon: "code" },
        ]
    },
    {
        day: "Day 5",
        date: "27 Feb",
        events: [
            { name: "Closing Ceremony", venue: "E-Block", prize: "Certificates", icon: "award" },
        ]
    }
];

export const ScheduleSection: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <section id="schedule" className="py-32 px-6 bg-black relative border-y border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Event Timeline</h2>
                        <p className="text-white/40 font-light max-w-md">Navigate through five days of intensive innovation starting February 23, 2026.</p>
                    </div>

                    <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                        {scheduleData.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveTab(idx)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-sm font-bold transition-all",
                                    activeTab === idx
                                        ? "bg-white text-black shadow-lg"
                                        : "text-white/40 hover:text-white"
                                )}
                            >
                                {day.day}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {scheduleData[activeTab].events.map((event, i) => {
                            const IconComponent = {
                                sparkles: Zap,
                                code: Cpu,
                                mic: Mic,
                                image: ImageIcon,
                                "pen-tool": PenTool,
                                gamepad: Gamepad2,
                                leaf: Leaf,
                                camera: Camera,
                                "rotate-cw": RotateCw,
                                rocket: Rocket,
                                gavel: Gavel,
                                map: MapIcon,
                                "trending-up": TrendingUp,
                                award: Award
                            }[event.icon] || Activity;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500"
                                >
                                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <IconComponent className="h-6 w-6 opacity-60 group-hover:opacity-100" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{event.name}</h3>
                                    <div className="flex flex-col gap-2 mt-6">
                                        <div className="flex items-center gap-2 text-xs text-white/40 font-medium">
                                            <MapPin className="h-3.5 w-3.5" />
                                            <span>{event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-primary/80 font-mono">
                                            <Trophy className="h-3.5 w-3.5" />
                                            <span>{event.prize}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

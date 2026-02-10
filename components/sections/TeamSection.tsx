import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const teamMembers = [
    {
        name: "Alex River",
        role: "President, IEEE",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    },
    {
        name: "Sarah Chen",
        role: "Technical Head",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        name: "Marcus Thorne",
        role: "Events Manager",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
    {
        name: "Elena Vance",
        role: "Creative Director",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    }
];

export const TeamSection: React.FC = () => {
    return (
        <section id="team" className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Team</h2>
                    <p className="text-white/40 max-w-xl mx-auto">The brilliant minds working tirelessly behind the scenes to make Synapse 2026 a reality.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative"
                        >
                            <div className="aspect-square rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 mb-6 group-hover:border-primary/50 transition-all">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                />
                            </div>
                            <h4 className="text-xl font-bold text-center mb-1">{member.name}</h4>
                            <p className="text-sm text-primary text-center font-mono">{member.role}</p>

                            <div className="flex justify-center gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all">
                                <Github className="h-4 w-4 text-white/40 hover:text-white cursor-pointer" />
                                <Linkedin className="h-4 w-4 text-white/40 hover:text-white cursor-pointer" />
                                <Twitter className="h-4 w-4 text-white/40 hover:text-white cursor-pointer" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

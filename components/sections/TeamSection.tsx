import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../../utils/cn';

const chairperson = {
    name: "Shri Yash Ji",
    role: "Chairperson, IEEE",
    image: "image.png",
};

const coreTeam = [
    {
        name: "Yash Singh",
        role: "Chairperson, IEEE",
        image: "image.png",
    },
    {
        name: "Riya Jindal",
        role: "Gen Sec, IEEE",
        image: "riya.jpeg",
    },
    {
        name: "Khwahish Kapil",
        role: "Chairperson, WIE",
        image: "khwaish.jpeg",
    },

    {
        name: "Mischa",
        role: "Head, PR",
        image: "mischa.webp",
    },
    {
        name: "Unnati",
        role: "Head, Logistics",
        image: "unnati.jpeg",
    },

    {
        name: "Riddhima",
        role: "Treasurer",
        image: "ridhima.jpeg",
    }
];

const techTeam = [
    {
        name: "Yash Mishra",
        role: "Technical Head",
        image: "yash1.jpg",
    },
    {
        name: "Arkin Kansra",
        role: "Technical Head",
        image: "arkin.png",
    },
    {
        name: "Arnesh",
        role: "Backend Team",
        image: "arnesh.jpeg",
    },
    {
        name: "Ansh",
        role: "Technical Head",
        image: "ansh.jpeg",
    },
    {
        name: "Khushi Bhaskar",
        role: "WIE Tech Head",
        image: "khushi1.jpeg",
    },
    {
        name: "Lipika Aggarwal",
        role: "WIE Tech Head",
        image: "lipika.png",
    }
];

const MemberCard = ({ member, i }: { member: any, i: number, key?: any }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="group relative"
    >
        <div className="aspect-square rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 mb-6 group-hover:border-primary/50 transition-all relative">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
            />
        </div>
        <h4 className="text-xl font-bold text-center mb-1 group-hover:text-primary transition-colors">{member.name}</h4>
        <p className="text-[10px] text-white/40 text-center font-mono uppercase tracking-widest">{member.role}</p>

        <div className="flex justify-center gap-4 mt-6 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
            <Github className="h-4 w-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="h-4 w-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="h-4 w-4 text-white/40 hover:text-white cursor-pointer transition-colors" />
        </div>
    </motion.div>
);

export const TeamSection: React.FC = () => {
    return (
        <section id="team" className="py-20 lg:py-32 px-6 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16 lg:mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
                    >
                        The Organizers
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 uppercase">
                        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Team</span>
                    </h2>
                    <p className="text-white/40 max-w-xl mx-auto text-sm leading-relaxed">
                        The brilliant minds working tirelessly behind the scenes to make Synapse 2026 a reality.
                    </p>
                </div>

                {/* Core Leadership */}
                <div className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="text-xs font-mono text-white/20 uppercase tracking-[0.3em]">Core Leadership</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {coreTeam.map((member, i) => (
                            <MemberCard key={i} member={member} i={i} />
                        ))}
                    </div>
                </div>

                {/* Technical Team */}
                <div>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="text-xs font-mono text-white/20 uppercase tracking-[0.3em]">Technical Architects</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        {techTeam.map((member, i) => (
                            <MemberCard key={i} member={member} i={i} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

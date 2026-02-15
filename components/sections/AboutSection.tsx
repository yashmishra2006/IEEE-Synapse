import React from 'react';
import { Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
    return (
        <section id="about" className="py-20 lg:py-32 px-6 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div>
                    <span className="text-xs font-mono text-primary uppercase tracking-[0.4em] mb-4 block">Core Experience</span>
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">What is<br />IEEE WEEK?</h2>
                    <div className="space-y-6">
                        {[
                            { title: 'Innovation First', desc: 'Focus on cutting-edge technologies and solving real-world problems through hackathons and designathons.' },
                            { title: 'Global Community', desc: 'Connect with mentors, industry professionals, and like-minded peers from across the IEEE network.' },
                            { title: 'Skill Evolution', desc: 'Upskill with hands-on workshops and expert sessions throughout the five-day marathon.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="h-12 w-12 shrink-0 rounded-full border border-white/10 flex items-center justify-center text-white/60">
                                    <span className="font-mono text-xs">{i + 1}</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                                    <p className="text-white/40 text-sm font-light leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
                    <div className="relative aspect-video rounded-[2rem] lg:rounded-[3rem] border border-white/10 overflow-hidden bg-black/40 backdrop-blur-sm group/image shadow-2xl">
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-30 group-hover/image:opacity-10 transition-opacity z-10"></div>
                        <img
                            src="/team.png"
                            alt="IEEE Team"
                            className="w-full h-full object-cover grayscale-[20%] group-hover/image:grayscale-0 group-hover/image:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent z-20">
                            <div className="flex justify-between text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">
                                <span className="flex items-center gap-2">
                                    IEEE Synapse Team
                                </span>
                                <span>2026 HUB</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

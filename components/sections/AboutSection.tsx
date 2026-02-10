import React from 'react';
import { Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
    return (
        <section id="about" className="py-32 px-6 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
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
                    <div className="relative aspect-square rounded-[3rem] border border-white/10 overflow-hidden bg-black flex items-center justify-center p-12">
                        <div className="w-full h-full border border-primary/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-20">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/20"></div>
                                ))}
                            </div>
                            <Cpu className="h-24 w-24 text-primary animate-pulse" />
                            <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[65%] bg-primary animate-[progressBar_3s_ease-in-out_infinite]"></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase">
                                    <span>Neural Link</span>
                                    <span>Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

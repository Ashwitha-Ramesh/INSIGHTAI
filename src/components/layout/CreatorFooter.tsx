import React from 'react';
import { Github, Linkedin, Sparkles, GraduationCap, ShieldCheck, Code2 } from 'lucide-react';

export const CreatorFooter: React.FC = () => {
  return (
    <footer id="creator-footer" className="mt-16 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md py-8 px-6 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Creator Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-indigo-400 font-bold text-lg">
              AR
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-semibold text-base">Ashwitha Ramesh</h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-3 h-3" />
                B.E. Computer Science Engineering
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Creator & Lead Engineer • InsightAI Analytics Engine
            </p>
          </div>
        </div>

        {/* Links & Socials */}
        <div className="flex items-center gap-3">
          <a
            id="footer-github-link"
            href="https://github.com/Ashwitha-Ramesh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 text-slate-300 hover:text-white transition-all text-sm font-medium"
          >
            <Github className="w-4 h-4 text-slate-400" />
            <span>GitHub Profile</span>
          </a>

          <a
            id="footer-linkedin-link"
            href="https://www.linkedin.com/in/ashwitha-ramesh-0123ab315/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/15 border border-indigo-500/30 hover:border-indigo-500/50 hover:bg-indigo-600/25 text-indigo-300 hover:text-indigo-200 transition-all text-sm font-medium"
          >
            <Linkedin className="w-4 h-4 text-indigo-400" />
            <span>LinkedIn Profile</span>
          </a>
        </div>

        {/* Privacy & Client-side statement */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Client-Side Privacy Guaranteed • Zero Backend Dependency</span>
        </div>

      </div>
    </footer>
  );
};

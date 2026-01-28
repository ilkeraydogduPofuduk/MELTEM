
import React from 'react';
import { AgentStatus } from '../types';

interface AgentCardProps {
  name: string;
  role: string;
  status: AgentStatus;
  icon: string;
  lastAction: string;
  color: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, role, status, icon, lastAction, color }) => {
  const isProcessing = status !== AgentStatus.IDLE && status !== AgentStatus.COMPLETED;

  const getStatusText = (status: AgentStatus) => {
    switch (status) {
      case AgentStatus.IDLE: return 'ONLINE';
      case AgentStatus.ANALYZING: return 'SCANNING';
      case AgentStatus.PLANNING: return 'THINKING';
      case AgentStatus.PRODUCING: return 'GEN_CONTENT';
      case AgentStatus.OPTIMIZING: return 'LEARNING';
      default: return 'STANDBY';
    }
  };

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-400',
    purple: 'from-purple-600 to-indigo-500',
    pink: 'from-pink-500 to-rose-400',
    emerald: 'from-emerald-500 to-teal-400'
  };

  return (
    <div className={`bg-[#0A0A0A] border border-neutral-800 rounded-[2rem] p-6 hover:border-neutral-700 transition-all group relative overflow-hidden`}>
      {isProcessing && (
        <div className="absolute top-0 left-0 w-full h-1 bg-neutral-800">
          <div className={`h-full bg-gradient-to-r ${colorMap[color]} animate-progress`}></div>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${colorMap[color]} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
          <i className={`fas ${icon} text-xl text-white`}></i>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-blue-400 animate-ping' : 'bg-neutral-600'}`}></span>
            <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
              {getStatusText(status)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-black text-lg tracking-tight uppercase italic">{name}</h3>
        <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest mb-4">{role}</p>
      </div>
      
      <div className="mt-5 p-4 bg-black/50 rounded-2xl border border-neutral-800/50 min-h-[60px] flex items-center">
        <p className="text-[10px] text-neutral-400 font-medium leading-relaxed italic line-clamp-2">
          "{lastAction || 'Waiting for cycle...'}"
        </p>
      </div>

      <style>{`
        @keyframes progress { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        .animate-progress { animation: progress 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default AgentCard;

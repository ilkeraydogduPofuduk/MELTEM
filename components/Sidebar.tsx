
import React from 'react';

interface SidebarProps {
  activeTab: string;
  onNavigate: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onNavigate }) => {
  return (
    <div className="w-24 xl:w-72 bg-[#050505] h-screen flex flex-col border-r border-neutral-900 sticky top-0 z-50">
      <div className="p-8 xl:p-12">
        <div className="flex items-center gap-4 mb-20 cursor-pointer group" onClick={() => onNavigate('overview')}>
          <div className="w-12 h-12 bg-gradient-to-tr from-pink-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)] group-hover:rotate-12 transition-all duration-500">
            <span className="font-black text-2xl italic">M</span>
          </div>
          <div className="hidden xl:block">
            <h1 className="font-black text-xl tracking-tighter uppercase italic">Meltem</h1>
            <p className="text-[9px] text-neutral-700 font-black tracking-widest uppercase">Kernel 3.2</p>
          </div>
        </div>

        <nav className="space-y-6">
          <NavItem icon="fa-grid-2" label="CORE HUB" active={activeTab === 'overview'} onClick={() => onNavigate('overview')} />
          <NavItem icon="fa-microchip" label="AGENTS" active={activeTab === 'agents'} onClick={() => onNavigate('agents')} />
          <NavItem icon="fa-photo-film" label="ARCHIVE" active={activeTab === 'content'} onClick={() => onNavigate('content')} />
          <NavItem icon="fa-shield-halved" label="LOCK DNA" active={activeTab === 'settings'} onClick={() => onNavigate('settings')} />
        </nav>
      </div>

      <div className="mt-auto p-8 xl:p-10 hidden xl:block">
        <div className="p-6 bg-neutral-900/30 rounded-[2rem] border border-neutral-800 backdrop-blur-xl">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-neutral-600 uppercase">System Integrity</span>
              <span className="text-[10px] font-black text-emerald-500">OPTIMAL</span>
           </div>
           <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div className="w-full h-full bg-emerald-500/50"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: string; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex flex-col xl:flex-row items-center gap-3 xl:gap-5 px-0 xl:px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-white text-black shadow-2xl' : 'text-neutral-500 hover:text-white'}`}
  >
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-black text-white' : 'group-hover:bg-neutral-800 transition-colors'}`}>
      <i className={`fas ${icon} text-sm`}></i>
    </div>
    <span className="text-[9px] xl:text-[11px] font-black tracking-widest uppercase hidden xl:block">{label}</span>
  </button>
);

export default Sidebar;

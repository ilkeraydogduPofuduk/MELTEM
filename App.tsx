
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import Sidebar from './components/Sidebar';
import AgentCard from './components/AgentCard';
import ContentCard from './components/ContentCard';
import { MeltemAIService, MELTEM_DNA } from './services/geminiService';
import { AgentStatus, ContentAsset, Learning } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoopActive, setIsLoopActive] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [contents, setContents] = useState<ContentAsset[]>([]);
  const [learnings, setLearnings] = useState<Learning[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [logs, setLogs] = useState<{id: number, text: string, type: 'info' | 'success' | 'warning'}[]>([]);
  const logIdRef = useRef(0);

  const addLog = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setLogs(prev => [{ id: ++logIdRef.current, text, type }, ...prev].slice(0, 8));
  };

  const runCycle = useCallback(async () => {
    if (!isLoopActive) return;

    try {
      // 1. ANALİZ
      setActiveStep(0);
      addLog("Trendler taranıyor: Google Grounding entegrasyonu aktif.", 'info');
      const { models, sources: trendSources } = await MeltemAIService.analyzeTrends();
      setSources(trendSources);
      await new Promise(r => setTimeout(r, 1500));

      // 2. PLANLAMA
      setActiveStep(1);
      addLog("Stratejik planlama: Gemini 3 Pro ile derin analiz yapılıyor.", 'info');
      const plans = await MeltemAIService.planDailyFlow(models, learnings);
      await new Promise(r => setTimeout(r, 1500));

      // 3. ÜRETİM
      setActiveStep(2);
      addLog("Üretim: Yüksek çözünürlüklü varlıklar oluşturuluyor.", 'info');
      const newAssets: ContentAsset[] = [];
      for (const plan of plans) {
        addLog(`${plan.type} tipi içerik işleniyor: ${plan.hook}`, 'info');
        const asset = await MeltemAIService.generateAsset(plan);
        if (asset.image) {
          newAssets.push({
            id: Math.random().toString(36).substring(7),
            platform: plan.platform,
            type: plan.type,
            hook: plan.hook,
            caption: plan.caption,
            imageUrl: asset.image,
            status: 'Published',
            behaviorModel: plan.location,
            visualHash: `m_${Date.now()}_${Math.random().toString(16).slice(2,6)}`,
            metrics: {
              views: Math.floor(Math.random() * 1000) + 500,
              naturalnessScore: plan.predictedNaturalness || 96,
              aiFeelingRisk: 100 - (plan.predictedNaturalness || 96),
              engagementRate: Math.random() * 8 + 3,
              audioDepth: Math.floor(Math.random() * 20) + 80
            }
          });
          addLog(`Yayınlandı: ${plan.platform} için ${plan.type} hazır.`, 'success');
        }
        await new Promise(r => setTimeout(r, 800));
      }
      setContents(prev => [...newAssets, ...prev].slice(0, 30));

      // 4. ANALİZ
      setActiveStep(3);
      addLog("Öğrenme döngüsü: İzleyici tepkileri simüle ediliyor.", 'info');
      await new Promise(r => setTimeout(r, 1500));
      
      if (isLoopActive) setTimeout(runCycle, 15000);
    } catch (e) {
      console.error(e);
      addLog("Sistem hatası: Kritik döngü kesintisi!", 'warning');
      setIsLoopActive(false);
    }
  }, [isLoopActive, learnings]);

  useEffect(() => { if (isLoopActive) runCycle(); }, [isLoopActive, runCycle]);

  const statsData = useMemo(() => {
    return contents.slice(0, 10).reverse().map((c, i) => ({
      name: `T${i}`,
      impact: c.metrics?.views || 0,
      natural: c.metrics?.naturalnessScore || 0
    }));
  }, [contents]);

  return (
    <div className="flex h-screen bg-[#020202] text-white font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} onNavigate={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto px-12 py-10 relative custom-scrollbar">
        {/* Futuristic Background Blur Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-600/10 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

        <header className="flex justify-between items-center mb-12 relative z-10">
          <div>
            <div className="flex items-center gap-5 mb-2">
              <h1 className="text-6xl font-black tracking-tighter italic uppercase bg-gradient-to-br from-white via-white/80 to-neutral-700 bg-clip-text text-transparent">Meltem.Core</h1>
              <div className="h-px w-20 bg-neutral-800"></div>
              <span className="text-pink-500 font-black text-[10px] tracking-[0.5em] uppercase animate-pulse">Live OS v3.2</span>
            </div>
            <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-[0.3em]">Autonomous Neural Content Orchestrator</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="bg-neutral-900/50 border border-neutral-800 px-6 py-3 rounded-2xl hidden xl:flex flex-col gap-1">
              <p className="text-[9px] font-black text-neutral-600 uppercase">DNA Stability</p>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500" style={{ width: '99.2%' }}></div>
                </div>
                <span className="text-[10px] font-black text-white">99.2%</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsLoopActive(!isLoopActive)}
              className={`relative overflow-hidden px-12 py-5 rounded-2xl font-black text-[12px] tracking-[0.2em] transition-all group ${isLoopActive ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'bg-white text-black hover:scale-105'}`}
            >
              <span className="relative z-10">{isLoopActive ? 'DÖNGÜYÜ DURDUR' : 'OTONOM BAŞLAT'}</span>
              <div className={`absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300`}></div>
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-12 gap-10 relative z-10">
            {/* Top Agents Panel */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-5">
              <AgentCard name="Trend" role="Data Mining" status={activeStep === 0 && isLoopActive ? AgentStatus.ANALYZING : AgentStatus.IDLE} icon="fa-bolt-lightning" lastAction={logs.find(l => l.text.includes('Trend'))?.text || "Hazır"} color="blue" />
              <AgentCard name="Brain" role="Cognitive" status={activeStep === 1 && isLoopActive ? AgentStatus.PLANNING : AgentStatus.IDLE} icon="fa-microchip" lastAction={logs.find(l => l.text.includes('Stratejik'))?.text || "Beklemede"} color="purple" />
              <AgentCard name="Studio" role="Generative" status={activeStep === 2 && isLoopActive ? AgentStatus.PRODUCING : AgentStatus.IDLE} icon="fa-film" lastAction={logs.find(l => l.text.includes('Üretim'))?.text || "Aktif"} color="pink" />
              <AgentCard name="Growth" role="Recursive" status={activeStep === 3 && isLoopActive ? AgentStatus.OPTIMIZING : AgentStatus.IDLE} icon="fa-chart-pie" lastAction={logs.find(l => l.text.includes('Öğrenme'))?.text || "Senkronize"} color="emerald" />
            </div>

            {/* Main Content Area */}
            <div className="col-span-12 xl:col-span-8 space-y-12">
               <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
                  <h2 className="text-2xl font-black uppercase italic tracking-tighter">Canlı Operasyon Verisi</h2>
                  <div className="flex gap-8 text-[10px] font-black text-neutral-500">
                    <button className="text-white border-b border-white pb-1">TÜM AKIŞ</button>
                    <button className="hover:text-white transition-colors">VİRAL</button>
                    <button className="hover:text-white transition-colors">YENİ</button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {contents.length === 0 ? (
                    <div className="col-span-full py-48 border border-dashed border-neutral-800 rounded-[4rem] flex flex-col items-center justify-center group">
                      <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <i className="fas fa-satellite-dish text-3xl text-neutral-700 animate-pulse"></i>
                      </div>
                      <p className="font-black text-xs text-neutral-600 tracking-[0.4em] uppercase">Neural Feed Bekleniyor...</p>
                    </div>
                  ) : (
                    contents.map(c => <ContentCard key={c.id} content={c} />)
                  )}
               </div>
            </div>

            {/* Right Side Info Panels */}
            <div className="col-span-12 xl:col-span-4 space-y-8">
               {/* Activity Log */}
               <div className="bg-[#0A0A0A] border border-neutral-800 rounded-[2.5rem] p-8 shadow-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span> Live Terminal
                  </h3>
                  <div className="space-y-4 font-mono text-[11px]">
                    {logs.map(log => (
                      <div key={log.id} className="flex gap-4 border-l border-neutral-800 pl-4 py-1 animate-fade-in">
                        <span className={`text-${log.type === 'success' ? 'green' : log.type === 'warning' ? 'red' : 'blue'}-500`}>&gt;</span>
                        <p className="text-neutral-400 leading-relaxed">{log.text}</p>
                      </div>
                    ))}
                    {logs.length === 0 && <p className="text-neutral-800 italic">No activity recorded.</p>}
                  </div>
               </div>

               {/* Growth Metrics */}
               <div className="bg-[#0A0A0A] border border-neutral-800 rounded-[2.5rem] p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-10">Büyüme İndeksi</h3>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={statsData}>
                        <defs>
                          <linearGradient id="colorImpact" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ background: '#000', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="impact" stroke="#ec4899" fillOpacity={1} fill="url(#colorImpact)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-5 mt-10">
                    <div className="bg-neutral-900/50 p-5 rounded-3xl border border-neutral-800">
                      <p className="text-[9px] font-black text-neutral-600 uppercase mb-1">Global Reach</p>
                      <p className="text-2xl font-black">1.2M+</p>
                    </div>
                    <div className="bg-neutral-900/50 p-5 rounded-3xl border border-neutral-800">
                      <p className="text-[9px] font-black text-neutral-600 uppercase mb-1">Neural Sync</p>
                      <p className="text-2xl font-black text-pink-500">98%</p>
                    </div>
                  </div>
               </div>

               {/* Trend Grounding Sources */}
               <div className="bg-[#0A0A0A] border border-neutral-800 rounded-[2.5rem] p-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-6 italic">Grounding Sources</h3>
                  <div className="space-y-3">
                    {sources.map((s, i) => (
                      <a key={i} href={s.web?.uri} target="_blank" className="flex items-center gap-4 group p-2 hover:bg-white/5 rounded-xl transition-all">
                        <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                          <i className="fas fa-link text-[10px] text-neutral-600 group-hover:text-blue-500"></i>
                        </div>
                        <p className="text-[10px] text-neutral-500 group-hover:text-white truncate flex-1 font-bold">{s.web?.title || 'External Intelligence'}</p>
                      </a>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #262626; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default App;

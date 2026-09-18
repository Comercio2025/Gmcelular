import { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { BarChart, Users, Activity, Globe } from 'lucide-react';

export const AnalyticsDashboard = () => {
    const { config } = useData();
    const [stats, setStats] = useState({
        totalVisits: 0,
        activeUsers: 0,
        visitsByDay: [0, 0, 0, 0, 0, 0, 0]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // In a real implementation, this would call your backend which proxies to GA4
                // const response = await fetch('/api/analytics');
                // const data = await response.json();

                // Simulating API delay and data (replace with real API call later)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data (set to 0 to avoid confusion until backend is ready)
                setStats({
                    totalVisits: 0,
                    activeUsers: 0,
                    visitsByDay: [0, 0, 0, 0, 0, 0, 0]
                });
            } catch (error) {
                console.error("Failed to fetch analytics", error);
            } finally {
                setLoading(false);
            }
        };

        if (config.googleAdsId) {
            fetchStats();
        } else {
            setLoading(false);
        }
    }, [config.googleAdsId]);

    if (!config.googleAdsId) {
        return (
            <div className="bg-surface p-10 border border-white/10 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-50 blur-3xl pointer-events-none" />
                <BarChart className="w-16 h-16 text-blue-500/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight font-display">Analytics Desconectado_</h3>
                <p className="text-gray-400 mb-6 text-sm max-w-sm mx-auto">Vincule seu Google Analytics (GA4) para monitorar conversões e tráfego técnico em tempo real.</p>
                <div className="text-[10px] font-mono text-blue-400/60 bg-blue-500/5 border border-blue-500/10 px-4 py-2 uppercase tracking-widest">
                    Status: Aguardando Configuração de API
                </div>
            </div>
        );
    }

    const maxVisits = Math.max(...stats.visitsByDay, 1);

    return (
        <div className="space-y-6">
            <h3 className="text-sm font-mono font-bold text-blue-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Performance do Site (GA4)_
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Visits */}
                <div className="bg-surface p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe className="w-24 h-24 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">Visitas Totais</p>
                        <h4 className="text-3xl font-bold text-white">
                            {loading ? '...' : stats.totalVisits.toLocaleString()}
                        </h4>
                        <span className="text-[10px] text-green-500/80 font-mono font-bold uppercase tracking-tighter">+12% VS DELTA</span>
                    </div>
                </div>

                {/* Active Users */}
                <div className="bg-surface p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-24 h-24 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1">Usuários Ativos (Agora)</p>
                        <h4 className="text-3xl font-bold text-white">
                            {loading ? '...' : stats.activeUsers}
                        </h4>
                        <span className="flex items-center gap-2 text-[10px] text-green-500/80 font-mono font-bold h-4 uppercase tracking-tighter">
                            <span className="w-2 h-2 bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></span>
                            Live Connection
                        </span>
                    </div>
                </div>

                {/* Visits Chart (Simple SVG) */}
                <div className="bg-surface p-6 border border-white/10 shadow-2xl flex flex-col justify-between">
                    <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">Visitas (Últimos 7 dias)</p>
                    {loading ? (
                        <div className="h-24 flex items-center justify-center text-gray-400 font-mono text-[10px]">SYNCING DATA...</div>
                    ) : (
                        <div className="flex items-end justify-between h-24 gap-2">
                            {stats.visitsByDay.map((val, idx) => (
                                <div key={idx} className="w-full flex flex-col justify-end items-center group relative">
                                    <div
                                        className="w-full bg-blue-600/20 hover:bg-blue-600/80 rounded-t-md transition-all duration-500 relative"
                                        style={{ height: `${(val / maxVisits) * 100}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {val} visitas
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

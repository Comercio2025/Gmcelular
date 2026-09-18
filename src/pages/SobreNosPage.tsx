import { useData } from '../contexts/DataContext';
import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';

const ICON_MAP: Record<string, string> = {
    'smartphone': '📱', 'celular': '📱', 'iphone': '🍎', 'reparo': '🔧',
    'manutenção': '🔧', 'assistência': '🛠️', 'tela': '📺', 'bateria': '🔋',
    'acessório': '🎧', 'capa': '🛡️', 'carregador': '⚡', 'fone': '🎧',
    'tablet': '📟', 'notebook': '💻', 'informática': '🖥️', 'câmera': '📷',
};

function getIcon(service: string): string {
    const lower = service.toLowerCase();
    for (const [key, icon] of Object.entries(ICON_MAP)) {
        if (lower.includes(key)) return icon;
    }
    return '✨';
}

export const SobreNosPage = () => {
    const { pages, config, loading } = useData();
    const { slug } = useParams<{ slug: string }>();

    if (loading) {
        return (
            <Layout>
                <div className="h-[60vh] flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

    const page = pages.find(p => p.slug === slug && p.active);
    const services = config.servicesList?.split(',').map(s => s.trim()).filter(Boolean) || [];
    const founded = parseInt(config.foundedYear || '2015');
    const years = new Date().getFullYear() - founded;

    return (
        <Layout>
            <div style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1220 100%)', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

                {/* ── HERO ── */}
                <section style={{
                    position: 'relative', overflow: 'hidden', minHeight: '400px',
                    display: 'flex', alignItems: 'center', padding: '100px 24px 60px',
                }}>
                    {/* Background glow */}
                    <div style={{
                        position: 'absolute', top: '-40%', left: '50%', transform: 'translateX(-50%)',
                        width: '700px', height: '700px', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(33,118,255,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    <div style={{ maxWidth: '900px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(33,118,255,0.12)', border: '1px solid rgba(33,118,255,0.3)',
                            color: '#7eb8ff', fontSize: '0.72rem', fontWeight: 700,
                            padding: '5px 14px', borderRadius: '999px', marginBottom: '18px',
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>
                            🏪 Nossa História
                        </span>
                        <h1 style={{
                            fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 900,
                            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '18px',
                            background: 'linear-gradient(135deg, #ffffff 30%, #7eb8ff 100%)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            {years}+ anos de história
                        </h1>
                        <p style={{ fontSize: '1.05rem', color: 'rgba(200,215,255,0.7)', maxWidth: '560px', lineHeight: 1.7 }}>
                            {config.description || `Nossa missão em ${config.address?.split('-').pop()?.trim() || 'sua cidade'} é conectar pessoas através da tecnologia e excelência em serviços.`}
                        </p>
                    </div>
                </section>

                {/* ── STATS ── */}
                <section style={{ padding: '0 24px 60px' }}>
                    <div style={{
                        maxWidth: '900px', margin: '0 auto',
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px',
                    }}>
                        {[
                            { label: 'Clientes Felizes', value: '10k+', icon: '😊' },
                            { label: 'Reparos Feitos', value: '5k+', icon: '🔧' },
                            { label: 'Anos de Experiência', value: `${years}+`, icon: '⭐' },
                        ].map((stat) => (
                            <div key={stat.label} style={{
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px', padding: '28px 20px', textAlign: 'center',
                                backdropFilter: 'blur(12px)',
                            }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{stat.icon}</div>
                                <div style={{
                                    fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900,
                                    background: 'linear-gradient(135deg, #2176ff, #7eb8ff)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    lineHeight: 1,
                                }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'rgba(200,215,255,0.55)', marginTop: '6px', fontWeight: 500 }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── RICH CONTENT (editor admin) ── */}
                {page?.content && (
                    <section style={{ padding: '0 24px 60px' }}>
                        <div style={{
                            maxWidth: '900px', margin: '0 auto',
                            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '20px', padding: '40px',
                        }}>
                            <div
                                className="ql-editor prose prose-invert max-w-none"
                                style={{ color: 'rgba(200,215,255,0.8)', lineHeight: 1.8 }}
                                dangerouslySetInnerHTML={{ __html: page.content }}
                            />
                        </div>
                    </section>
                )}

                {/* ── SERVICES ── */}
                {services.length > 0 && (
                    <section style={{ padding: '0 24px 60px' }}>
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <h2 style={{
                                    fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 800,
                                    color: '#fff', letterSpacing: '-0.02em',
                                }}>
                                    O que oferecemos
                                </h2>
                                <div style={{ width: '48px', height: '3px', background: 'linear-gradient(90deg,#1565d8,#2176ff)', borderRadius: '999px', margin: '12px auto 0' }} />
                            </div>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '14px',
                            }}>
                                {services.map((svc, i) => (
                                    <div key={i} style={{
                                        background: 'rgba(33,118,255,0.06)', border: '1px solid rgba(33,118,255,0.15)',
                                        borderRadius: '14px', padding: '20px 14px', textAlign: 'center',
                                        transition: 'all 0.25s',
                                    }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(33,118,255,0.14)';
                                            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(33,118,255,0.4)';
                                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLDivElement).style.background = 'rgba(33,118,255,0.06)';
                                            (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(33,118,255,0.15)';
                                            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <div style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{getIcon(svc)}</div>
                                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(200,215,255,0.85)' }}>{svc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── WORKING HOURS + ADDRESS ── */}
                <section style={{ padding: '0 24px 80px' }}>
                    <div style={{
                        maxWidth: '900px', margin: '0 auto',
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px',
                    }}>
                        {/* Address */}
                        {config.address && (
                            <div style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px', padding: '28px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'rgba(33,118,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                                    }}>📍</div>
                                    <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Localização</h3>
                                </div>
                                <p style={{ color: 'rgba(200,215,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                                    {config.address}
                                </p>
                            </div>
                        )}

                        {/* Hours */}
                        {(config.workingHoursWeek || config.workingHoursSat) && (
                            <div style={{
                                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px', padding: '28px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <div style={{
                                        width: '36px', height: '36px', borderRadius: '10px',
                                        background: 'rgba(33,118,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                                    }}>🕐</div>
                                    <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Horário de Funcionamento</h3>
                                </div>
                                {config.workingHoursWeek && (
                                    <p style={{ color: 'rgba(200,215,255,0.65)', fontSize: '0.85rem', marginBottom: '8px' }}>
                                        <span style={{ color: '#7eb8ff', fontWeight: 600 }}>Seg – Sex: </span>{config.workingHoursWeek}
                                    </p>
                                )}
                                {config.workingHoursSat && (
                                    <p style={{ color: 'rgba(200,215,255,0.65)', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#7eb8ff', fontWeight: 600 }}>Sábado: </span>{config.workingHoursSat}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* WhatsApp CTA */}
                        {config.whatsappNumber && (
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(33,118,255,0.12), rgba(33,118,255,0.06))',
                                border: '1px solid rgba(33,118,255,0.25)', borderRadius: '16px', padding: '28px',
                                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '14px',
                            }}>
                                <h3 style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Fale com a gente</h3>
                                <a
                                    href={`https://wa.me/55${config.whatsappNumber.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px', justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #1565d8, #2176ff)', color: '#fff',
                                        fontWeight: 700, fontSize: '0.88rem', padding: '12px 20px', borderRadius: '12px',
                                        textDecoration: 'none', boxShadow: '0 6px 20px rgba(33,118,255,0.35)', transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                                >
                                    💬 WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </Layout>
    );
};

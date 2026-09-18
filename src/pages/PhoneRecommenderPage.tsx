import { useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { useData } from '../contexts/DataContext';
import type {
  AIRecommendationResponse,
  LocalRecommendationResult,
  PhonePriorityWeights,
  PhoneRecommendationProfile,
  PhoneUsageOption,
} from '../types';
import { recommendPhonesLocally } from '../utils/phoneRecommender';
import { LoaderCircle, Sparkles, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

type RankedResult = LocalRecommendationResult & {
  aiScore?: number;
  aiJustification?: string;
};

const usageOptions: Array<{ id: PhoneUsageOption; label: string }> = [
  { id: 'fotos_videos', label: 'Fotos e videos' },
  { id: 'redes_sociais', label: 'Redes sociais' },
  { id: 'jogos', label: 'Jogos' },
  { id: 'trabalho_estudo', label: 'Trabalho e estudo' },
  { id: 'musica_podcast', label: 'Musica e podcast' },
  { id: 'navegacao_apps', label: 'Navegacao e apps' },
];

const steps = ['Faixa de preco', 'Marcas preferidas', 'Uso do celular', 'Prioridades', 'Resultados'];

const priorityLabels: Array<{ key: keyof PhonePriorityWeights; label: string }> = [
  { key: 'camera', label: 'Camera' },
  { key: 'performance', label: 'Performance' },
  { key: 'battery', label: 'Bateria' },
  { key: 'costBenefit', label: 'Custo-beneficio' },
];

const formatBRL = (price: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(price);

export const PhoneRecommenderPage = () => {
  const { products, config, recommendSmartphonesAI } = useData();

  const smartProducts = useMemo(
    () => products.filter((p) => p.active !== false && p.category?.toLowerCase().includes('smart')),
    [products],
  );

  const minCatalogPrice = Math.floor(Math.min(...smartProducts.map((p) => p.price), 800));
  const maxCatalogPrice = Math.ceil(Math.max(...smartProducts.map((p) => p.price), 6000));

  const availableBrands = useMemo(
    () => Array.from(new Set(smartProducts.map((p) => p.brand))).filter(Boolean).sort((a, b) => a.localeCompare(b)),
    [smartProducts],
  );

  const [step, setStep] = useState(1);
  const [minBudget, setMinBudget] = useState(minCatalogPrice);
  const [maxBudget, setMaxBudget] = useState(maxCatalogPrice);
  const [preferredBrands, setPreferredBrands] = useState<string[]>([]);
  const [usages, setUsages] = useState<PhoneUsageOption[]>([]);
  const [priorities, setPriorities] = useState<PhonePriorityWeights>({
    camera: 3,
    performance: 3,
    battery: 3,
    costBenefit: 4,
  });
  const [preferNew, setPreferNew] = useState(true);
  const [needInStock, setNeedInStock] = useState(true);

  const [loading, setLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [usedAI, setUsedAI] = useState(false);
  const [results, setResults] = useState<RankedResult[]>([]);

  const profile: PhoneRecommendationProfile = {
    minBudget,
    maxBudget,
    preferredBrands,
    usages,
    priorities,
    preferNew,
    needInStock,
  };

  const toggleBrand = (brand: string) => {
    setPreferredBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleUsage = (usage: PhoneUsageOption) => {
    setUsages((prev) => {
      if (prev.includes(usage)) return prev.filter((item) => item !== usage);
      if (prev.length >= 3) return prev;
      return [...prev, usage];
    });
  };

  const runRecommendation = async () => {
    setLoading(true);
    setUsedAI(false);
    setAiSummary('');

    const localResults = recommendPhonesLocally(products, profile);
    setResults(localResults);

    try {
      const aiResponse: AIRecommendationResponse = await recommendSmartphonesAI({
        profile,
        candidates: localResults.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          condition: item.product.condition,
          status: item.product.status,
          description: item.product.description,
          localScore: Number(item.score.toFixed(2)),
          localMatch: item.match,
        })),
      });

      const rankedById = new Map(aiResponse.ranked.map((entry) => [entry.id, entry]));
      const merged = localResults
        .map((item) => ({
          ...item,
          aiScore: rankedById.get(item.product.id)?.score,
          aiJustification: rankedById.get(item.product.id)?.justification,
        }))
        .sort((a, b) => {
          const aiA = a.aiScore ?? -1;
          const aiB = b.aiScore ?? -1;
          if (aiA !== aiB) return aiB - aiA;
          return b.score - a.score;
        });

      if (merged.some((item) => typeof item.aiScore === 'number')) {
        setUsedAI(true);
        setResults(merged);
      }

      if (aiResponse.summary) {
        setAiSummary(aiResponse.summary);
      }
    } catch (error) {
      console.warn('AI recommendation fallback enabled:', error);
    } finally {
      setLoading(false);
      setStep(5);
    }
  };

  const nextStep = async () => {
    if (step === 3 && usages.length === 0) return;
    if (step === 4) {
      await runRecommendation();
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const previousStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const reset = () => {
    setStep(1);
    setPreferredBrands([]);
    setUsages([]);
    setPriorities({ camera: 3, performance: 3, battery: 3, costBenefit: 4 });
    setPreferNew(true);
    setNeedInStock(true);
    setResults([]);
    setAiSummary('');
    setUsedAI(false);
    setMinBudget(minCatalogPrice);
    setMaxBudget(maxCatalogPrice);
  };

  const renderWizard = () => {
    if (step === 1) {
      return (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Quanto voce quer investir?</h2>
            <p className="text-gray-300 mt-2">A faixa de preco ajuda a filtrar opcoes realistas para o seu perfil.</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-300 mb-2">Preco minimo</p>
                <input
                  type="range"
                  min={minCatalogPrice}
                  max={maxBudget}
                  step={50}
                  value={minBudget}
                  onChange={(e) => setMinBudget(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-blue-300 font-semibold mt-2">{formatBRL(minBudget)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-2">Preco maximo</p>
                <input
                  type="range"
                  min={minBudget}
                  max={maxCatalogPrice}
                  step={50}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-blue-300 font-semibold mt-2">{formatBRL(maxBudget)}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Tem marcas preferidas?</h2>
            <p className="text-gray-300 mt-2">Opcional: se nao tiver preferencia, siga para a proxima etapa.</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex flex-wrap gap-3">
              {availableBrands.map((brand) => {
                const active = preferredBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      active
                        ? 'bg-blue-600 text-white border-blue-400/30'
                        : 'bg-surface/10 text-gray-200 border-white/10 hover:border-blue-400/30'
                    }`}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Para que voce usa mais o celular?</h2>
            <p className="text-gray-300 mt-2">Selecione ate 3 opcoes para priorizar a recomendacao.</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10">
            <div className="flex flex-wrap gap-3">
              {usageOptions.map((usage) => {
                const active = usages.includes(usage.id);
                const limitReached = usages.length >= 3 && !active;
                return (
                  <button
                    key={usage.id}
                    onClick={() => toggleUsage(usage.id)}
                    disabled={limitReached}
                    className={`px-4 py-2 rounded-full border transition-all ${
                      active
                        ? 'bg-blue-600 text-white border-blue-400/30'
                        : 'bg-surface/10 text-gray-200 border-white/10 hover:border-blue-400/30 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    {usage.label}
                  </button>
                );
              })}
            </div>
            {usages.length === 0 && <p className="text-amber-300 text-sm mt-4">Escolha pelo menos 1 uso para continuar.</p>}
          </div>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Defina suas prioridades</h2>
            <p className="text-gray-300 mt-2">Quanto maior a nota (1 a 5), maior o peso na recomendacao.</p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
            {priorityLabels.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between">
                  <label className="text-gray-100 font-semibold">{item.label}</label>
                  <span className="text-blue-300 font-semibold">{priorities[item.key]}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={priorities[item.key]}
                  onChange={(e) =>
                    setPriorities((prev) => ({
                      ...prev,
                      [item.key]: Number(e.target.value),
                    }))
                  }
                  className="w-full"
                />
              </div>
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-3 bg-surface/10 rounded-xl px-4 py-3 border border-white/10">
                <input
                  type="checkbox"
                  checked={preferNew}
                  onChange={(e) => setPreferNew(e.target.checked)}
                />
                <span className="text-gray-100">Preferir aparelhos novos</span>
              </label>

              <label className="flex items-center gap-3 bg-surface/10 rounded-xl px-4 py-3 border border-white/10">
                <input
                  type="checkbox"
                  checked={needInStock}
                  onChange={(e) => setNeedInStock(e.target.checked)}
                />
                <span className="text-gray-100">Mostrar somente em estoque</span>
              </label>
            </div>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="h-[360px] flex flex-col items-center justify-center gap-4">
          <LoaderCircle className="w-10 h-10 text-blue-400 animate-spin" />
          <p className="text-gray-300">Analisando seu perfil e calculando os melhores smartphones...</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Melhores resultados para voce</h2>
            <p className="text-gray-300 mt-2">
              {usedAI
                ? 'Ranking refinado com IA Gemini + regras tecnicas de compatibilidade.'
                : 'Ranking baseado em regras tecnicas de compatibilidade do seu perfil.'}
            </p>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface/10 border border-white/10 text-gray-100 hover:border-blue-400/40 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>

        {aiSummary && (
          <div className="rounded-2xl border border-blue-400/30 bg-blue-500/10 p-4 text-blue-100">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              Resumo da IA
            </div>
            <p className="text-sm leading-relaxed">{aiSummary}</p>
          </div>
        )}

        {results.length === 0 && (
          <div className="glass-card rounded-2xl p-8 border border-white/10 text-center text-gray-300">
            Nao encontramos smartphones com os filtros atuais. Ajuste faixa de preco ou disponibilidade.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((result, index) => {
            const message = `Ola! Vi a recomendacao do ${result.product.name} no assistente do site e quero mais detalhes.`;
            const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;

            return (
              <article
                key={result.product.id}
                className="glass-card rounded-2xl p-5 border border-white/10 hover:border-blue-400/30 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-200 border border-orange-300/30 font-semibold">
                    {index + 1}o lugar
                  </span>
                  <span className="text-sm text-blue-300 font-semibold">Match {result.match}%</span>
                </div>

                <img
                  src={result.product.imageUrl}
                  alt={result.product.name}
                  className="w-full h-56 object-cover rounded-xl mb-4"
                  loading="lazy"
                />

                <h3 className="text-xl font-bold text-white">{result.product.name}</h3>
                <p className="text-gray-300 text-sm mt-1">{result.product.brand} • {result.product.condition}</p>
                <p className="text-blue-300 text-2xl font-bold mt-3">{formatBRL(result.product.price)}</p>

                <div className="mt-4 space-y-2">
                  {result.reasons.slice(0, 2).map((reason) => (
                    <p key={reason} className="text-sm text-gray-200">• {reason}</p>
                  ))}
                  {result.aiJustification && (
                    <p className="text-sm text-blue-100 bg-blue-600/20 border border-blue-400/30 rounded-lg px-3 py-2">
                      <span className="font-semibold">IA:</span> {result.aiJustification}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex gap-2">
                  <Link
                    to={`/product/${result.product.id}`}
                    className="flex-1 text-center px-4 py-2 rounded-xl bg-surface/10 border border-white/10 text-gray-100 hover:border-blue-400/40 transition-all"
                  >
                    Ver detalhes
                  </Link>
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all"
                  >
                    WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <section className="space-y-8 pt-4 pb-10">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Qual o melhor celular para voce?</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            Responda em poucos passos e receba recomendacoes personalizadas com ranking por perfil.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {steps.map((label, index) => {
            const current = index + 1;
            const active = step >= current;
            return (
              <div
                key={label}
                className={`rounded-xl border px-3 py-3 text-center transition-all ${
                  active
                    ? 'bg-blue-600/20 border-blue-400/40 text-blue-100'
                    : 'bg-surface/10 border-white/10 text-gray-300'
                }`}
              >
                <div className="text-sm font-bold">{current}</div>
                <div className="text-xs mt-1">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8">{renderWizard()}</div>

        {step < 5 && (
          <div className="flex justify-between gap-4">
            <button
              onClick={previousStep}
              disabled={step === 1}
              className="px-5 py-3 rounded-xl border border-white/15 text-gray-100 disabled:opacity-40"
            >
              Voltar
            </button>

            <button
              onClick={nextStep}
              disabled={step === 3 && usages.length === 0}
              className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-40"
            >
              {step === 4 ? 'Gerar recomendacao' : 'Proximo'}
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

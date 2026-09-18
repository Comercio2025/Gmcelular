import type {
  LocalRecommendationResult,
  PhoneRecommendationProfile,
  PhoneUsageOption,
  Product,
} from '../types';

const usageKeywords: Record<PhoneUsageOption, string[]> = {
  fotos_videos: ['camera', 'foto', 'video', 'selfie', '200mp', 'estabilizacao', 'optica'],
  redes_sociais: ['instagram', 'tiktok', 'facebook', 'reels', 'selfie', 'amoled', '120hz'],
  jogos: ['jogo', 'gaming', 'snapdragon', 'dimensity', '8gen', 'gpu', '120hz', '12gb', 'ram'],
  trabalho_estudo: ['bateria', 'duracao', 'produtividade', 'multitarefa', '128gb', '256gb', '5g'],
  musica_podcast: ['audio', 'som', 'stereo', 'dolby', 'podcast', 'musica'],
  navegacao_apps: ['maps', 'waze', 'gps', '5g', 'apps', 'fluido'],
};

const priorityKeywords = {
  camera: ['camera', 'foto', 'video', 'selfie', 'lente', 'mp'],
  performance: ['snapdragon', 'dimensity', '8gen', 'processador', 'ram', '120hz', 'gaming'],
  battery: ['bateria', 'mah', 'duracao', 'carregamento'],
  costBenefit: ['beneficio', 'custo', 'preco', 'oferta', 'promocao'],
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const keywordHits = (text: string, keywords: string[]) => {
  let hits = 0;
  for (const keyword of keywords) {
    if (text.includes(keyword)) hits += 1;
  }
  return hits;
};

const scoreByBudget = (price: number, minBudget: number, maxBudget: number) => {
  if (maxBudget <= minBudget) {
    return price <= maxBudget ? 20 : 6;
  }

  if (price >= minBudget && price <= maxBudget) {
    const midpoint = (minBudget + maxBudget) / 2;
    const distance = Math.abs(price - midpoint) / ((maxBudget - minBudget) / 2 || 1);
    return 30 - clamp(distance * 8, 0, 8);
  }

  if (price < minBudget) return 14;

  const overRatio = (price - maxBudget) / Math.max(maxBudget, 1);
  return clamp(10 - overRatio * 18, 0, 10);
};

export const recommendPhonesLocally = (
  products: Product[],
  profile: PhoneRecommendationProfile,
): LocalRecommendationResult[] => {
  const eligible = products.filter(
    (product) =>
      product.active !== false &&
      product.category?.toLowerCase().includes('smart') &&
      (!profile.needInStock || product.status === 'em_estoque'),
  );

  const results = eligible.map((product) => {
    const text = normalizeText(`${product.name} ${product.description} ${product.model} ${product.brand}`);
    let score = 0;
    const reasons: string[] = [];

    const budgetScore = scoreByBudget(product.price, profile.minBudget, profile.maxBudget);
    score += budgetScore;
    if (budgetScore >= 24) reasons.push('Dentro da faixa de preco ideal');

    if (profile.preferredBrands.length > 0 && profile.preferredBrands.includes(product.brand)) {
      score += 16;
      reasons.push(`Marca preferida: ${product.brand}`);
    }

    if (profile.preferNew && product.condition === 'Novo') {
      score += 8;
      reasons.push('Produto novo');
    }

    if (product.featured) {
      score += 4;
      reasons.push('Destaque da loja');
    }

    const usageHitScore = profile.usages.reduce((acc, usage) => {
      const hits = keywordHits(text, usageKeywords[usage]);
      return acc + Math.min(hits, 4);
    }, 0);

    if (usageHitScore > 0) {
      score += usageHitScore * 2.2;
      reasons.push('Aderencia ao uso informado');
    }

    const cameraHits = keywordHits(text, priorityKeywords.camera);
    const perfHits = keywordHits(text, priorityKeywords.performance);
    const batteryHits = keywordHits(text, priorityKeywords.battery);
    const valueHits = keywordHits(text, priorityKeywords.costBenefit);

    score += cameraHits * profile.priorities.camera * 0.5;
    score += perfHits * profile.priorities.performance * 0.5;
    score += batteryHits * profile.priorities.battery * 0.5;
    score += valueHits * profile.priorities.costBenefit * 0.4;

    const match = clamp(Math.round((score / 95) * 100), 45, 99);

    if (reasons.length === 0) {
      reasons.push('Boa opcao geral para o perfil selecionado');
    }

    return {
      product,
      score,
      match,
      reasons,
    };
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 8);
};

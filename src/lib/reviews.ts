// Gera dados de avaliações determinísticos por produto (para se manter estáveis entre renders)

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  date: string;
  comment: string;
}

const AUTHORS = [
  "Mariana S.", "Lucas O.", "Beatriz R.", "Pedro H.", "Camila T.",
  "Rafael M.", "Juliana A.", "Felipe C.", "Larissa P.", "Gabriel D.",
  "Ana Paula", "Thiago L.", "Fernanda K.", "Bruno V.", "Isabela G.",
];

const COMMENT_POOL = {
  5: [
    "Produto excelente, superou minhas expectativas! Chegou rápido e bem embalado.",
    "Qualidade incrível pelo preço. Recomendo demais!",
    "Simplesmente perfeito. Já é a segunda vez que compro.",
    "Melhor compra que fiz esse ano. Vale cada centavo.",
    "Atendeu tudo que eu precisava. Acabamento impecável.",
  ],
  4: [
    "Muito bom! Só achei a entrega um pouco demorada, mas o produto vale a pena.",
    "Gostei bastante, qualidade ótima. Tirei uma estrela só por um detalhe pequeno na embalagem.",
    "Cumpre o que promete. Estou satisfeito com a compra.",
    "Bem bonito e funcional. Recomendo.",
  ],
  3: [
    "É bom, mas esperava um pouco mais pelo preço.",
    "Produto ok, atende ao básico. Nada excepcional.",
    "Funciona bem, porém o material poderia ser melhor.",
  ],
  2: [
    "Achei mediano, não é tão bom quanto parece nas fotos.",
    "Esperava mais qualidade. Decepcionou um pouco.",
  ],
};

// PRNG simples (mulberry32) baseado em seed
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cache = new Map<number, { reviews: Review[]; average: number; count: number }>();

export function getProductReviews(productId: number) {
  if (cache.has(productId)) return cache.get(productId)!;

  const rng = mulberry32(productId * 9973 + 7);
  const reviews: Review[] = [];
  const numReviews = 3 + Math.floor(rng() * 4); // 3 a 6 reviews

  // Distribuição enviesada para 4-5 estrelas
  const ratingPool = [5, 5, 5, 5, 4, 4, 4, 3, 3, 2];

  for (let i = 0; i < numReviews; i++) {
    const rating = ratingPool[Math.floor(rng() * ratingPool.length)];
    const comments = COMMENT_POOL[rating as 2 | 3 | 4 | 5];
    const comment = comments[Math.floor(rng() * comments.length)];
    const author = AUTHORS[Math.floor(rng() * AUTHORS.length)];
    const daysAgo = 1 + Math.floor(rng() * 90);
    const date = new Date(Date.now() - daysAgo * 86400000).toLocaleDateString("pt-BR");

    reviews.push({
      id: `${productId}-${i}`,
      author,
      rating,
      date,
      comment,
    });
  }

  // Total de avaliações exibido (maior que reviews mostradas)
  const count = 40 + Math.floor(rng() * 260);
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Math.round((sum / reviews.length) * 10) / 10;

  const result = { reviews, average, count };
  cache.set(productId, result);
  return result;
}

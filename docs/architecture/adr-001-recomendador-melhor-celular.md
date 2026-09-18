# ADR-001: Recomendador de Melhor Celular (Hibrido Regras + Gemini)

## Status
Accepted

## Context
A GM Celular precisa de uma experiencia orientada por perfil para indicar smartphones com maior chance de conversao. O projeto ja possui React no frontend e backend PHP com integracao Gemini para artigos.

## Decision
Adotar arquitetura hibrida em duas camadas:
1. Motor local deterministico no frontend para score inicial (preco, marca, uso, prioridades, estoque e condicao).
2. Refinamento opcional por Gemini no backend para reordenar top candidatos e gerar justificativas curtas.

## Rationale
- Mantem operacao mesmo sem IA (resiliencia).
- Reusa chave e modelo Gemini ja existentes no admin.
- Evita overengineering de treinamento/fine-tuning para um catalogo dinâmico.
- Permite evolucao incremental do motor de score sem mudar UX.

## Trade-offs
- Sem fine-tuning dedicado, a IA depende de prompt/contexto.
- Parte da inferencia de uso vem de palavras-chave no texto do produto.
- Reordenacao por IA pode variar entre chamadas.

## Consequences
- Positive: recomendacoes consistentes, com explicacao comercial e fallback seguro.
- Negative: qualidade depende da qualidade dos dados de descricao dos produtos.
- Mitigation: permitir prompt customizavel (geminiRecommenderPrompt) e iterar taxonomia de palavras-chave.

## Revisit Trigger
- Catalogo acima de 3k itens ativos.
- Queda de conversao no funil do recomendador.
- Necessidade de explicacoes altamente tecnicas por segmento (gamer/foto/produtividade).

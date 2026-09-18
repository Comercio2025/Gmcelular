# Plano da Tarefa: Melhor Celular com Perfil + IA Gemini

## Objetivo
Implementar no site uma experiência guiada para recomendar celulares por perfil do cliente, com ranking confiável e explicação assistida por Gemini.

## Fases
- [x] Fase 1: Descoberta técnica e mapeamento do código existente
- [x] Fase 2: Definição arquitetural (motor híbrido: regras + IA)
- [x] Fase 3: Implementação frontend (wizard, avaliação e resultados)
- [x] Fase 4: Implementação backend (endpoint Gemini para justificativas/ranking)
- [x] Fase 5: Integração no menu/rotas e ajustes finais
- [x] Fase 6: Build/teste e validação final

## Decisões finais
- Recomendação principal baseada em score determinístico para previsibilidade e fallback.
- Gemini atua como refinador e explicador dos top candidatos.
- Treinamento/fine-tuning foi evitado nesta etapa; prompt customizável cobre ajuste de comportamento.

## Riscos remanescentes
- Catálogo com descrições pobres reduz assertividade do score por intenção.
- Dependência de Gemini para justificativas mais ricas.

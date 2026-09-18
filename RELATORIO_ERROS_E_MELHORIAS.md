# Relatório de Diagnóstico e Lições Aprendidas
**Projeto:** GM Celular (React + PHP + MySQL no cPanel)
**Data:** 05/01/2026

Este relatório detalha os 6 principais desafios enfrentados durante o deploy e o desenvolvimento, servindo como guia para evitar problemas similares em projetos futuros.

---

## 🛑 Principais Erros Ocorridos

### 1. Bloqueio de Permissão no Banco de Dados (Access Denied)
*   **O Erro:** Mesmo criando o banco e o usuário no cPanel, a conexão falhava ou não gravava dados.
*   **A Causa:** É comum criar o usuário e o banco, mas esquecer de ir na opção **"Adicionar Usuário ao Banco"** e marcar a caixa **"TODOS OS PRIVILÉGIOS"**.
*   **Sintoma:** O site lia os dados (SELECT) mas falhava silenciosamente ao salvar (INSERT), ou nem conectava.

### 2. O ERRO DO ID FANTASMA (Lógica de Salvamento)
*   **O Erro:** O site dizia que salvou, mas nada aparecia no banco.
*   **A Causa (Técnica):** O Frontend enviava um ID temporário (ex: `1767...`) para identificar o produto na tela. O Backend (PHP) via que chegou um ID e tentava fazer um `UPDATE` (Atualizar). Como esse ID não existia no banco real, o banco não atualizava nada.
*   **Solução:** O Backend precisa verificar: "Esse ID existe mesmo?". Se não existir, ele deve ignorar o ID e criar um novo (`INSERT`).

### 3. A Tela Branca da Morte (Configuração Vazia)
*   **O Erro:** Logo após conectar o banco, o site ficou todo branco.
*   **A Causa:** O banco de dados estava vazio (tabela `store_config` sem nada). O código do site tentava ler o "Nome da Loja" para mostrar no cabeçalho. Como era nulo, o Javascript quebrava.
*   **Lição:** O Frontend SEMPRE deve ter proteção contra dados vazios `(config?.nome || 'Padrão')`.

### 4. Versionamento de Arquivos de Cache (Erro 404)
*   **O Erro:** Após corrigir um bug, o site parou de carregar o Javascript.
*   **A Causa:** O Frontend moderno (Vite) gera arquivos com nomes aleatórios (`index-AbCd12.js`) para evitar que o navegador guarde versões velhas. O usuário subiu a pasta `assets` nova, mas manteve o `index.html` velho, que apontava para o arquivo antigo que não existia mais.

### 5. Configuração de Rotas (.htaccess)
*   **O Erro:** Ao atualizar a página interna, dava "Erro 404 Not Found" do servidor.
*   **A Causa:** Servidores Apache (cPanel) acham que `/admin` é uma pasta real. Em sites React (SPA), todas as rotas devem ser redirecionadas para o `index.html`. Isso exige um arquivo `.htaccess` configurado.

### 6. Imagens Base64 Cortadas
*   **Ponto de Atenção:** Imagens coladas direto no site (Base64) geram textos gigantescos. Se a coluna do banco for apenas `TEXT`, a imagem é cortada pela metade e corrompe.
*   **Solução:** A coluna no banco DEVE ser `LONGTEXT`.

---

## ✅ Guia para Próximos Prompts (Checklist)

Quando você for pedir para criar um sistema similar no futuro, inclua este **bloco técnico** no seu pedido para garantir que a IA já previna esses erros:

> **Instruções Técnicas Mandatórias:**
>
> 1.  **Proteção de Dados:** O Frontend deve ser resiliente. Se a API retornar arrays vazios ou nulos (especialmente configurações), o site NÃO pode dar tela branca. Use *Optional Chaining* (`?.`) e valores padrão em tudo.
> 2.  **Lógica de Save/Update:** No Backend (PHP), ao receber um ID para salvamento, **verifique explicitamente se o ID existe no banco** antes de tentar um `UPDATE`. Se o ID não existir no banco (mesmo que venha no JSON), force um `INSERT`.
> 3.  **Deploy em cPanel/Apache:**
>     *   Gere automaticamente um arquivo `.htaccess` para tratar rotas do React (RewriteRule).
>     *   Use `LONGTEXT` para colunas que armazenarão imagens em Base64.
> 4.  **Logging de Erros:** A API deve ter um modo de debug (log em arquivo txt) configurável via `config.php` para investigar erros de produção sem expor mensagens na tela.
> 5.  **Build:** Avise explicitamente que, ao atualizar o Frontend, devo substituir **TODA** a pasta `assets` E o arquivo `index.html` para evitar conflito de hash.

---

**Resumo:** O projeto foi um sucesso porque soubemos separar: o que é erro de servidor (permissão), o que é erro de lógica (ID) e o que é erro de ambiente (arquivos de build).

*Gerado pela sua IA Assistente.*

### 7. A Saga da Imagem Fantasma (Mapeamento de Variáveis)
*   **O Problema (Sintoma):** A imagem do produto *parecia* que não salvava. No banco de dados, o texto da imagem estava lá (debug confirmou 155KB), mas no site a área da imagem ficava vazia.
*   **A Causa Real:** O banco de dados devolvia o campo com nome `image_url` (padrão snake_case do PHP/MySQL). O Frontend (React) esperava receber `imageUrl` (padrão camelCase).
*   **O Resultado:** O site recebia os dados, procurava por `imageUrl`, achava "undefined" e mostrava nada. Enquanto isso, o dado `image_url` estava lá, invisível e ignorado.
*   **Lição:** Sempre verificar explicitamente o mapeamento de variáveis entre Backend e Frontend.

### 8. A Armadilha do Cache (Arquivos com Nome Fixo)
*   **A Decisão Crítica:** Para facilitar o upload, foi solicitado fixar o nome dos arquivos gerados (`index.js` em vez de `index-XyZ.js`).
*   **A Consequência Devastadora:** Os navegadores (Chrome) são treinados para *ignorar* downloads se o nome do arquivo não mudou.
*   **O Ciclo do Erro:**
    1.  Nós corrigíamos o código (o mapeamento da imagem).
    2.  Você subia o arquivo novo (`index.js`).
    3.  O navegador olhava o nome `index.js`, pensava "Já tenho esse!", e rodava a versão VELHA (que tinha o erro).
    4.  Nós achávamos que a correção tinha falhado e continuávamos investigando o banco de dados desnecessariamente.
*   **Solução:** Voltamos a usar nomes com "Hash" (embaralhados, ex: `index-D7s8a.js`). Isso *obriga* o navegador a baixar o novo código, pois ele nunca viu aquele nome antes.
*   **Regra de Ouro:** Em desenvolvimento web, **NUNCA force nomes fixos em arquivos de produção** se você espera ver atualizações imediatas. O cache é um inimigo silencioso.

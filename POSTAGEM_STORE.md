# 📋 Ficha Completa para Postagem na Loja de Extensões

Este documento contém **todos os campos, textos, justificativas e dimensões exatas** que você precisará preencher nos painéis de desenvolvedor:
- **Chrome Web Store** ([devconsole](https://chrome.google.com/webstore/devconsole))
- **Microsoft Edge Add-ons** ([partner.microsoft.com](https://partner.microsoft.com/dashboard/microsoftedge))

> [!TIP]
> Todos os blocos de código abaixo estão prontos para **copiar e colar** diretamente nos formulários das lojas.

---

## 🗂️ Índice dos Formulários
1. [Preparação do Arquivo ZIP](#1-preparação-do-arquivo-zip)
2. [Aba 1: Ficha da Loja (Store Listing)](#2-aba-1-ficha-da-loja-store-listing)
3. [Aba 2: Práticas de Privacidade (Privacy Practices)](#3-aba-2-práticas-de-privacidade-privacy-practices)
4. [Aba 3: Distribuição e Regiões (Distribution)](#4-aba-3-distribuição-e-regiões-distribution)
5. [Aba 4: Instruções para os Revisores da Google (Testing Instructions)](#5-aba-4-instruções-para-os-revisores-da-google-testing-instructions)
6. [Recursos Gráficos (Imagens e Screenshots)](#6-recursos-gráficos-imagens-e-screenshots)
7. [Dicas Específicas para Microsoft Edge](#7-dicas-específicas-para-microsoft-edge)

---

## 1. Preparação do Arquivo ZIP

- **Caminho do arquivo pronto:**
  ```text
  dist/watchlist-organizer-crunchyroll-v1.1.0.zip
  ```
- **Como regerar se fizer mudanças:**
  Execute no terminal PowerShell:
  ```powershell
  .\build-zip.ps1
  ```

---

## 2. Aba 1: Ficha da Loja (Store Listing)

### 📌 Nome da Extensão (Title)
> [!IMPORTANT]
> A Google proíbe nomes como "Crunchyroll Organizer" por infração de marca comercial. O formato obrigatório para aprovação sem problemas é `[Seu Nome] para/for [Marca]™`.

- **Português (padrão):**
  ```text
  Watchlist Organizer para Crunchyroll™
  ```
- **Inglês:**
  ```text
  Watchlist Organizer for Crunchyroll™
  ```

---

### 📌 Resumo / Descrição Curta (Short Description)
*(Limite máximo: 132 caracteres)*

- **Português (116 caracteres):**
  ```text
  Organiza sua Watchlist na Crunchyroll™ destacando animes em andamento e movendo episódios prioritários para o topo.
  ```
- **Inglês (108 caracteres):**
  ```text
  Organizes your Crunchyroll™ watchlist by highlighting in-progress anime and moving active episodes to the top.
  ```

---

### 📌 Categoria (Category)
- **Categoria Principal:** `Produtividade` (*Productivity*) ou `Ferramentas` (*Tools*)
- **Subcategoria / Categoria Secundária (se houver):** `Acessibilidade` (*Accessibility*) ou `Fluxo de trabalho` (*Workflow & Planning*)

---

### 📌 Idioma Principal (Default Language)
- Selecione: `Português (Brasil)` ou `English` (o projeto possui tradução bilíngue automática na pasta `_locales`).

---

### 📌 Descrição Detalhada (Detailed Description)

#### 🇧🇷 Versão em Português:
```text
Cansado de ver sua Watchlist na Crunchyroll bagunçada, com animes que você já terminou subindo para o primeiro lugar só porque saiu uma nova dublagem em outro idioma?

O Watchlist Organizer para Crunchyroll™ resolve esse problema de forma automática, inteligente e elegante!

✨ PRINCIPAIS RECURSOS:
🎯 Separação Inteligente: Move para o topo da grade todos os animes que você realmente precisa assistir:
  • "Começar a Assistir" (Animes na sua lista que você ainda não iniciou)
  • "Continuar" (Episódios pausados ou em andamento)
  • "A Seguir" (Novos episódios lançados das séries que você acompanha)
  • Animes finalizados/concluídos permanecem no final da lista

🎨 Pintura & Destaque Elegante:
  • Destaca os títulos e subtítulos de status na cor vibrante da Crunchyroll
  • Mantém total visibilidade e nitidez dos demais animes (sem poluição visual ou escurecimento agressivo)
  • Personalização opcional: ative bordas destacadas ou badges informativos no menu

⚡ Super Leve e Fluido:
  • Totalmente compatível com a interface moderna em React da Crunchyroll
  • Suporte contínuo à rolagem infinita da página sem travamentos

🎛️ Painel de Personalização Completo:
  • Escolha sua cor de destaque favorita (Laranja Crunchyroll, Ciano Neon, Roxo, Verde ou cor customizada)
  • Filtros individuais para ativar ou desativar o comportamento que desejar

🔒 100% SEGURO E PRIVADO:
  • Não coleta e não transmite nenhum dado pessoal ou histórico
  • Não tem acesso a senhas ou dados da sua conta
  • Todas as preferências são salvas apenas no armazenamento local do seu navegador

----------------------------------------------------------------
ISENÇÃO DE RESPONSABILIDADE / DISCLAIMER:
Esta extensão é um projeto independente de código aberto desenvolvido para aprimorar a usabilidade da plataforma e NÃO possui vínculo, filiação, parceria, patrocínio ou endosso da Crunchyroll, LLC ou de suas subsidiárias. Crunchyroll™ e seus respectivos logotipos são marcas comerciais registradas de Crunchyroll, LLC.
----------------------------------------------------------------
```

#### 🇺🇸 Versão em Inglês (Store Listing em Inglês):
```text
Tired of seeing your Crunchyroll Watchlist cluttered with completed anime jumping to the top just because an audio dub in another language was released?

Watchlist Organizer for Crunchyroll™ fixes this automatically and cleanly!

✨ KEY FEATURES:
🎯 Smart Sorting: Automatically moves to the top of your watchlist the anime you actually need to watch:
  • "Start Watching" (Anime added to your list that you haven't started yet)
  • "Continue" (Paused or in-progress episodes)
  • "Up Next" (Newly released episodes for shows you are following)
  • Completed anime stay neatly organized at the bottom

🎨 Elegant Highlighting:
  • Highlights title and status text in bright anime colors
  • Leaves other anime readable without harsh darkening or visual clutter
  • Optional custom borders or status badges configurable via popup

⚡ Fast & Lightweight:
  • Seamless integration with Crunchyroll's React interface
  • Fully compatible with infinite scroll loading

🎛️ Full Customization:
  • Choose your favorite theme color (Crunchyroll Orange, Neon Cyan, Purple, Green, or custom hex)
  • Toggle filters individually to match your watching style

🔒 100% PRIVATE & SECURE:
  • Collects zero personal data, history, or credentials
  • Operates entirely within your local browser storage

----------------------------------------------------------------
DISCLAIMER:
This extension is an independent, open-source project created to improve user experience. It is NOT affiliated with, authorized by, endorsed by, or in any way officially connected with Crunchyroll, LLC or any of its subsidiaries. Crunchyroll™ and related marks are registered trademarks of Crunchyroll, LLC.
----------------------------------------------------------------
```

---

## 3. Aba 2: Práticas de Privacidade (Privacy Practices)

A Google exige preenchimento minucioso desta seção sob risco de reprovação imediata.

### 📌 Finalidade Única (Single Purpose Description)
*(Explicação em uma ou duas frases sobre a única coisa que sua extensão faz)*

- **Copie e cole:**
  ```text
  Organizar e destacar visualmente os animes em andamento na Watchlist da Crunchyroll para facilitar a localização de episódios pendentes pelo usuário.
  ```
- **Versão em Inglês (se solicitada):**
  ```text
  Visually highlight and organize in-progress anime on the Crunchyroll Watchlist to help users quickly locate pending episodes.
  ```

---

### 📌 Justificativa de Permissões (Permission Justifications)

#### Permissão: `storage`
- **Justificativa (Português):**
  ```text
  Utilizada exclusivamente para salvar localmente no navegador as preferências visuais do usuário, como cor de destaque selecionada, filtros de status ativos e opções de bordas/badges.
  ```
- **Justificativa (Inglês):**
  ```text
  Used strictly to store user visual preferences locally on the browser, such as theme color, active status filters, and optional border/badge styling.
  ```

#### Permissão de Host / Scripts de Conteúdo (`*://*.crunchyroll.com/*/watchlist*`)
- **Justificativa (Português):**
  ```text
  Necessária para injetar os estilos visuais (CSS) e o script de ordenação exclusivamente na página de Watchlist da Crunchyroll, reorganizando os cards de animes na grade conforme o status de visualização.
  ```
- **Justificativa (Inglês):**
  ```text
  Required to inject visual styles (CSS) and sorting logic strictly into the Crunchyroll Watchlist page to organize the anime cards based on watch progress.
  ```

---

### 📌 Coleta de Dados do Usuário (Data Collection)
> [!IMPORTANT]
> A resposta para **TODAS** as opções abaixo deve ser **NÃO** (desmarcado / No data collected):

| Categoria de Dado | Coletado? | Observação |
| :--- | :---: | :--- |
| Informações Pessoais (Nome, email, endereço) | ❌ **NÃO** | Nenhuma coleta |
| Saúde / Bem-estar | ❌ **NÃO** | Nenhuma coleta |
| Informações Financeiras / Pagamento | ❌ **NÃO** | Nenhuma coleta |
| Autenticação / Senhas | ❌ **NÃO** | Nenhuma coleta |
| Comunicações Pessoais (mensagens, chats) | ❌ **NÃO** | Nenhuma coleta |
| Localização | ❌ **NÃO** | Nenhuma coleta |
| Histórico de Navegação na Web | ❌ **NÃO** | Nenhuma coleta |
| Atividade do Usuário (cliques, tempo de uso) | ❌ **NÃO** | Nenhuma telemetria ou analytics |
| Conteúdo do Site | ❌ **NÃO** | Não transmite dados do site para servidores externos |

---

### 📌 Declarações de Conformidade (Checkboxes Obrigatórios)
Marque as 3 caixas de seleção da Google:
- [x] **Declaro que não vendo dados de usuários a terceiros.** (*I do not sell or transfer user data to third parties...*)
- [x] **Declaro que não uso dados de usuários para fins não relacionados à finalidade principal.** (*I do not use or transfer user data for purposes unrelated...*)
- [x] **Declaro que não uso dados para concessão de crédito ou empréstimos.** (*I do not use or transfer user data to determine creditworthiness...*)

---

### 📌 URL da Política de Privacidade (Privacy Policy URL)
- Link para a política de privacidade pública:
  ```text
  https://github.com/SEU_USUARIO/SEU_REPOSITORIO/blob/main/PRIVACY_POLICY.md
  ```
  *(Ou publique o arquivo `PRIVACY_POLICY.html` no GitHub Pages do seu repositório: `https://SEU_USUARIO.github.io/crunchyroll_rainbow/PRIVACY_POLICY.html`)*

---

## 4. Aba 3: Distribuição e Regiões (Distribution)

- **Visibilidade:** `Público` (*Public*)
- **Preço:** `Gratuito` (*Free - Default*)
- **Regiões geográficas:** `Todos os países` (*All regions - 100+ países*)
- **Conteúdo Maduro / Classificação Etária:** `Não` (*Does not contain mature/adult content*)

---

## 5. Aba 4: Instruções para os Revisores da Google (Testing Instructions)

> [!CAUTION]
> Revisores da Google frequentemente reprovam extensões dizendo: *"Não foi possível testar a extensão porque é necessário login"*. 
> Preencha o campo **"Informações de autenticação / Notas para o revisor"** com o texto abaixo para garantir aprovação de primeira:

```text
HOW TO TEST THIS EXTENSION:

1. This extension only runs on the Crunchyroll Watchlist URL:
   https://www.crunchyroll.com/watchlist (or localized /pt-br/watchlist, /es/watchlist, etc.)

2. No paid subscription is needed to test:
   - A free Crunchyroll account can add any anime series to their Watchlist by clicking the bookmark/watchlist icon on any anime page.
   - Once 2 or more anime series are in the watchlist (especially with different states: "Start Watching", "Continue", or newly released episodes), navigate to:
     https://www.crunchyroll.com/watchlist

3. Expected Behavior:
   - The extension will automatically organize the grid, prioritizing episodes that require user attention to the top of the grid and highlighting the titles.
   - Clicking the extension icon in the toolbar opens the popup settings menu, where the user can customize highlight colors (orange, cyan, purple, custom) and toggle filters.

4. Privacy:
   - The extension does not collect or transmit any user data. All preferences are stored strictly in chrome.storage.local.
```

---

## 6. Recursos Gráficos (Imagens e Screenshots)

### 1. Ícone da Loja (Obrigatório)
- **Dimensão:** `128 x 128 px`
- **Arquivo no projeto:** [`icons/icon128.png`](file:///e:/z-dev/node/www/crunchyroll_rainbow/icons/icon128.png)
- **Formato:** PNG com transparência.

### 2. Capturas de Tela / Screenshots (Obrigatório no mínimo 1, recomendado 2 a 4)
- **Dimensão obrigatória:** Exatamente `1280 x 800 px` OU `640 x 400 px` (formato 16:10).
- **Formatos aceitos:** PNG ou JPEG (sem canal alfa/transparência).
- **Sugestão dos prints para tirar:**
  - **Screenshot 1:** Página da Watchlist da Crunchyroll com a extensão em ação (animes com títulos destacados no topo).
  - **Screenshot 2:** Menu Popup aberto mostrando a paleta de cores e interruptores de filtros.
  - **Screenshot 3:** Comparativo visual (Antes vs Depois) mostrando a organização limpa da grade.

### 3. Imagem Promocional Pequena (Small Promo Tile - Opcional, mas altamente recomendada)
- **Dimensão:** `440 x 280 px`
- **Conteúdo:** Logotipo/ícone estilizado com o nome "Watchlist Organizer" e fundo com degradê escuro.

### 4. Imagem Promocional Grande (Marquee Promo Tile - Opcional)
- **Dimensão:** `1400 x 560 px`

---

## 7. Dicas Específicas para Microsoft Edge

Publicar na **Microsoft Edge Add-ons** é **100% gratuito** (não há taxa de desenvolvedor):
1. Acesse o [Microsoft Partner Center](https://partner.microsoft.com/dashboard/microsoftedge).
2. Crie sua conta de desenvolvedor Microsoft.
3. Você tem duas opções super rápidas:
   - **Opção A (Mais rápida):** Após sua extensão ser aprovada na Chrome Web Store, clique em **"Importar da Chrome Web Store"** no painel da Microsoft. O Edge copia automaticamente todas as descrições, prints e pacote!
   - **Opção B (Manual direta):** Clique em **"Criar nova extensão"**, envie o mesmo arquivo `.zip` da pasta `dist/` e copie e cole as mesmas descrições deste documento.

---

## ✅ Checklist Final antes de Clicar em "Enviar para Análise"

- [ ] Arquivo ZIP `dist/watchlist-organizer-crunchyroll-v1.1.0.zip` enviado na aba **Pacote**.
- [ ] Nome e descrição curta conferidos (respeitando a regra de marcas com `para Crunchyroll™`).
- [ ] Descrição completa copiada e colada (incluindo o bloco de Disclaimer no final).
- [ ] Pelo menos 1 screenshot em `1280x800 px` enviado.
- [ ] Ícone `128x128 px` enviado.
- [ ] Justificativa da permissão `storage` preenchida.
- [ ] Todas as caixas de coleta de dados marcadas como "NÃO".
- [ ] As 3 caixas de conformidade de privacidade marcadas.
- [ ] URL da Política de Privacidade preenchida.
- [ ] Bloco de "Notas para o Revisor" preenchido com as instruções de teste.
- [ ] Clique em **"Enviar para análise"** (*Submit for review*)!

# 📺 Crunchyroll Watchlist Organizer (v1.1.0)

Extensão de navegador (Manifest V3) e Userscript para a [Watchlist da Crunchyroll](https://www.crunchyroll.com/pt-br/watchlist).

Organiza sua lista de animes de forma inteligente: **pinta o texto** ("Começar a Assistir", "Continuar", "A Seguir") e **move para o topo** tudo o que você está assistindo ativamente ou precisa começar, mantendo a tela limpa e nítida sem escurecer os animes já vistos.

---

## 🚀 Funcionalidades

- 🎯 **Separação Inteligente**:
  - **Prioritários (Move para o topo e destaca)**:
    - `Começar a Assistir` (Animes que você ainda não começou)
    - `Continuar` (Episódios pausados ou em andamento)
    - `A Seguir` (Novos episódios recém-lançados aguardando você assistir)
    - `Assistir` (Episódios prontos)
  - **Sem escurecer a tela**:
    - `Assistir de Novo` (Animes que você já terminou mantêm 100% de visibilidade e nitidez, sem tela escura).
- 🎨 **Pintura e Destaque Visual Limpo**:
  - Pinta somente o texto do título e do subtítulo de status na cor escolhida (padrão Laranja Crunchyroll `#f47521`).
  - Sem bordas pesadas ou poluição visual nos cards.
  - Opções no menu para ativar bordas ou badges se desejar.
- ⚡ **Reordenação Segura (100% compatível com React)**:
  - Utiliza CSS Grid `order` para mover os cards para o topo sem quebrar a árvore virtual do React e sem causar travamentos durante o **scroll infinito**.
  - Opção no menu para ordenação direta no DOM se preferir.
- 🎛️ **Popup de Configurações**:
  - Ligue ou desligue a extensão com 1 clique.
  - Paleta de cores para trocar a cor do texto (Laranja Crunchyroll, Ciano Neon, Roxo, Verde, ou cor customizada).
  - Estatísticas ao vivo: mostra quantos animes prioritários foram encontrados na tela.
  - Botão "Reorganizar Agora" para reprocessar imediatamente.
- 📊 **Barra de Resumo Integrada**:
  - Exibe uma barra sutil no topo da watchlist com a contagem de animes prontos para assistir.

---

## 📦 Como Instalar no Navegador (Chrome, Edge, Brave, Opera)

1. Abra seu navegador e acesse a página de extensões:
   - **Chrome / Brave**: `chrome://extensions`
   - **Microsoft Edge**: `edge://extensions`
   - **Opera**: `opera://extensions`
2. Ative o interruptor **"Modo do desenvolvedor"** (normalmente no canto superior direito).
3. Clique no botão **"Carregar sem compactação"** (ou *"Load unpacked"*).
4. Selecione a pasta deste projeto:
   ```
   e:\z-dev\node\www\crunchyroll_rainbow
   ```
5. Pronto! A extensão está instalada.
6. Acesse sua Watchlist na Crunchyroll: [https://www.crunchyroll.com/pt-br/watchlist](https://www.crunchyroll.com/pt-br/watchlist).

---

## 🔄 Fluxo de Atualização / Nova Versão

Quando fizer alterações e quiser lançar uma nova versão:

1. Altere o número da versão no [manifest.json](file:///e:/z-dev/node/www/crunchyroll_rainbow/manifest.json) (ex: `"1.2.0"`).
2. Execute o script de build no PowerShell:
   ```powershell
   .\build-zip.ps1
   ```
3. O script criará o pacote compactado na pasta `dist/` pronto para envio na Web Store.
4. No navegador em teste local, basta clicar no botão de **Recarregar (🔄)** em `chrome://extensions`.

---

## 🐒 Alternativa: Instalação via Tampermonkey / Violentmonkey

Se você já utiliza extensões de userscripts como **Tampermonkey** ou **Violentmonkey**:
1. Abra o arquivo [`userscript/crunchyroll-organizer.user.js`](file:///e:/z-dev/node/www/crunchyroll_rainbow/userscript/crunchyroll-organizer.user.js).
2. Copie o conteúdo e cole no seu gerenciador como um novo script.
3. Salve e recarregue a página da Watchlist!
